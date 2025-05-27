import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfferPayload } from "../Store/api/types";

interface TempOfferState {
    offerData?: OfferPayload;
}

const initialState: TempOfferState = {
    offerData: undefined,
};

export const tempOfferSlice = createSlice({
    name: "tempOffer",
    initialState,
    reducers: {
        setOfferData(state, action: PayloadAction<OfferPayload>) {
            state.offerData = action.payload;
        },
        clearOfferData(state) {
            state.offerData = undefined;
        },
    },
});
export const { setOfferData, clearOfferData } = tempOfferSlice.actions;
export default tempOfferSlice.reducer;
