import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = "ru" | "uz";

interface LanguageState {
    current: Language;
}

const initialState: LanguageState = {
    current: "ru",
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage(state, action: PayloadAction<"ru" | "uz">) {
            state.current = action.payload;
        },
    },
});


export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
