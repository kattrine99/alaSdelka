import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../Store/Slices/authSlice";

export const useInactivityLogout = (timeoutMs = 3600_000) => {
    const dispatch = useDispatch();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];
        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("access_token_expiry");
                dispatch(setIsAuthenticated(false));
                window.location.href = "/login";
            }, timeoutMs);
        };
        events.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [dispatch, timeoutMs]);
};
