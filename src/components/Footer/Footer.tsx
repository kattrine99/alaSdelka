import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Paragraph, NavLinks, categories } from "../index";

interface FooterProps {
    showSmallFooter: boolean;
}
export const Footer: React.FC<FooterProps> = ({ showSmallFooter }) => {

    return (
        <div className="font-[Inter] font-medium w-full bg-white shadow ">
            {!showSmallFooter && (
                <><div className="flex justify-between items-center  bg-white py-[20px] px-[96px] border-t border-[#E9E9E9]">
                    <Link to="/main" className="flex items-center gap-2">
                        <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                    </Link>
                    <div className="hidden md:flex gap-8.5 items-center">
                        <NavLinks
                            links={categories}
                            className="flex flex-wrap gap-x-8.5 font-medium"
                            linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] relative hover:text-[#2EAA7B] transition-all duration-500 " />
                    </div>
                    <div className="md:flex gap-6 text-sm ">
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            <IoIosMail className="text-[#2EAA7B] text-base" />
                            info@name-com.uz
                        </Paragraph>
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                            <FaPhone className="text-[#2EAA7B] text-base" />
                            +998 71 789 78 78
                        </Paragraph>
                    </div>
                </div><div className="flex justify-start items-center py-[25px] px-[96px]">
                        <Paragraph className="flex items-center gap-1 mr-[117px] text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            @ INVESTin 2025
                        </Paragraph>
                        <div className="md:flex gap-[50px] text-sm ">
                            <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                                Пользовательское соглашение
                            </Paragraph>
                            <Paragraph className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                                Политика конфиденциальности
                            </Paragraph>
                        </div>
                    </div></>)}
            {showSmallFooter && (<div className="flex  h-[119px] justify-between px-[192px] border-t border-[#E9E9E9]">
                <div className="flex gap-[50px] items-center justify-center ">
                    <Link to="/main" className="flex ">
                        <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                    </Link>
                    <div className="flex gap-x-[50px]">
                        <Paragraph className="flex items-center text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            Пользовательское соглашение
                        </Paragraph>
                        <Paragraph className="flex items-center text-[#232323] font-inter font-normal text-[16px] leading-[125%]">
                            Политика конфиденциальности
                        </Paragraph>
                    </div>
                </div>
                <Paragraph className="flex items-center text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                    @ INVESTin 2025
                </Paragraph>
            </div>)}
        </div>
    );
};
