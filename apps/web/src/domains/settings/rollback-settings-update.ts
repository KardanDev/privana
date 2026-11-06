import type { SettingsDTO } from "@privana/api/contracts/product";

export function rollbackSettingsUpdate(
  current: SettingsDTO | undefined,
  previous: SettingsDTO | undefined,
  submitted: Pick<SettingsDTO, "name" | "locale" | "emailNotifications">
): SettingsDTO | undefined {
  if (!(current && previous)) {
    return current;
  }
  return {
    ...current,
    emailNotifications:
      current.emailNotifications === submitted.emailNotifications
        ? previous.emailNotifications
        : current.emailNotifications,
    locale:
      current.locale === submitted.locale ? previous.locale : current.locale,
    name: current.name === submitted.name ? previous.name : current.name,
  };
}
