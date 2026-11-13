import { createRoot } from "react-dom/client";
import { ControlsReview } from "./controls-review";

const root = document.getElementById("control-review");
if (!root) {
  throw new Error("The control fixture needs a mount point.");
}
createRoot(root).render(<ControlsReview />);
