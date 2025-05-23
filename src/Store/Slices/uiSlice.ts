import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sessionExpired: false,
    },
    reducers: {
        setSessionExpired(state, action) {
            state.sessionExpired = action.payload;
        },
    },
});

export const { setSessionExpired } = uiSlice.actions;
export default uiSlice.reducer;
