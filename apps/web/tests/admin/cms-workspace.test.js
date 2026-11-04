import { expect, test } from "bun:test";
import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CmsWorkspace } from "../../src/domains/admin/cms/cms-workspace";

test("the structured CMS form renders every panel together so saving preserves hidden sections", () => {
  const queryClient = new QueryClient();
  try {
    const document = {
      draft: defaultPlatformConfig,
      published: defaultPlatformConfig,
      publishedAt: null,
      version: 0,
    };
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(CmsWorkspace, { document })
      )
    );
    expect(markup).toContain('name="brandName"');
    expect(markup).toContain('name="discoveryTitle"');
    expect(markup).toContain('name="navigation.messages"');
    expect(markup).toContain('name="featureMessaging"');
    expect(markup).toContain('id="cms-panel-pages"');
    expect(markup).toContain("Salvar rascunho");
    expect(markup).toContain("Publicar versão");
  } finally {
    queryClient.clear();
  }
});
