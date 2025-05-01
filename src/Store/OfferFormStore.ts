import { create } from "zustand";

interface OfferFormState {
    listingType: "Купить" | "Продать" | null;
    category: "Бизнес" | "Франшиза" | "Стартап" | "Инвестиции" | null;
    info: Record<string, any>; 
    setListingType: (type: "Купить" | "Продать") => void;
    setCategory: (cat: OfferFormState["category"]) => void;
    setInfo: (info: Record<string, any>) => void;
    resetForm: () => void;
}

export const useOfferFormStore = create<OfferFormState>((set) => ({
    listingType: null,
    category: null,
    info: {},
    setListingType: (type) => set({ listingType: type }),
    setCategory: (cat) => set({ category: cat }),
    setInfo: (info) => set((state) => ({ info: { ...state.info, ...info } })),
    resetForm: () => set({ listingType: null, category: null, info: {} }),
}));
