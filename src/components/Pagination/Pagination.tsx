import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    // Функция для вычисления диапазона страниц для отображения
    const getPageRange = () => {
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            // Если общее количество страниц меньше или равно 5, показываем все
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start: number;
        let end: number;

        if (currentPage <= 3) {
            // Для страниц 1-3 показываем 1,2,3,4,5
            start = 1;
            end = maxVisible;
        } else if (currentPage >= totalPages - 2) {
            // Для последних 3 страниц показываем последние 5
            start = totalPages - maxVisible + 1;
            end = totalPages;
        } else {
            // Для остальных страниц текущая страница в центре
            start = currentPage - 2;
            end = currentPage + 2;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageRange = getPageRange();

    return (
        <div className="flex justify-center md:justify-end items-center gap-2 mt-8 flex-wrap">
            <button
                onClick={() => {
                    onPageChange(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="w-10 h-10 text-[#68727D] bg-white border-1 border-[#EAEBF0] rounded hover:bg-[#2EAA62] hover:text-white"
            >
                <FaArrowLeftLong className="m-2.5" />
            </button>

            {pageRange.map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => {
                        onPageChange(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded text-sm font-semibold transition border ${
                        currentPage === pageNum
                            ? "bg-[#2EAA62] text-white border-[#2EAA62]"
                            : "bg-white text-[#2EAA62] border-[#2EAA62] hover:bg-[#2EAA62] hover:text-white"
                    }`}
                >
                    {pageNum}
                </button>
            ))}

            <button
                onClick={() => {
                    onPageChange(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="w-10 h-10 text-[#68727D] bg-white border-1 border-[#EAEBF0] rounded hover:bg-[#2EAA62] hover:text-white"
            >
                <FaArrowRightLong className="m-2.5" />
            </button>
        </div>
    );
};