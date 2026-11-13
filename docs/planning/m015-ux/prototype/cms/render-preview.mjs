import { element } from "../element.mjs";
import { cmsNavigationLabels } from "./fields.mjs";
import { readCmsDraft } from "./read-draft.mjs";

export function renderCmsPreview(role) {
  const draft = readCmsDraft(role);
  const section = element("section", "", {
    "aria-label": "Prévia local do rascunho",
    class: "card cms-preview",
  });
  section.append(
    element("h2", "Prévia local do rascunho"),
    element(
      "p",
      "Esta visualização não altera a plataforma pública nem carrega endereços informados."
    ),
    element("h3", draft.brandName),
    element("p", draft.tagline)
  );
  const swatch = element("span", "Texto sobre a cor principal", {
    class: "cms-swatch",
  });
  swatch.style.backgroundColor = draft.accent;
  section.append(
    swatch,
    element("h3", draft.discoveryTitle),
    element("p", draft.discoveryDescription),
    element("p", `Categorias: ${draft.categories.replaceAll("\n", ", ")}`),
    element("p", `Destaques: ${draft.handles.replaceAll("\n", ", ")}`),
    element("p", draft.announcement),
    element(
      "p",
      `Destino do aviso: ${draft.announcementHref || "Não configurado"}`
    ),
    element("h3", draft.authTitle),
    element("p", draft.authDescription),
    element(
      "p",
      `Navegação: ${cmsNavigationLabels
        .map(([key]) => draft[`nav-${key}`])
        .join(" · ")}`
    ),
    element("h3", draft.pageTitle || "Nenhuma página configurada"),
    element("p", draft.pageBody),
    element("p", `/pages/${draft.slug}`),
    element(
      "p",
      `Cadastro: ${draft.registration ? "aberto" : "fechado"} · Candidaturas: ${draft.applications ? "abertas" : "fechadas"} · Envio: ${draft.messaging ? "habilitado" : "desabilitado"}`
    ),
    element("p", draft.footer),
    element("p", draft.support),
    element("p", `${draft.linkLabel} · ${draft.linkHref}`)
  );
  return section;
}
