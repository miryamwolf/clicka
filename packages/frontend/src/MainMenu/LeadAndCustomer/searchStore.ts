import { create } from "zustand";
import { Person } from "shared-types";

interface StoreState {
  query: string;
  results: Person[];
  setQuery: (query: string) => void;
  setResults: (results: Person[]) => void;
}

export const useSearchStore = create<StoreState>((set) => ({
  query: '',
  results: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
}));
