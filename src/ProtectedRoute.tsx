import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "./Store/store";
import { JSX } from "react";
import { setLogoutReason } from "./Store/Slices/authSlice";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    if (!isAuthenticated) {
        dispatch(setLogoutReason("unauthorized"));
        return <Navigate to="/" replace />;
    }

    return children;
};
