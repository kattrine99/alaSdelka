import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    extraReducers: (builder) => {
        builder
            .addCase(setOfferData, (state, action) => {
                state.offerData = action.payload;
            })
            .addCase(clearOfferData, (state) => {
                state.offerData = undefined;
            });
    }
});
export const clearOfferData = createAction("tempOffer/clear");
export const { setOfferData } = tempOfferSlice.actions;
export default tempOfferSlice.reducer;
