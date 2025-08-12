import { useEffect, useState, useRef } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { Paragraph, NavLinks, categories, Applink, Button } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";
import NoticeIcon from '../../assets/notification.svg?react';
import FavIcon from '../../assets/heart-circle.svg?react';
import ProfileIcon from '../../assets/profile-circle.svg?react';
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrencyMode } from "../../Store/Slices/currencySlice";
import { useGetNotificationsQuery, useMarkAllReadMutation } from "../../Store/api/Api";
import { setRefetchNotifications } from "../../utils/notificationRefetch";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { setIsMobileUi } from "../../Store/Slices/uiSlice";

interface HeaderProps {
    showNavLinks?: boolean;
    showtoBar?: boolean;
    showAuthButtons?: boolean;
    navLinksData?: { label: string; to: string }[];
}

export const Header: React.FC<HeaderProps> = ({
    showNavLinks = true,
    showAuthButtons = true,
    showtoBar = true,
    navLinksData,
}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isMobileUI = useSelector((state: RootState) => state.ui.isMobileUI);
    const [searchParams] = useSearchParams();
    const siteSettings = useSelector((state: RootState) => state.siteSettings.settings);
    const navigate = useNavigate();
    const { lng } = useParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);
    const { lang, setLang, t } = useTranslation();
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null)
    const { data, refetch } = useGetNotificationsQuery({ page: 1, per_page: 1000 },
        { pollingInterval: 10000 }
    );

    const [markAllAsRead] = useMarkAllReadMutation();
    const [localUnreadCount, setLocalUnreadCount] = useState(0);
    useEffect(() => {
        if (data?.meta?.unread_count !== undefined) {
            setLocalUnreadCount(data.meta.unread_count);
        }
    }, [data]);
    useEffect(() => {
        setRefetchNotifications(refetch);
        searchParams.forEach((value, key) => {
            if (key == 'mobile' && value == 'true') {
                dispatch(setIsMobileUi(true))
            }
        })
    }, []);

    function onLangChange(newLang: "ru" | "uz") {
        setLang(newLang);
        const currentPath = location.pathname.split("/").slice(2).join("/");
        navigate(`/${newLang}/${currentPath}`);
    }

    useEffect(() => {
        const onNoticesPage = location.pathname === "/notices";
        const alreadyVisited = localStorage.getItem("hasVisitedNotices") === "true";

        if (onNoticesPage && (data?.meta?.unread_count ?? 0) > 0 && !alreadyVisited) {
            markAllAsRead()
                .unwrap()
                .then(() => {
                    localStorage.setItem("hasVisitedNotices", "true");
                    setLocalUnreadCount(0);
                    refetch();
                })
                .catch((e) => console.error("Ошибка при отметке уведомлений:", e));
        }
    }, [location.pathname, data?.meta?.unread_count]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        let scrollY = 0;

        if (isMobileMenuOpen) {
            scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
            document.body.style.width = '100%';
        } else {
            const scrollTop = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            if (scrollTop) {
                window.scrollTo(0, -parseInt(scrollTop));
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
        };
    }, [isMobileMenuOpen]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);
    return (
        <div className={"font-inter font-medium w-full bg-white shadow"}>
            {showtoBar && (
                <div className="hidden lg:block bg-white py-[20px] border-b border-[#E9E9E9]">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        {/* Email & Phone */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-openSans text-sm md:text-base">
                                <IoIosMail className="text-[#2EAA7B]" />
                                {siteSettings?.contacts.email}
                            </Paragraph>
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-inter text-sm md:text-base">
                                <FaPhone className="text-[#2EAA7B]" />
                                {siteSettings?.contacts.phone}
                            </Paragraph>
                        </div>

                        {/* Icons */}
                        <div className="flex gap-3">
                            {siteSettings?.contacts.social.telegram && (
                                <Applink to={siteSettings?.contacts.social.telegram}>
                                    <FaTelegram className="w-6 h-6 md:w-8 md:h-8 text-[#229ED9]" />
                                </Applink>
                            )}
                            {siteSettings?.contacts.social.whatsapp && (
                                <Applink to={siteSettings?.contacts.social.whatsapp} className="w-8 h-8 rounded-full bg-[#0DC143] flex items-center justify-center">
                                    <FaWhatsapp className="w-[18px] h-[18px] text-white" />
                                </Applink>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Десктопный header */}
            <div className="hidden lg:block bg-white py-[20px] border-b border-[#E9E9E9]">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Applink to="/" className="flex items-center gap-2 shrink-0">
                        <img
                            src="/images/investin_logo.png"
                            alt="Logo"
                            className="h-[56px] w-auto object-contain"
                        />
                    </Applink>

                    {showNavLinks && (
                        <nav className="flex gap-8.5 max-2xl:gap-4 items-center flex-wrap">
                            <NavLinks
                                links={(navLinksData ?? categories).map(link => ({
                                    ...link,
                                    label: t(link.label),
                                }))}
                                className="flex  gap-x-8.5 max-2xl:gap-4 font-medium"
                                linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] hover:text-[#2EAA7B] transition-all duration-500"
                            />
                        </nav>
                    )}

                    <div className="flex items-center gap-4 ml-4 shrink-0">
                        <div className="relative w-[139px] h-[49px]">
                            <select
                                value={lang}
                                onChange={e => onLangChange(e.target.value as "ru" | "uz")}
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option value="ru">Русский</option>
                                <option value="uz">O&#39;zbek</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>
                        <div className="relative w-[139px] h-[49px]">
                            <select
                                value={selectedCurrency}
                                onChange={(e) => dispatch(setCurrencyMode(e.target.value as "UZS" | "USD"))}
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option value="UZS">{t("Cум")}</option>
                                <option value="USD">USD</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>

                        {showAuthButtons && (
                            isAuthenticated ? (
                                <div className="flex gap-2 items-center">
                                    <Button onClick={() => navigate(`/${lng}/notices`)} className='relative'>
                                        <NoticeIcon className="cursor-pointer items" />
                                        {localUnreadCount > 0 && (
                                            <span className="absolute -top-1 right-[1px] bg-[#DE5151] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                                {localUnreadCount > 9 ? "9+" : localUnreadCount}
                                            </span>
                                        )}

                                    </Button>

                                    <Button onClick={() => navigate(`/${lng}/favorites`)} className={undefined}><FavIcon /></Button>
                                    <Applink to="/profile"><ProfileIcon /></Applink>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Applink
                                        to="/login"
                                        className="border border-[#31B683] rounded-[10px] px-5 py-3 hover:bg-[#2EAA7B] hover:text-white text-sm font-medium transition duration-600"
                                    >
                                        {t("Войти")}
                                    </Applink>
                                    <Applink
                                        to="/register"
                                        className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] hover:bg-[#31B683] text-sm font-medium transition duration-600"
                                    >
                                        {t("Зарегистрироваться")}
                                    </Applink>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Мобильный header */}
            <div ref={menuRef} className="lg:hidden sticky top-0 z-50">
                <div className={"flex justify-between items-center px-4 py-4 border-b border-[#E9E9E9] bg-white"  + (isMobileUI ? ' hidden' : '')}>
                    <Applink to="/" className="flex items-center">
                        <img src="/images/investin_logo.png" alt="Logo" className="h-10 object-contain" />
                    </Applink>
                    <div className="flex items-center gap-3">
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-[#D7F4EC] rounded-xl"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        >
                            <RxHamburgerMenu className="text-[#2EAA7B] w-6 h-6 outline-none" />
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div
                        className={"fixed left-0 w-full bg-white z-40 px-6 py-4 shadow-md flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-64px)]" + (isMobileUI ? '' : ' top-[64px]')}
                    >
                        <NavLinks
                            links={(navLinksData ?? categories).map(link => ({
                                ...link,
                                label: t(link.label),
                            }))}
                            onClick={() => setIsMobileMenuOpen(false)}  // Закрываем меню при клике
                            className={"flex-col gap-4" + (isMobileUI ? ' hidden': ' flex')}
                            linkClassName={"text-[#232323] font-inter text-lg hover:text-[#2EAA7B]"}
                        />
                        {/* Язык и Валюта */}
                        <div className="flex flex-col gap-3">
                            <div className="relative w-full h-[49px]">
                                <select
                                    value={lang}
                                    onChange={(e) => {
                                        onLangChange(e.target.value as "ru" | "uz");
                                        setIsMobileMenuOpen(false);
                                    }} className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                                >
                                    <option value="ru">Русский</option>
                                    <option value="uz">O&#39;zbek</option>
                                </select>
                                <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                            </div>

                            <div className="relative w-full h-[49px]">
                                <select
                                    value={selectedCurrency}
                                    onChange={(e) => {
                                        dispatch(setCurrencyMode(e.target.value as "UZS" | "USD"));
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                                >
                                    <option value="UZS">{t("Сум")}</option>
                                    <option value="USD">$ USD</option>
                                </select>
                                <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                            </div>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => { navigate(`/${lng}/notices`); setIsMobileMenuOpen(false); }} className={undefined}>
                                    <NoticeIcon className="cursor-pointer" />
                                </Button>
                                <Button onClick={() => { navigate(`/${lng}/favorites`); setIsMobileMenuOpen(false); }} className={undefined}>
                                    <FavIcon className="cursor-pointer" />
                                </Button>
                                <Button onClick={() => { navigate(`/${lng}/profile`); setIsMobileMenuOpen(false); }} className={undefined}>
                                    <ProfileIcon className="cursor-pointer" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button onClick={() => { navigate(`/${lng}/login`); setIsMobileMenuOpen(false); }}
                                    className="border border-[#31B683] rounded-[10px] px-5 py-3 text-center hover:bg-[#2EAA7B] hover:text-white text-sm font-medium transition duration-600"
                                >
                                    {t("Войти")}
                                </Button>
                                <Button onClick={() => { navigate(`/${lng}/register`); setIsMobileMenuOpen(false); }}
                                    className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] text-center hover:bg-[#31B683] text-sm font-medium transition duration-600"
                                >
                                    {t("Зарегистрироваться")}
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-openSans text-sm md:text-base">
                                <IoIosMail className="text-[#2EAA7B]" />
                                <a href="mailto:info@name-com.uz">info@name-com.uz</a>
                                
                            </Paragraph>
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-inter text-sm md:text-base">
                                <FaPhone className="text-[#2EAA7B]" />
                                <a href="tel:+99871789878">+998 71 789 78 78</a>
                            </Paragraph>
                        </div>

                        <div className="flex justify-center gap-3">
                            <Applink
                                to="#"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <FaTelegram className="w-6 h-6 md:w-8 md:h-8 text-[#229ED9]" />
                            </Applink>
                            <Applink to="#" onClick={() => setIsMobileMenuOpen(false)} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#0DC143] flex items-center justify-center">
                                <FaWhatsapp className="w-[18px] h-[18px] text-white" />
                            </Applink>
                        </div>
                    </div>
                )}
            </div>

        </div >
    );
};
