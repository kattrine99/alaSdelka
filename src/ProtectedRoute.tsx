import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "./Store/store";
import { JSX } from "react";
import { setLogoutReason } from "./Store/Slices/authSlice";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const authReady = useSelector((state: RootState) => state.auth.authReady); // <--- Вот это добавлено

    if (!authReady) {
        return null;
    }

    if (!isAuthenticated) {
        dispatch(setLogoutReason("unauthorized"));
        return <Navigate to="/login" replace />;
    }

    return children;
};
