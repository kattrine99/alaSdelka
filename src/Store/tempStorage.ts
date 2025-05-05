import { OfferPayload } from './api/types';

export const TEMP_OFFER_KEY = 'temp_offer_data';

export const saveTemporaryOffer = (data: OfferPayload) => {
    localStorage.setItem(TEMP_OFFER_KEY, JSON.stringify(data));
};

export const getTemporaryOffer = (): OfferPayload | null => {
    const stored = localStorage.getItem(TEMP_OFFER_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const clearTemporaryOffer = () => {
    localStorage.removeItem(TEMP_OFFER_KEY);
};