import { expect, test } from "bun:test";
import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { parseCmsFormData } from "../../src/domains/admin/cms/parse-cms-form-data";

const createFormData = () => {
  const config = defaultPlatformConfig;
  const data = new FormData();
  const fields = {
    announcementHref: config.announcement.href,
    announcementText: config.announcement.text,
    authDescription: config.auth.description,
    authTitle: config.auth.title,
    brandColor: config.brand.accentColor,
    brandLogo: config.brand.logoUrl,
    brandName: config.brand.name,
    brandTagline: config.brand.tagline,
    categories: config.discovery.categories.join("\n"),
    discoveryDescription: config.discovery.description,
    discoveryTitle: config.discovery.title,
    featuredHandles: config.discovery.featuredHandles.join("\n"),
    footerText: config.footer.text,
    supportEmail: config.footer.supportEmail,
  };
  for (const [name, value] of Object.entries(fields)) {
    data.set(name, value);
  }
  for (const [name, value] of Object.entries(config.navigation)) {
    data.set(`navigation.${name}`, value);
  }
  data.set("featureRegistration", "on");
  data.set("featureMessaging", "on");
  data.set("featureCreators", "on");
  return data;
};

test("structured CMS fields preserve a complete default document", () => {
  expect(parseCmsFormData(createFormData())).toEqual(defaultPlatformConfig);
});

test("pages, footer links and unchecked feature flags are serialized without JSON editing", () => {
  const data = createFormData();
  data.set("pageSlug", "sobre");
  data.set("pageTitle", "Sobre nós");
  data.set("pageBody", "Texto público\nSegunda linha");
  data.set("footerLabel", "Sobre");
  data.set("footerHref", "/pages/sobre");
  data.set("featuredHandles", "@alice\n@bruno");
  data.delete("featureMessaging");
  const config = parseCmsFormData(data);
  expect(config.pages).toEqual([
    { body: "Texto público\nSegunda linha", slug: "sobre", title: "Sobre nós" },
  ]);
  expect(config.footer.links).toEqual([
    { href: "/pages/sobre", label: "Sobre" },
  ]);
  expect(config.discovery.featuredHandles).toEqual(["alice", "bruno"]);
  expect(config.features.messaging).toBe(false);
});

test("CMS form validation rejects executable destinations before saving", () => {
  const data = createFormData();
  data.set("announcementHref", "javascript:alert(1)");
  expect(() => parseCmsFormData(data)).toThrow();
});

test("duplicate public page addresses cannot be saved", () => {
  const data = createFormData();
  for (const value of ["sobre", "sobre"]) {
    data.append("pageSlug", value);
    data.append("pageTitle", "Sobre");
    data.append("pageBody", "Texto");
  }
  expect(() => parseCmsFormData(data)).toThrow();
});
