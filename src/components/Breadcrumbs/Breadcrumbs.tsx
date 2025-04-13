import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";
import { urlToTypeMap, typeToUrlMap } from "../../utils/categoryMap";

export const Breadcrumbs = ({ category, title }: { category?: string; title?: string }) => {
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
