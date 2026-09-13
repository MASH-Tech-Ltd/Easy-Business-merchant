import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function handleProxy(req: NextRequest) {
  try {
    // 1. Get the path after /api/
    const path = req.nextUrl.pathname.replace(/^\/api\//, '');
    
    // 2. Construct the backend URL
    // Remove the /api prefix, as BACKEND_URL usually already includes /api/v1
    const url = new URL(`${BACKEND_URL}/${path}${req.nextUrl.search}`);

    // 3. Prepare headers
    const headers = new Headers(req.headers);
    headers.delete('host'); // Let fetch set the correct host header
    
    // Attach the auth tokens from cookies if present
    const accessToken = req.cookies.get('accessToken')?.value;
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // 4. Forward the request
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      // Don't follow redirects automatically if we want to handle them
      redirect: 'manual',
      // @ts-ignore
      duplex: 'half'
    });

    // 5. Prepare the response to send back to the client
    const responseHeaders = new Headers(response.headers);
    
    // Delete headers that might cause issues when the body is modified
    responseHeaders.delete('content-length');
    responseHeaders.delete('content-encoding');

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

    if (hasAccessToken) {
      delete parsedData.data.accessToken;
    }
    if (hasRefreshToken) {
      delete parsedData.data.refreshToken;
    }

    // Re-serialize data if we mutated it
    let finalBody = data;
    if (parsedData && (hasAccessToken !== undefined || hasRefreshToken !== undefined)) {
      finalBody = JSON.stringify(parsedData);
    }

    const nextResponse = new NextResponse(finalBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    if (hasAccessToken) {
      nextResponse.cookies.set('accessToken', hasAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    if (hasRefreshToken) {
      nextResponse.cookies.set('refreshToken', hasRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('BFF Proxy Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error (Proxy)' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
