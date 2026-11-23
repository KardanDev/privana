import type { Dialog, Frame, Page } from "@playwright/test";

export async function exerciseBrowserUnload(
  page: Page,
  action: "reload" | "back",
  accept = false
): Promise<string[]> {
  const dialogs: string[] = [];
  const { promise, resolve, reject } = Promise.withResolvers<string[]>();
  const respond = async (dialog: Dialog) => {
    dialogs.push(dialog.type());
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
      resolve(dialogs);
    }
  };
  const onDialog = (dialog: Dialog) => {
    respond(dialog).catch(reject);
  };
  const onNavigation = (frame: Frame) => {
    if (frame === page.mainFrame()) {
      resolve(dialogs);
    }
  };
  page.on("dialog", onDialog);
  page.on("framenavigated", onNavigation);
  try {
    // A dismissed prompt has no navigation commit for page.reload() to await.
    await page.evaluate((requested) => {
      window.setTimeout(() => {
        if (requested === "back") {
          window.history.back();
        } else {
          window.location.reload();
        }
      }, 0);
    }, action);
    return await promise;
  } finally {
    page.off("dialog", onDialog);
    page.off("framenavigated", onNavigation);
  }
}
