import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import { Paragraph, NavLinks, categories, Applink } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";
import NoticeIcon from '../../assets/notification.svg?react';
import FavIcon from '../../assets/heart-circle.svg?react';
import ProfileIcon from '../../assets/profile-circle.svg?react';
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";


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

    return (
        <div className="font-inter font-medium w-full bg-white shadow">
            {showtoBar && (<div className="flex justify-end items-center py-5 px-48 border-b border-[#E9E9E9]">
                <div className="flex gap-12.5 ">
                    <div className="flex gap-x-12.5 gap-y-1 flex-wrap">
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            <IoIosMail className="text-[#2EAA7B] text-base" />
                            info@name-com.uz
                        </Paragraph>
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                            <FaPhone className="text-[#2EAA7B] text-base" />
                            +998 71 789 78 78
                        </Paragraph>
                    </div>
                    <div className="md:flex gap-3">
                        <Applink to="#">
                            <FaTelegram className="w-8 h-8 text-[#229ED9]" />
                        </Applink>
                        <Applink to="#" className="w-8 h-8 rounded-full bg-[#0DC143] flex items-center px-[7.23px]">
                            <FaWhatsapp className="w-[18.58px] h-[18.58px] text-white" />
                        </Applink>
                    </div>
                </div>
            </div>)}
            <div className="flex justify-between items-center bg-white py-[20px] px-[96px] border-b border-[#E9E9E9]">
                {/* Логотип */}
                <Applink to="/main" className="flex items-center gap-2">
                    <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                </Applink>

                {/* Навигация */}
                {showNavLinks && (
                    <div className="hidden md:flex gap-8.5 items-center">
                        <NavLinks
                            links={navLinksData ?? categories}
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
                        </select>
                        <MdOutlineArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                    </div>

                    {/* Авторизация */}
                    {showAuthButtons && (
                        isAuthenticated ? (
                            <div className="flex ml-6 gap-2">
                                <Applink to="/notices" ><NoticeIcon /></Applink>
                                <Applink to="/favorites" ><FavIcon /></Applink>
                                <Applink to="/profile"><ProfileIcon /></Applink>
                            </div>
                        ) : (
                            <>
                                <Applink to="/login" className="border border-[#31B683] rounded-[10px] px-5 py-3 hover:bg-[#2EAA7B] hover:text-white text-sm font-medium">
                                    Войти
                                </Applink>
                                <Applink to="/register" className="bg-[#31B683] text-white px-5 py-3 rounded-[10px] hover:bg-[#2EAA7B] text-sm font-medium">
                                    Зарегистрироваться
                                </Applink>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
