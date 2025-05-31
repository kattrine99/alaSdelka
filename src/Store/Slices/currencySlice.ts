import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyState {
    mode: "UZS" | "USD";
    rate: number;
}

const savedMode = (localStorage.getItem("currency_mode") as "UZS" | "USD") ?? "UZS";

const initialState: CurrencyState = {
    mode: savedMode,
    rate: 0,
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        setCurrencyMode(state, action: PayloadAction<"UZS" | "USD">) {
            state.mode = action.payload;
            localStorage.setItem("currency_mode", action.payload); // 👉 сохраняем
        },
        setCurrencyRate(state, action: PayloadAction<number>) {
            state.rate = action.payload;
        },
    },
});

export const { setCurrencyMode, setCurrencyRate } = currencySlice.actions;
export default currencySlice.reducer;
