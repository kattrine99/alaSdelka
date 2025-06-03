import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "./Store/store";
import { JSX } from "react";
import { setLogoutReason } from "./Store/Slices/authSlice";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const authReady = useSelector((state: RootState) => state.auth.authReady);
    const location = useLocation();

    if (!authReady) return null;

    const protectedPaths = [
        "/profile", "/favorites", "/announcements", "/add-offer",
        "/promotion", "/notices", "/statistics", "/users"
    ];
    const isProtected = protectedPaths.some((path) => location.pathname.startsWith(path));

    if (!isAuthenticated && isProtected) {
        dispatch(setLogoutReason("unauthorized"));
        return <Navigate to="/login" replace />;
    }

    return children;
};
