import { Link, useParams } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";
import { urlToTypeMap, typeToUrlMap } from "../../utils/categoryMap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

type CrumbLink = {
    label: string;
    href?: string;
};

export const Breadcrumbs = ({
    category,
    title,
    links,
}: {
    category?: string;
    title?: string;
    links?: CrumbLink[];
}) => {
    const location = useLocation();
    const { t } = useTranslation();
    const { lng } = useParams();
    if (links?.length) {
        return (
            <div className="w-full max-w-full overflow-hidden">
                <nav className="w-full text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex flex-wrap items-center gap-2">
                    {links.map((link, index) => {
                        const isActive = link.href === location.pathname;

                        return (
                            <span key={index} className="flex items-center gap-2">
                                {link.href ? (
                                    <Link
                                        to={lng + link.href}
                                        className={`transition duration-500 ${isActive
                                            ? "text-[#28B13D] font-semibold"
                                            : "hover:text-[#28B13D] text-[#68727D]"
                                            }`}
                                    >
                                        {t(link.label)}
                                    </Link>
                                ) : (
                                    <span className="text-[#28B13D]">{t(link.label)}</span>
                                )}
                                {index !== links.length - 1 && (
                                    <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                                )}
                            </span>
                        );
                    })}
                </nav>
            </div>
        )
    }

    const readableName = category
        ? urlToTypeMap[category as keyof typeof urlToTypeMap] ?? category
        : "";

    const categoryUrl = category
        ? typeToUrlMap[readableName as keyof typeof typeToUrlMap] ?? category
        : "";

    if (!category && title) {
        return (
            <nav className="text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex items-center gap-2">
                <Link to={`/${lng}/`} className="hover:text-[#28B13D] transition duration-500">{t("Главная")}</Link>
                <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                <span className="text-[#28B13D]">{t(title)}</span>
            </nav>
        );
    }

    if (!category) return null;

    return (
        <nav className="text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex items-center gap-2">
            <Link to={`/${lng}/`} className="hover:text-[#28B13D] transition duration-500">{t("Главная")}</Link>
            <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />

            <Link to={`/${lng}/${categoryUrl}`} className="hover:text-[#28B13D] transition duration-500 capitalize">
                {t(readableName)}
            </Link>

            {title && (
                <>
                    <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                    <span className="text-[#28B13D]">{t(title)}</span>
                </>
            )}
        </nav>
    );
};
