import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import { JSX } from "react";
import { ModalBase, Button } from "./components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../public/Locales/context/TranslationContext";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const authReady = useSelector((state: RootState) => state.auth.authReady);
    const navigate = useNavigate();
    const { lang } = useTranslation();

    if (!authReady) return null;

    if (!isAuthenticated) {
        const handleLogin = () => {
            navigate(`/${lang}/login`);
        };

        return (
            <>
                <div style={{ minHeight: "50vh", pointerEvents: "none", opacity: 0.5 }}>
                    {children}
                </div>

                <ModalBase
                    title="Требуется вход"
                    message="Чтобы продолжить, пожалуйста, войдите в систему."
                    onClose={handleLogin}
                    actions={
                        <Button
                            onClick={handleLogin}
                            className="bg-[#2EAA7B] w-full text-white px-6 py-2 rounded-lg"
                        >
                            Войти
                        </Button>
                    }
                    HeadingClassName="font-inter font-bold text-3xl leading-[150%]"
                    ModalClassName="p-8"
                />
            </>
        );
    }

    return children;
};
