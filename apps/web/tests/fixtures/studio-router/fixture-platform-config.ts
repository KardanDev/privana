import {
  defaultPlatformConfig,
  type PlatformConfig,
} from "@privana/api/contracts/platform";

export const studioRouterPlatformConfig: PlatformConfig = {
  ...defaultPlatformConfig,
  announcement: {
    href: "/pages/fixture-news",
    text: "Comunicado fictício",
  },
  footer: {
    ...defaultPlatformConfig.footer,
    links: [
      { href: "/pages/fixture-help", label: "Ajuda fictícia" },
      {
        href: "https://example.invalid/fixture",
        label: "Link externo fictício",
      },
    ],
  },
};
