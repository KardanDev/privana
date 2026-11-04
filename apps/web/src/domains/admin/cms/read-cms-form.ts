import type { PlatformConfig } from "@privana/api/contracts/platform";
import { parseCmsFormData } from "./parse-cms-form-data";

export function readCmsForm(form: HTMLFormElement): PlatformConfig {
  return parseCmsFormData(new FormData(form));
}
