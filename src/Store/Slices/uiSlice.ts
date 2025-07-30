import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sessionExpired: false,
        isMobileUI: false,
    },
    reducers: {
        setSessionExpired(state, action) {
            state.sessionExpired = action.payload;
        },
        setIsMobileUi(state, action) {
            state.isMobileUI = action.payload;
        }
    },
});

export const { setSessionExpired, setIsMobileUi } = uiSlice.actions;
export default uiSlice.reducer;
