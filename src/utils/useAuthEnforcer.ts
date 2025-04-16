import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

export const useAuthEnforcer = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated) return;

        const handleAction = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (!showModal) setShowModal(true);
        };

        const events = ["click", "keydown", "scroll", "mousedown"];

        events.forEach(event =>
            document.addEventListener(event, handleAction, { capture: true })
        );

        return () => {
            events.forEach(event =>
                document.removeEventListener(event, handleAction, { capture: true })
            );
        };
    }, [isAuthenticated, showModal]);

    return {
        showModal,
        closeModal: () => setShowModal(false),
    };
};
