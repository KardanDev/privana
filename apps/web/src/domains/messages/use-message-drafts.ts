"use client";

import { useCallback, useState } from "react";
import type { ChangeMessageDraft, MessageDrafts } from "./message-types";
import { updateMessageDraft } from "./update-message-draft";

export function useMessageDrafts() {
  const [drafts, setDrafts] = useState<MessageDrafts>({});
  const changeDraft = useCallback<ChangeMessageDraft>((id, update) => {
    setDrafts((previous) => updateMessageDraft(previous, id, update));
  }, []);
  return { changeDraft, drafts };
}
