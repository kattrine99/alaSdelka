// hooks/useAuthInit.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../Store/Slices/authSlice";

export const useAuthInit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(setIsAuthenticated(true));
        }
    }, [dispatch]);
};
