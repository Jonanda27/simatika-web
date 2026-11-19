"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useDrafts() {
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const res = await api.get("/drafts");
      if (res && res.data) {
        setDrafts(res.data);
      }
    } catch (e) {
      console.error("Failed to load drafts from API", e);
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      await api.delete(`/drafts/${draftId}`);
      // remove from local state
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (e) {
      console.error("Failed to delete draft", e);
    }
  };

  return {
    drafts,
    deleteDraft,
    reloadDrafts: loadDrafts
  };
}
