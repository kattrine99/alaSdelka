import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SiteSettings } from "../api/types";

interface SiteSettingsState {
    settings: SiteSettings | null;
}

const initialState: SiteSettingsState = {
    settings: null
};
const siteSettingsSlice = createSlice({
    name: 'siteSettings',
    initialState,
    reducers: {
        setSiteSettings: (state, action: PayloadAction<SiteSettings>) => {
            state.settings = action.payload;
        }
    }
});

export const { setSiteSettings } = siteSettingsSlice.actions;
export default siteSettingsSlice.reducer;