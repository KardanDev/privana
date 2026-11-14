export function isNavigationActive(
  pathname: string | null,
  href: string
): boolean {
  if (!pathname) {
    return false;
  }
  if (href === "/") {
    return pathname === "/" || pathname === "/feed";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
