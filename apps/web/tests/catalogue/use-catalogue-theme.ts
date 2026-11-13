import { useEffect, useState } from "react";

export function useCatalogueTheme() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState("#6D28D9");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.documentElement.style.setProperty("--brand-accent", accent);
  }, [accent, dark]);
  return { accent, dark, setAccent, setDark };
}
