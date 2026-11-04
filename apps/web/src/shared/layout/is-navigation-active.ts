export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname === "/feed";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
