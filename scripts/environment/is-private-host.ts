const RESERVED_DOMAIN =
  /(?:^|\.)(?:localhost|local|internal|test|invalid|example)$|(?:^|\.)example\.(?:com|org|net)$/i;
const PRIVATE_IPV6 = /^(?:::|f[cd]|fe[89ab])/i;
const HOST_BRACKETS = /^\[|\]$/g;
export function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(HOST_BRACKETS, "");
  if (RESERVED_DOMAIN.test(host) || !host.includes(".")) {
    return true;
  }
  // HTTP normalization expands short, numeric and hexadecimal IPv4 forms.
  if (!URL.canParse(`http://${hostname}`)) {
    return true;
  }
  const address = new URL(`http://${hostname}`).hostname;
  if (address.includes(":")) {
    return PRIVATE_IPV6.test(host);
  }
  const [first, second] = address.split(".").map(Number);
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second !== undefined && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}
