import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { Paragraph, NavLinks, categories } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";

interface HeaderProps {
    showTopBar?: boolean;
    showNavLinks?: boolean;
    showAuthButtons?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    showTopBar = true,
    showNavLinks = true,
    showAuthButtons = true,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation();

    return (
        <div className="font-inter font-medium w-full bg-white shadow">
            {showTopBar && (
                <div className="flex justify-end items-center py-[19px] px-[192px] border-b border-[#E9E9E9]">
                    <div className="md:flex gap-[50px]">
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            <IoIosMail className="text-[#2EAA7B] text-base" />
                            info@name-com.uz
                        </Paragraph>
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                            <FaPhone className="text-[#2EAA7B] text-base" />
                            +998 71 789 78 78
                        </Paragraph>
                        <div className="md:flex gap-3">
                            <Link to="#">
                                <FaTelegram className="w-8 h-8 text-[#229ED9]" />
                            </Link>
                            <Link to="#" className="w-8 h-8 rounded-full bg-[#0DC143] flex items-center px-[7.23px]">
                                <FaWhatsapp className="w-[18.58px] h-[18.58px] text-white" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {!pathname.includes("login") && !pathname.includes("register") && (
                <div className="flex justify-between items-center bg-white py-[20px] px-[96px] border-b border-[#E9E9E9]">
                    {/* Логотип */}
                    <Link to="/main" className="flex items-center gap-2">
                        <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                    </Link>

                    {/* Навигация */}
                    {showNavLinks && (
                        <div className="hidden md:flex gap-8.5 items-center">
                            <NavLinks
                                links={categories}
                                className="flex flex-wrap gap-x-8.5 font-medium"
                                linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] hover:text-[#2EAA7B] transition-all duration-500"
                            />
                        </div>
                    )}

                    <div className={`hidden md:flex items-center ${showNavLinks || showAuthButtons ? 'gap-3' : 'ml-auto'}`}>
                        {/* Языки */}
                        <div className="relative w-[139px] h-[49px]">
                            <select
                                name="Languages"
                                className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                            >
                                <option id="RU">Русский</option>
                                <option id="UZ">O'zbek</option>
                                <option id="EN">English</option>
                            </select>
                            <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                        </div>

                        {/* Авторизация */}
                        {showAuthButtons && (
                            isAuthenticated ? (
                                <>
                                    <Link to="/favorites" className="text-2xl text-gray-700 hover:text-[#2EAA7B] pr-2"><FaRegHeart /></Link>
                                    <Link to="/profile" className="text-2xl text-gray-700 hover:text-[#2EAA7B] pr-5"><FaRegUser /></Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="border border-[#31B683] rounded-[10px] px-5 py-3 hover:bg-[#2EAA7B] hover:text-white text-sm font-medium">
                                        Войти
                                    </Link>
                                    <Link to="/register" className="bg-[#31B683] text-white px-5 py-3 rounded-[10px] hover:bg-[#2EAA7B] text-sm font-medium">
                                        Зарегистрироваться
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
