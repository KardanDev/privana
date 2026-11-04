import { CmsScreen } from "./cms/cms-screen";
import { OperationsAnalytics } from "./operations-analytics";
import { OperationsList } from "./operations-list";
import {
  type OperationsSection,
  operationsNavigation,
} from "./operations-navigation";

export function OperationsContent({
  section,
  viewerId,
  viewerRole,
}: {
  section: OperationsSection;
  viewerId: string;
  viewerRole: string;
}) {
  const permitted = operationsNavigation
    .find((item) => item.id === section)
    ?.roles.some((role) => role === viewerRole);
  if (!permitted) {
    return (
      <p className="text-muted-foreground text-sm" role="alert">
        Seu papel atual não permite abrir esta seção.
      </p>
    );
  }
  if (section === "overview") {
    return <OperationsAnalytics />;
  }
  if (section === "cms") {
    return <CmsScreen />;
  }
  return (
    <OperationsList
      key={section}
      section={section}
      viewerId={viewerId}
      viewerRole={viewerRole}
    />
  );
}
