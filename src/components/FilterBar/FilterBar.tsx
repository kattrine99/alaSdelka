import { FaLocationDot, FaClock } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiltersState } from "../../utils/variables";
import { Button, Input } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi2";
import { useGetFiltersDataQuery } from "../../Store/api/Api";

interface FilterBarProps {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    onSearch: () => void;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    selectedCategory: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    selectedCategory,
    onSearch,
}) => {
    const navigate = useNavigate();
    const { data: filterOptions, isLoading } = useGetFiltersDataQuery();

    if (isLoading || !filterOptions) return null;

    const handleNavigateToCategory = () => {
        const categoryRouteMap: Record<string, string> = {
            бизнес: "business",
            франшиза: "franchise",
            стартапы: "startup",
            инвестиции: "investments",
        };

        const currentRoute = categoryRouteMap[selectedCategory.toLowerCase()];
        if (!currentRoute) return;

        const query = new URLSearchParams();
        if (filters.city) query.append("city", filters.city);
        if (filters.paybackPeriod) query.append("paybackPeriod", filters.paybackPeriod);
        if (filters.priceMin) query.append("priceMin", filters.priceMin);
        if (filters.priceMax) query.append("priceMax", filters.priceMax);
        if (searchInput) query.append("search", searchInput);
        query.append("category", selectedCategory.toLowerCase());

        navigate(`/${currentRoute}?${query.toString()}`);
    };

    return (
        <div className="flex max-xl:flex-wrap items-center gap-3 px-4 py-[13px] bg-white rounded-[24px] rounded-tl-[0px]">
            <div className="w-full flex max-xl:flex-wrap items-center rounded-xl rounded-r-2xl border border-[#EAEBF0] bg-white">
                {/* Город */}
                <div className=" relative flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg h-[16px]">
                        <FaLocationDot />
                    </span>
                    <select
                        value={filters.city}
                        onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                        className="text-[15px] text-black px-3 py-2 rounded-md focus:outline-none bg-white appearance-none pr-6">
                        <option value="">Город</option>
                        {filterOptions.cities.map((city) => (
                            <option className="px-1.5" key={city.id} value={String(city.id)}>
                                {city.name_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-1 text-xl text-[#191919] pointer-events-none" />
                </div>

                <div className="h-7.5 border-l border-[#D9D9D9]" />

                {/* Окупаемость */}
                <div className="relative flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg">
                        <FaClock />
                    </span>
                    <select
                        value={filters.paybackPeriod}
                        onChange={(e) => setFilters((prev) => ({ ...prev, paybackPeriod: e.target.value }))}
                        className=" text-[15px] text-black px-3 focus:outline-none bg-transparent appearance-none pr-6">
                        <option value="">Окупаемость</option>
                        <option value="До 6 месяцев" >До 6 месяцев</option>
                        <option value="До 1 года" >До 1 года</option>
                        <option value="До 3 лет">До 3 лет</option>
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-1 text-xl text-[#191919] pointer-events-none" />
                </div>

                <div className="h-7.5 border-l border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-2xl">
                        <HiCurrencyDollar />
                    </span>
                    <span className="text-[15px] text-black">Цена</span>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-x-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">от</span>
                            <Input
                                type="text"
                                value={filters.priceMin}
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[16px] text-black">сум</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">до</span>
                            <Input
                                type="text"
                                value={filters.priceMax}
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[16px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Поиск и кнопка перехода */}
            <div className="w-full flex gap-2.5 h-[54px] justify-end">
                <div className="flex w-full items-center border border-[#2EAA7B] rounded-xl pl-5 bg-white overflow-hidden">
                    <FiSearch className="text-[#2EAA7B] h-[24px]" />
                    <Input
                        type="text"
                        placeholder="Поиск по названию или ID"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        isError={false}
                        className="w-full text-4 px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
                    />
                    <Button
                        onClick={onSearch}
                        className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-green-600 transition rounded-none"
                    >
                        Поиск
                    </Button>
                </div>
                <Button
                    onClick={handleNavigateToCategory}
                    className="text-[#2EAA7B] py-1 px-5 border border-[#2EAA7B] rounded-xl font-semibold hover:bg-[#2EAA7B] hover:text-white transition text-[15px]"
                >
                    Перейти к категории
                </Button>
            </div>
        </div>
    );
};
