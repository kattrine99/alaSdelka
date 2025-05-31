import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfferPayload } from "../Store/api/types";

interface TempOfferState {
    offerData?: OfferPayload;
    offerId?: number | null;
}

const initialState: TempOfferState = {
    offerData: undefined,
    offerId: null,
};

export const tempOfferSlice = createSlice({
    name: "tempOffer",
    initialState,
    reducers: {
        setOfferData(state, action: PayloadAction<OfferPayload>) {
            state.offerData = action.payload;
        },
        setOfferId(state, action: PayloadAction<number | null>) {
            state.offerId = action.payload;
        },
        clearOfferData(state) {
            state.offerData = undefined;
            state.offerId = null;
        },
    },
});

export const { setOfferData, setOfferId, clearOfferData } = tempOfferSlice.actions;
export default tempOfferSlice.reducer;
