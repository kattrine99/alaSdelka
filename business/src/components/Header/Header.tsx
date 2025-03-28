import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaRegUser, FaRegHeart, FaPhone, FaSearch } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { Paragraph, NavLinks, Input } from "../index";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation();
    const [showSearch, setShowSearch] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const navItems = [
        { label: "Бизнес", to: "#" },
        { label: "Франшиза", to: "#" },
        { label: "Стартап", to: "#" },
        { label: "Инвестиции", to: "#" },
    ];

    return (
        <div className="font-[Inter] font-medium w-full bg-white shadow ">
            <div className="flex justify-end items-center py-[25px] px-[96px] border-b border-[#E9E9E9]">
                <div className="md:flex gap-6 text-sm ">
                    <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                        <IoIosMail className="text-[#28B13D] text-base" />
                        info@name-com.uz
                    </Paragraph>
                    <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                        <FaPhone className="text-[#28B13D] text-base" />
                        +998 71 789 78 78
                    </Paragraph>
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
                                links={navItems}
                                linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] relative hover:text-[#28B13D] transition-all duration-500 before:content-[''] before:absolute before:left-0 before:bottom-[-2px] before:w-0 hover:before:w-full before:h-[2px] before:bg-[#28B13D] before:transition-all before:duration-500"
                            />
                        </div>

                        {/* Mobile burger */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-2xl">
                                {menuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                        <div className="hidden md:flex gap-3 items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="text-2xl font-normal text-gray-600 hover:text-[#28B13D]"
                                >
                                    <FaSearch />
                                </button>

                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute right-[120%] top-1/2 -translate-y-1/2 z-50"
                                        >
                                            <Input
                                                type="text"
                                                placeholder="Поиск..."
                                                className="w-[clamp(160px,20vw,240px)] h-[36px] border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow transition"
                                                isError={false}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                                        className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 text-sm font-medium"
                                    >
                                        Войти
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
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
                                links={navItems}
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
