import { createCmsCases } from "./create-cases.mjs";

export const cmsScenarios = ["admin", "editor"].flatMap(createCmsCases);
