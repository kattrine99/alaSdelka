import {FaUserAlt,FaPlusCircle, FaHeart, FaBell} from "react-icons/fa";
import { Applink } from "../AppLink/AppLink";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useLocation } from "react-router-dom";

export const BottomNavBar = () => {
    const {t} = useTranslation();
    const isMobileUI = useSelector((state: RootState) => state.ui.isMobileUI);
    const location = useLocation();

    console.log(location.pathname);
    

    return (
        <div className={"fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600" + (isMobileUI ? ' hidden' : 'block md:hidden')}>
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium text-[#4f4f4f] ">
                <Applink to="/" className={"inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" + (location.pathname === '/' ? ' text-[#2EAA62]' : '')}>
                    <svg className="w-5 h-5 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span className="text-xs group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("Главная")}</span>
                </Applink>
                <Applink to="/notices" className={"inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" + (location.pathname.includes('business') ? ' text-[#2EAA62]' : '')}>
                    <FaBell className="w-5 h-5 mb-2  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                    <span className="text-xs  group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("Уведомление")}</span>
                </Applink>
                <Applink to="/add-offer" className={"inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" + (location.pathname.includes('franchise') ? ' text-[#2EAA62]' : '')}>
                    <FaPlusCircle className="w-5 h-5 mb-2  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                    <span className="text-xs  group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("Объявление")}</span>
                </Applink>
                <Applink to="/favorites" className={"inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" + (location.pathname.includes('investments') ? ' text-[#2EAA62]' : '')}>
                    <FaHeart className="w-5 h-5 mb-2  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                    <span className="text-xs  group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("Избранное")}</span>
                </Applink>
                <Applink to="/profile" className={"inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" + (location.pathname.includes('startup') ? ' text-[#2EAA62]' : '')}>
                    <FaUserAlt className="w-5 h-5 mb-2  group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                    <span className="text-xs  group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("Профиль")}</span>
                </Applink>
            </div>
        </div>

    );
}