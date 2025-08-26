// path: src/Stores/CoreAndIntegration/emailStore.ts

import { create } from 'zustand';

interface EmailState {
  attachments: File[];
  loading: boolean;
  message: string | null;

  addAttachments: (files: FileList) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  setLoading: (loading: boolean) => void;
  setMessage: (msg: string | null) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  attachments: [],
  loading: false,
  message: null,

  addAttachments: (files: FileList) =>
    set((state) => ({
      attachments: [...state.attachments, ...Array.from(files)],
    })),

  removeAttachment: (index) =>
    set((state) => ({
      attachments: state.attachments.filter((_, i) => i !== index),
    })),

  clearAttachments: () => set({ attachments: [] }),
  setLoading: (loading) => set({ loading }),
  setMessage: (msg) => set({ message: msg }),
}));
