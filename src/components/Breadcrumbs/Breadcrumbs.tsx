import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

interface BreadcrumbsProps {
    current: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ current }) => {
    return (
        <nav className="text-[15px] font-inter font-medium leading-[22px] text-[#68727D] flex items-center gap-2">
            <Link to="/" className="hover:text-[#28B13D] transition duration-500">
                Главная
            </Link>
            <HiChevronRight className="text-gray-400 w-[20px] h-[20px]" />
            <span className="text-[#28B13D] text-[15px] font-inter font-medium leading-[22px]">{current}</span>
        </nav>
    );
};
