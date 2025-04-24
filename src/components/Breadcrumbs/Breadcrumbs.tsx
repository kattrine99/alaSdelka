import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";
import { urlToTypeMap, typeToUrlMap } from "../../utils/categoryMap";

type CrumbLink = {
    label: string;
    href?: string; // если есть, делаем ссылкой
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
    if (links?.length) {
        return (
            <nav className="text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex items-center gap-2">
                {links.map((link, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {link.href ? (
                            <Link to={link.href} className="hover:text-[#28B13D] transition duration-500">
                                {link.label}
                            </Link>
                        ) : (
                            <span className="text-[#28B13D]">{link.label}</span>
                        )}
                        {index !== links.length - 1 && (
                            <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                        )}
                    </span>
                ))}
            </nav>
        );
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
                <Link to="/" className="hover:text-[#28B13D] transition duration-500">Главная</Link>
                <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                <span className="text-[#28B13D]">{title}</span>
            </nav>
        );
    }

    if (!category) return null;

    return (
        <nav className="text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex items-center gap-2">
            <Link to="/" className="hover:text-[#28B13D] transition duration-500">Главная</Link>
            <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />

            <Link to={`/${categoryUrl}`} className="hover:text-[#28B13D] transition duration-500 capitalize">
                {readableName}
            </Link>

            {title && (
                <>
                    <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
                    <span className="text-[#28B13D]">{title}</span>
                </>
            )}
        </nav>
    );
};
