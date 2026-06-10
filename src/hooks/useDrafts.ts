"use client";

import { useState, useEffect } from "react";

const DRAFT_KEY = "simatika_kbg_drafts";

export function useDrafts() {
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load drafts from localStorage", e);
    }
  };

  const saveDraft = (draft: any) => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      let draftsArray = [];
      if (saved) {
        draftsArray = JSON.parse(saved);
      }
      
      const existingIdx = draftsArray.findIndex((d: any) => d.id === draft.id);
      if (existingIdx !== -1) {
        draftsArray[existingIdx] = draft;
      } else {
        draftsArray.push(draft);
      }
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftsArray));
      setDrafts(draftsArray);
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  };

  const deleteDraft = (draftId: string) => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draftsArray = JSON.parse(saved);
        const updated = draftsArray.filter((d: any) => d.id !== draftId);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
        setDrafts(updated);
      }
    } catch (e) {
      console.error("Failed to delete draft", e);
    }
  };

  const clearDrafts = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setDrafts([]);
    } catch (e) {
      console.error("Failed to clear drafts", e);
    }
  };

  // For import: merging an array of drafts into localStorage
  const saveManyDrafts = (newDrafts: any[]) => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      let draftsArray = [];
      if (saved) {
        draftsArray = JSON.parse(saved);
      }
      
      const merged = [...draftsArray, ...newDrafts];
      localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
      setDrafts(merged);
    } catch (e) {
      console.error("Failed to save multiple drafts", e);
    }
  };

  return {
    drafts,
    saveDraft,
    deleteDraft,
    clearDrafts,
    saveManyDrafts,
    reloadDrafts: loadDrafts
  };
}
