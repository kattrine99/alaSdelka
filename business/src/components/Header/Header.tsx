import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaRegUser, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { Paragraph, NavLinks, categories, Button } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";

interface HeaderProps {
    showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showLogo = true }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation();
    const [showSearch, setShowSearch] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);


    return (
        <div className="font-inter font-medium w-full bg-white shadow ">

            <div className="flex justify-between items-center py-[19px] px-[192px] border-b border-[#E9E9E9]">
                <div>
                    {showLogo && (
                        <Link to="/main" className="flex items-center gap-2">
                            <img
                                src="/images/investin_logo.png"
                                alt="Logo"
                                className="h-[56px] w-auto object-contain"
                            />
                        </Link>
                    )}
                </div>
                <div className="md:flex gap-[50px]">
                    <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                        <IoIosMail className="text-[#28B13D] text-base" />
                        info@name-com.uz
                    </Paragraph>
                    <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                        <FaPhone className="text-[#28B13D] text-base" />
                        +998 71 789 78 78
                    </Paragraph>
                    <div className="md:flex gap-3 ">
                        <Link to="#">
                            <FaTelegram className="w-8 h-8 text-[#229ED9]" />
                        </Link>
                        <Link to="#" className="w-8 h-8 rounded-full bg-[#0DC143] flex items-center px-[7.23px]" >
                            <FaWhatsapp className="w-[18.58px] h-[18.58px] text-white " />
                        </Link>
                    </div>
                </div>

            </div>
            {!pathname.includes("login") && !pathname.includes("register") && (
                <>
                    <div className="flex justify-between items-center  bg-white py-[20px] px-[96px] border-b border-[#E9E9E9]">
                        <Link to="/main" className="flex items-center gap-2">
                            <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                        </Link>
                        <div className="hidden md:flex gap-8.5 items-center">
                            <NavLinks
                                links={categories}
                                className="flex flex-wrap gap-x-8.5 font-medium"
                                linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] relative hover:text-[#28B13D] transition-all duration-500 before:content-[''] before:absolute before:left-0 before:bottom-[-2px] before:w-0 hover:before:w-full before:h-[2px] before:bg-[#28B13D] before:transition-all before:duration-500"
                            />
                        </div>

                        {/* Mobile burger */}
                        <div className="md:hidden flex items-center">
                            <Button onClick={toggleMenu} className="text-2xl">
                                {menuOpen ? <FaTimes /> : <FaBars />}
                            </Button>
                        </div>
                        <div className="hidden md:flex gap-3 items-center">
                            <div className="relative">
                                <Button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="text-2xl font-normal text-gray-600 hover:text-[#28B13D]"
                                >
                                </Button>
                            </div>
                            <div className="relative w-[139px] h-[49px]">
                                <select
                                    name="Languages"
                                    className="w-full h-full px-4 pr-10 border border-[#C9CCCF] rounded-[10px] outline-none text-[#191919] font-medium appearance-none"
                                >
                                    <option id="RU">Русский</option>
                                    <option id="UZ">O'zbek</option>
                                    <option id="EN">English</option>
                                </select>
                                <MdOutlineArrowDropDown
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                                />
                            </div>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/favorites" className="text-2xl text-gray-700 hover:text-[#28B13D] pr-2">
                                        <FaRegHeart />
                                    </Link>
                                    <Link to="/profile" className="text-2xl text-gray-700 hover:text-[#28B13D] pr-5">
                                        <FaRegUser />
                                    </Link>

                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="border border-[#31B683] rounded-[10px] px-5 py-3 hover:bg-[#2EAA7B] hover:text-white text-sm font-medium"
                                    >
                                        Войти
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-[#31B683] text-white px-5 py-3 rounded-[10px] hover:bg-[#2EAA7B] text-sm font-medium"
                                    >
                                        Зарегистрироваться
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="md:hidden bg-white px-6 pb-4 shadow-md">
                            <NavLinks
                                links={categories}
                                className="flex flex-col gap-4"
                                linkClassName="text-gray-800 text-[clamp(14px,1.4vw,18px)] relative text-gray-800 hover:text-[#28B13D] transition-all duration-200 before:content-[''] before:absolute before:left-0 before:bottom-[-2px] before:w-0 hover:before:w-full before:h-[2px] before:bg-[#28B13D] before:transition-all before:duration-3=400"
                            />

                            <div className="mt-4 flex flex-col gap-2">

                                {isAuthenticated ? (
                                    <>
                                        <Link to="/favorites" className="flex items-center gap-2 text-gray-700 hover:text-[#28B13D]">
                                            <FaRegHeart /> Избранное
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-[#28B13D]">
                                            <FaRegUser /> Профиль
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-sm text-gray-700 hover:underline">
                                            Войти
                                        </Link>
                                        <Link to="/register" className="text-sm text-[#28B13D] font-medium hover:underline">
                                            Зарегистрироваться
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
