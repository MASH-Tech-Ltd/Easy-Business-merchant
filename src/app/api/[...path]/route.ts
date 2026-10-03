import { NextRequest, NextResponse } from "next/server";

const SESSION_SECONDS = 3 * 24 * 60 * 60; // 3 days

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function handleProxy(req: NextRequest) {
  try {
    // 1. Get the path after /api/
    const path = req.nextUrl.pathname.replace(/^\/api\//, "");

    // 2. Construct the backend URL
    // Remove the /api prefix, as BACKEND_URL usually already includes /api/v1
    const url = new URL(`${BACKEND_URL}/${path}${req.nextUrl.search}`);

    // 3. Prepare headers
    const headers = new Headers(req.headers);
    headers.delete("host"); // Let fetch set the correct host header

    // Extract real client IP from incoming request headers (Cloudflare / proxy headers)
    const cfIp = req.headers.get("cf-connecting-ip");
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");

    let clientIp: string | null = null;
    if (cfIp) {
      clientIp = cfIp.trim();
    } else if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first && first !== "127.0.0.1" && first !== "::1") {
        clientIp = first;
      }
    } else if (realIp) {
      clientIp = realIp.trim();
    }

    if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
      headers.set("x-tenant-client-ip", clientIp);
    }

    // Forward incoming cookies from browser to backend.
    // - Strip super-admin cookies (shared parent domain).
    // - De-duplicate same-named cookies (legacy domain-wide copy + host-only copy):
    //   the newest one is listed last by browsers, so the last occurrence wins.
    const cookieMap = new Map<string, string>();
    (req.headers.get("cookie") || "").split(/;\s*/).forEach((c) => {
      const idx = c.indexOf("=");
      if (idx <= 0) return;
      const name = c.slice(0, idx);
      if (name === "_super_r_tkn" || name === "_super_x_tkn") return;
      cookieMap.set(name, c.slice(idx + 1));
    });
    if (cookieMap.size) {
      headers.set(
        "cookie",
        Array.from(cookieMap.entries()).map(([k, v]) => `${k}=${v}`).join("; "),
      );
    } else {
      headers.delete("cookie");
    }

    // Attach the auth tokens from cookies if present
    const accessToken =
      cookieMap.get("_merchant_x_tkn") || cookieMap.get("accessToken");
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // 4. Forward the request
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      // Don't follow redirects automatically if we want to handle them
      redirect: "manual",
      // @ts-ignore
      duplex: "half",
    });

    // 5. Prepare the response to send back to the client
    const responseHeaders = new Headers(response.headers);

    // Delete headers that might cause issues when the body is modified
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-encoding");
    // The proxy is the single owner of auth cookies. Backend Set-Cookie headers
    // (domain-wide copies) would create duplicate, stale same-named cookies.
    responseHeaders.delete("set-cookie");

    // Get the response body
    const data = await response.text();
    let parsedData: any = null;
    try {
      parsedData = JSON.parse(data);
    } catch {
      // It's not JSON
    }

    const hasAccessToken = parsedData?.data?.accessToken;
    const hasRefreshToken = parsedData?.data?.refreshToken;

    const nextResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    const isProd = process.env.NODE_ENV === "production";
    const isLogout = path.startsWith("auth/logout");

    if (isLogout) {
      const cookieClearOpts = {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
      };
      nextResponse.cookies.set("accessToken", "", cookieClearOpts);
      nextResponse.cookies.set("refreshToken", "", cookieClearOpts);
      nextResponse.cookies.set("_merchant_x_tkn", "", cookieClearOpts);
      nextResponse.cookies.set("_merchant_r_tkn", "", cookieClearOpts);
    }

    if (hasAccessToken) {
      nextResponse.cookies.set("accessToken", hasAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS, // 3 days persistent session
      });
      nextResponse.cookies.set("_merchant_x_tkn", hasAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS,
      });
    }

    if (hasRefreshToken) {
      nextResponse.cookies.set("refreshToken", hasRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS, // 3 days persistent session
      });
      nextResponse.cookies.set("_merchant_r_tkn", hasRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS,
      });
    }

    // Expire legacy domain-wide cookies (e.g. Domain=.masheco.com) set by older
    // backend versions, so only the host-only cookies above remain.
    // Must run AFTER cookies.set() calls, which rewrite the set-cookie header.
    if (isLogout || hasAccessToken || hasRefreshToken) {
      const host = (req.headers.get("host") || "").split(":")[0];
      if (host && !/^\d+\.\d+\.\d+\.\d+$/.test(host) && host !== "localhost") {
        const baseDomain = host.replace(/^(merchant|www)\./, "");
        ["accessToken", "refreshToken", "_merchant_x_tkn", "_merchant_r_tkn"].forEach((n) => {
          nextResponse.headers.append(
            "set-cookie",
            `${n}=; Path=/; Domain=.${baseDomain}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly${isProd ? "; Secure" : ""}; SameSite=${isProd ? "None" : "Lax"}`,
          );
        });
      }
    }

    return nextResponse;
  } catch (error) {
    console.error("BFF Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error (Proxy)" },
      { status: 500 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
