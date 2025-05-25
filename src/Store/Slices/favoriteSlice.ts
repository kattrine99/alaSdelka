import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: [] as number[],
    reducers: {
        setFavorites: (state, action: PayloadAction<number[]>) => action.payload,
    },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;