import {
  type PlatformConfig,
  platformConfigSchema,
} from "@privana/api/contracts/platform";
import { cmsFieldText } from "./cms-field-text";

const listSeparator = /[\n,]+/;
const leadingAt = /^@/;

export function parseCmsFormData(data: FormData): PlatformConfig {
  const pageTitles = data.getAll("pageTitle");
  const pageBodies = data.getAll("pageBody");
  const linkDestinations = data.getAll("footerHref");
  return platformConfigSchema.parse({
    announcement: {
      href: cmsFieldText(data, "announcementHref"),
      text: cmsFieldText(data, "announcementText"),
    },
    auth: {
      description: cmsFieldText(data, "authDescription"),
      title: cmsFieldText(data, "authTitle"),
    },
    brand: {
      accentColor: cmsFieldText(data, "brandColor"),
      logoUrl: cmsFieldText(data, "brandLogo"),
      name: cmsFieldText(data, "brandName"),
      tagline: cmsFieldText(data, "brandTagline"),
    },
    discovery: {
      categories: cmsFieldText(data, "categories")
        .split(listSeparator)
        .map((value) => value.trim())
        .filter(Boolean),
      description: cmsFieldText(data, "discoveryDescription"),
      featuredHandles: cmsFieldText(data, "featuredHandles")
        .split(listSeparator)
        .map((value) => value.trim().replace(leadingAt, ""))
        .filter(Boolean),
      title: cmsFieldText(data, "discoveryTitle"),
    },
    features: {
      creatorApplications: data.has("featureCreators"),
      messaging: data.has("featureMessaging"),
      registration: data.has("featureRegistration"),
    },
    footer: {
      links: data.getAll("footerLabel").map((label, index) => ({
        href: String(linkDestinations[index] ?? "").trim(),
        label: String(label).trim(),
      })),
      supportEmail: cmsFieldText(data, "supportEmail"),
      text: cmsFieldText(data, "footerText"),
    },
    navigation: {
      explore: cmsFieldText(data, "navigation.explore"),
      home: cmsFieldText(data, "navigation.home"),
      memberships: cmsFieldText(data, "navigation.memberships"),
      messages: cmsFieldText(data, "navigation.messages"),
      saved: cmsFieldText(data, "navigation.saved"),
      studio: cmsFieldText(data, "navigation.studio"),
    },
    pages: data.getAll("pageSlug").map((slug, index) => ({
      body: String(pageBodies[index] ?? "").trim(),
      slug: String(slug).trim(),
      title: String(pageTitles[index] ?? "").trim(),
    })),
  });
}
