import { createRoot } from "react-dom/client";
import { Catalogue } from "./catalogue";

const root = document.getElementById("catalogue");
if (!root) {
  throw new Error("The catalogue needs a mount point.");
}
createRoot(root).render(<Catalogue />);
