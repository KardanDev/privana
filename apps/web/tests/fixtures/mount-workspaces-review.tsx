import { createRoot } from "react-dom/client";
import { WorkspacesReview } from "./workspaces-review";

const root = document.getElementById("control-review");
if (!root) {
  throw new Error("The workspace fixture needs a mount point.");
}
createRoot(root).render(
  <WorkspacesReview role={root.dataset.role ?? "admin"} />
);
