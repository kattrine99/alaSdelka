import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setLogoutReason } from "../Store/Slices/authSlice";

export const useAutoLogout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const issuedAt = parseInt(localStorage.getItem("tokenIssuedAt") || "0", 10);
        const expiresIn = parseInt(localStorage.getItem("tokenExpiresIn") || "0", 10);

        if (!token || !issuedAt || !expiresIn) return;

        const now = Date.now();
        const remaining = issuedAt + expiresIn * 1000 - now;
        const logout = () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenIssuedAt");
            localStorage.removeItem("tokenExpiresIn");

            dispatch(setLogoutReason("Ваша сессия истекла. Пожалуйста, войдите снова."));
            dispatch(setIsAuthenticated(false));
            window.location.href = "/login";
        };
        if (remaining <= 0) {
            logout();
        } else {
            const timer = setTimeout(logout, remaining);
            return () => clearTimeout(timer);
        }
    }, [dispatch]);
};
