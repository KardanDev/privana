import { createRoot } from "react-dom/client";
import { FeedbackReview } from "./feedback-review";

const root = document.getElementById("control-review");
if (!root) {
  throw new Error("The feedback fixture needs a mount point.");
}
createRoot(root).render(<FeedbackReview />);
