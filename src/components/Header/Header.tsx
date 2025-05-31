import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrencyMode } from "../../Store/Slices/currencySlice";

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
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);

    return (
        <div className="font-inter font-medium w-full bg-white shadow">
            {showtoBar && (
                <div className="hidden lg:block bg-white py-[20px] border-b border-[#E9E9E9]">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        {/* Email & Phone */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-openSans text-sm md:text-base">
                                <IoIosMail className="text-[#2EAA7B]" />
                                info@name-com.uz
                            </Paragraph>
                            <Paragraph className="flex items-center gap-2 text-[#232323] font-inter text-sm md:text-base">
                                <FaPhone className="text-[#2EAA7B]" />
                                +998 71 789 78 78
                            </Paragraph>
                        </div>

                        {/* Icons */}
                        <div className="flex gap-3">
                            <Applink to="#">
                                <FaTelegram className="w-6 h-6 md:w-8 md:h-8 text-[#229ED9]" />
                            </Applink>
                            <Applink to="#" className="w-8 h-8 rounded-full bg-[#0DC143] flex items-center justify-center">
                                <FaWhatsapp className="w-[18px] h-[18px] text-white" />
                            </Applink>
                        </div>
                    </div>
                </div>
            )}

            {/* Десктопный header */}
            <div className="hidden lg:block bg-white py-[20px] border-b border-[#E9E9E9]">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Applink to="/main" className="flex items-center gap-2 shrink-0">
                        <img
                            src="/images/investin_logo.png"
                            alt="Logo"
                            className="h-[56px] w-auto object-contain"
                        />
                    </Applink>

                    {showNavLinks && (
                        <nav className="flex gap-8.5 items-center flex-wrap">
                            <NavLinks
                                links={navLinksData ?? categories}
                                className="flex flex-wrap gap-x-8.5 font-medium"
                                linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] hover:text-[#2EAA7B] transition-all duration-500"
                            />
                        </nav>
                    )}

                    <div className="flex items-center gap-4 ml-4 shrink-0">
                        <div className="relative w-[139px] h-[49px]">
                            <select
                                name="Languages"
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option id="RU">Русский</option>
                                <option id="UZ">O'zbek</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>
                        <div className="relative w-[139px] h-[49px]">
                            <select
                                value={selectedCurrency}
                                onChange={(e) => dispatch(setCurrencyMode(e.target.value as "UZS" | "USD"))}
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option value="UZS">сум</option>
                                <option value="USD">$ USD</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>

                        {showAuthButtons && (
                            isAuthenticated ? (
                                <div className="flex gap-2 items-center">
                                    <Button onClick={() => navigate("/notices")} className={undefined}><NoticeIcon /></Button>
                                    <Button onClick={() => navigate("/favorites")} className={undefined}><FavIcon /></Button>
                                    <Applink to="/profile"><ProfileIcon /></Applink>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Applink
                                        to="/login"
                                        className="border border-[#31B683] rounded-[10px] px-5 py-3 hover:bg-[#2EAA7B] hover:text-white text-sm font-medium transition duration-600"
                                    >
                                        Войти
                                    </Applink>
                                    <Applink
                                        to="/register"
                                        className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] hover:bg-[#31B683] text-sm font-medium transition duration-600"
                                    >
                                        Зарегистрироваться
                                    </Applink>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>



            {/* Мобильный header */}
            <div className="flex lg:hidden justify-between items-center px-4 py-4 border-b border-[#E9E9E9]">
                <Applink to="/main" className="flex items-center">
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
                <div className="md:hidden fixed top-[72px] left-0 w-full bg-white z-50 px-6 py-4 shadow-md flex flex-col gap-6">
                    <NavLinks
                        links={navLinksData ?? categories}
                        className="flex flex-col gap-4"
                        linkClassName="text-[#232323] font-inter text-lg hover:text-[#2EAA7B]"
                    />
                    {/* Язык и Валюта */}
                    <div className="flex flex-col gap-3">
                        {/* Языки */}
                        <div className="relative w-full h-[49px]">
                            <select
                                name="Languages"
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option id="RU">Русский</option>
                                <option id="UZ">O'zbek</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>

                        {/* Валюта */}
                        <div className="relative w-full h-[49px]">
                            <select
                                value={selectedCurrency}
                                onChange={(e) => dispatch(setCurrencyMode(e.target.value as "UZS" | "USD"))}
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option value="UZS">сум</option>
                                <option value="USD">$ USD</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>
                    </div>
                    {isAuthenticated ? (
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => navigate("/notices")} className={undefined}><NoticeIcon /></Button>
                            <Button onClick={() => navigate("/favorites")} className={undefined}><FavIcon /></Button>
                            <Applink to="/profile"><ProfileIcon /></Applink>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Applink
                                to="/login"
                                className="border border-[#31B683] rounded-[10px] px-5 py-3 text-center hover:bg-[#2EAA7B] hover:text-white text-sm font-medium transition duration-600"
                            >
                                Войти
                            </Applink>
                            <Applink
                                to="/register"
                                className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] text-center hover:bg-[#31B683] text-sm font-medium transition duration-600"
                            >
                                Зарегистрироваться
                            </Applink>
                        </div>
                    )}
                    {/* Email & Phone */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <Paragraph className="flex items-center gap-2 text-[#232323] font-openSans text-sm md:text-base">
                            <IoIosMail className="text-[#2EAA7B]" />
                            info@name-com.uz
                        </Paragraph>
                        <Paragraph className="flex items-center gap-2 text-[#232323] font-inter text-sm md:text-base">
                            <FaPhone className="text-[#2EAA7B]" />
                            +998 71 789 78 78
                        </Paragraph>
                    </div>

                    {/* Icons */}
                    <div className="flex justify-center gap-3">
                        <Applink to="#">
                            <FaTelegram className="w-6 h-6 md:w-8 md:h-8 text-[#229ED9]" />
                        </Applink>
                        <Applink to="#" className="w-6 h-6 rounded-full bg-[#0DC143] flex items-center justify-center">
                            <FaWhatsapp className="w-[18px] h-[18px] text-white" />
                        </Applink>
                    </div>
                </div>
            )}
        </div>
    );
};