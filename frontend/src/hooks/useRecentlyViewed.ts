import { useState } from 'react';

const STORAGE_KEY = 'bsj-recently-viewed';
const MAX_ITEMS = 5;

interface RecentIssue {
  id: string;
  title: string;
  cover: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentIssue[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const addViewed = (id: string, title: string, cover: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      const updated = [{ id, title, cover, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recent, addViewed };
}
