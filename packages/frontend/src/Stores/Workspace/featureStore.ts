import { create } from 'zustand';
import { axiosInstance } from '../../Service/Axios';

interface Feature {
    id: string;
    description?: string;
    IsIncluded: boolean;
    additionalCost: number;
  }

type FeatureState = {
  features: Feature[];
  loading: boolean;
  error: string | null;
  getAllFeatures: () => Promise<void>;
};

export const useFeatureStore = create<FeatureState>((set) => ({
  features: [],
  loading: false,
  error: null,
  getAllFeatures: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<Feature[]>('/features/getAllFeaturs');
      set({ features: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching features:', error);
      set({ error: 'שגיאה בשליפת כל התכונות', loading: false });
    }
  },
}));
