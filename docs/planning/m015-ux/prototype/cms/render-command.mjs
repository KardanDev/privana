import { element } from "../element.mjs";
import { executeCmsCommand } from "./execute-command.mjs";

export function renderCmsCommand(action) {
  const button = element("button", action.label, {
    class: action.primary ? "button primary" : "button",
    type: "button",
  });
  button.dataset.role = action.cms.role;
  button.dataset.command = action.cms.command;
  button.dataset.target = action.target;
  button.addEventListener("click", executeCmsCommand);
  return button;
}
