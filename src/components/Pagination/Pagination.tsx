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

    return (
        <div className="flex justify-center md:justify-end items-center gap-3 mt-8 flex-wrap">
            <button
                onClick={() => {
                    onPageChange(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                }
                disabled={currentPage === 1}
                className="w-10 h-10 text-[#68727D] bg-white border-1 border-[#EAEBF0] rounded hover:bg-[#2EAA7B] hover:text-white"
            >
                <FaArrowLeftLong className="m-2.5" />
            </button>

            {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                    <button
                        key={pageNum}
                        onClick={() => {
                            onPageChange(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                        }
                        className={`w-10 h-10 rounded text-sm font-semibold transition border ${currentPage === pageNum
                            ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                            : "bg-white text-[#2EAA7B] border-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}

                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                onClick={() => {
                    onPageChange(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 text-[#68727D] bg-white border-1 border-[#EAEBF0] rounded hover:bg-[#2EAA7B] hover:text-white"
            >
                <FaArrowRightLong className="m-2.5" />
            </button>
        </div >
    );
};
