import { useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import { Paragraph, NavLinks, categories, Button, Applink } from "../index";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

interface FooterProps {
    showSmallFooter: boolean;
}
export const Footer: React.FC<FooterProps> = ({ showSmallFooter }) => {
    const navigate = useNavigate();
    const { t, lang } = useTranslation();

    return (
        <div className="font-[Inter] font-medium w-full bg-white shadow ">
            {!showSmallFooter && (
                <><div className="flex justify-between items-center  bg-white py-[20px] px-[96px] border-t border-[#E9E9E9]">
                    <Applink to={`/`} className="flex items-center gap-2">
                        <img src="/images/investin_logo.png" alt="Logo" className="h-[56px] w-auto object-contain" />
                    </Applink>
                    <div className="hidden md:flex gap-8.5 items-center">
                        <NavLinks
                            links={categories}
                            className="flex flex-wrap gap-x-8.5 font-medium"
                            linkClassName="font-inter leading-[100%] text-[#232323] text-[clamp(14px,1.4vw,18px)] relative hover:text-[#2EAA7B] transition-all duration-500 " />
                    </div>
                    <div className="md:flex gap-6 text-sm ">
                        <Paragraph className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            <IoIosMail className="text-[#2EAA7B] text-base" />
                            info@invin.uz
                        </Paragraph>
                    </div>
                </div><div className="flex justify-start items-center py-[25px] px-[96px]">
                        <Paragraph className="flex items-center gap-1 mr-[117px] text-[#232323] font-openSans font-normal text-[16px] leading-[125%]">
                            @ INVESTin 2025
                        </Paragraph>
                        <div className="md:flex gap-[50px] text-sm ">
                            <Button
                                onClick={() => navigate(`/${lang}/user-agreement`)}
                                className="flex items-center gap-1 text-[#232323] font-openSans font-normal text-[16px] leading-[125%] hover:text-[#28B13D] transition"
                            >
                                {t("Пользовательское соглашение")}
                            </Button>
                            <Button
                                onClick={() => navigate(`/${lang}/privacy-policy`)}
                                className="flex items-center gap-1 text-[#232323] font-inter font-normal text-[16px] leading-[125%] hover:text-[#28B13D] transition"
                            >
                                {t("Политика конфиденциальности")}
                            </Button>
                        </div>
                    </div></>)}
            {showSmallFooter && (
                <div className="w-full border-t container mx-auto border-[#E9E9E9] px-4 xl:px-20 lg:px-10 md:px-4 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 text-center">

                        {/* ЛОГОТИП */}
                        <div className="flex justify-center lg:justify-start">
                            <Applink to={`/`}>
                                <img
                                    src="/images/investin_logo.png"
                                    alt="Logo"
                                    className="h-[48px] w-auto object-contain sm:h-[56px]"
                                />
                            </Applink>
                        </div>

                        {/* КНОПКИ */}
                        <div className="flex justify-center gap-6 flex-wrap text-[14px] sm:text-[16px] text-[#232323]">
                            <Button
                                onClick={() => navigate(`/${lang}/user-agreement`)}
                                className="hover:text-[#28B13D] transition"
                            >
                                {t("Пользовательское соглашение")}
                            </Button>
                            <Button
                                onClick={() => navigate(`/${lang}/privacy-policy`)}
                                className="hover:text-[#28B13D] transition"
                            >
                                {t("Политика конфиденциальности")}
                            </Button>
                        </div>

                        {/* КОПИРАЙТ */}
                        <Paragraph className="text-[#232323] text-[14px] sm:text-[16px] text-center lg:text-right">
                            © INVESTin 2025
                        </Paragraph>
                    </div>
                </div>
            )}
        </div>
    );
};
