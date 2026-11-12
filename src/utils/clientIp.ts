const IPV4_RE =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6_RE = /^[0-9a-f:]+$/i;

function normalizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let ip = raw.trim();
  if (!ip || ip.length > 64 || ip.includes(",") || ip.includes(" ") || ip.includes("%")) {
    return null;
  }
  if (ip.startsWith("[") && ip.endsWith("]")) {
    ip = ip.slice(1, -1);
  }
  if (ip.toLowerCase().startsWith("::ffff:")) {
    ip = ip.slice(7);
  }
  if (IPV4_RE.test(ip)) return ip;
  if (ip.includes(":") && IPV6_RE.test(ip)) return ip.toLowerCase();
  return null;
}

function isInternalIp(ip: string): boolean {
  if (ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return true;
  }
  const lower = ip.toLowerCase();
  if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:")) {
    return true;
  }
  if (IPV4_RE.test(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 0 || (a === 169 && b === 254)) return true;
  }
  return false;
}

/**
 * Extracts a valid, non-internal visitor IP from incoming Next.js request headers.
 * Returns null if no valid public IP is present.
 */
export function extractClientIp(
  incomingHeaders: Pick<Headers, "get">,
): string | null {
  const candidates = [
    incomingHeaders.get("cf-connecting-ip"),
    incomingHeaders.get("x-real-ip"),
    incomingHeaders.get("x-forwarded-for")?.split(",")[0],
  ];

  for (const raw of candidates) {
    const ip = normalizeIp(raw);
    if (ip && !isInternalIp(ip)) {
      return ip;
    }
  }
  return null;
}

/**
 * Strips any spoofable forwarding headers and sets `x-tenant-client-ip`
 * only when a valid public visitor IP is present.
 */
export function sanitizeAndSetForwardIp(
  outboundHeaders: Headers,
  incomingHeaders: Pick<Headers, "get">,
): void {
  outboundHeaders.delete("x-tenant-client-ip");
  outboundHeaders.delete("x-mash-edge");
  outboundHeaders.delete("x-client-ip");

  const clientIp = extractClientIp(incomingHeaders);
  if (clientIp) {
    outboundHeaders.set("x-tenant-client-ip", clientIp);
  }
}

