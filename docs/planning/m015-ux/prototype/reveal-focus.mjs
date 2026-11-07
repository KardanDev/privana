export function revealFocus(target) {
  const bounds = target.getBoundingClientRect();
  const navigation = document.getElementById("mobile-navigation");
  const bottom = Math.min(
    innerHeight,
    navigation.getClientRects().length
      ? navigation.getBoundingClientRect().top
      : innerHeight
  );
  if (bounds.top < 0 || bounds.bottom > bottom) {
    target.scrollIntoView({ behavior: "instant", block: "center" });
  }
}
