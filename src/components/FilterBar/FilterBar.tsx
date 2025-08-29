import { FaLocationDot } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiltersState } from "../../utils/variables";
import { Button, Input } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi2";
import { useGetFiltersDataQuery } from "../../Store/api/Api";
import FrameIcon from "../../assets/frame.svg?react";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";


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
    const { t, lang } = useTranslation();
    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);
    const currencySymbol = selectedCurrency === "UZS" ? "сум" : "$";

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
        if (filters.category_id) query.append("categories", filters.category_id.toString());
        if (filters.priceMin) query.append("priceMin", filters.priceMin);
        if (filters.priceMax) query.append("priceMax", filters.priceMax);
        if (searchInput) query.append("search", searchInput);
        query.append("category", selectedCategory.toLowerCase());

        navigate(`/${lang}/${currentRoute}?${query.toString()}`);
    };

    return (
        <div className="flex max-2xl:flex-wrap items-center gap-3 px-4 py-[13px] bg-white max-w-xl:rounded-tr-none rounded-[24px] rounded-tl-[0px]">
            <div className="w-full flex max-xl:flex-wrap items-center rounded-xl rounded-r-2xl  border border-[#EAEBF0] bg-white">
                {/* Город */}
                <div className=" relative flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg h-[16px]">
                        <FaLocationDot />
                    </span>
                    <select
                        value={filters.city}
                        onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                        className="text-[15px] text-black px-3 py-2 rounded-md focus:outline-none bg-white appearance-none pr-6">
                        <option value="">{t("Город")}</option>
                        {filterOptions.cities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                                {lang === "uz" ? city.name_uz : city.name_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-1 text-xl text-[#191919] pointer-events-none" />
                </div>

                <div className="h-7.5 border-l border-[#D9D9D9]" />

                {/* Категория */}
                <div className="relative flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg">
                        <FrameIcon className="text-[#2EAA7B]" />
                    </span>
                    <select
                        value={filters.category_id || ""}
                        onChange=
                        {(e) => {
                            const selected = filterOptions.categories.find(
                                (cat) => String(cat.id) === e.target.value
                            );

                            if (selected) {
                                setFilters((prev) => ({
                                    ...prev,
                                    categories: selected,
                                    category_id: selected.id,
                                    category: selected.id.toString(),
                                }));
                            } else {
                                setFilters((prev) => ({
                                    ...prev,
                                    categories: null,
                                    category_id: undefined,
                                    category: "",
                                }));
                            }
                        }}

                        className="text-[15px] text-black px-3 py-2 rounded-md focus:outline-none bg-white appearance-none pr-6 max-h-[200px] overflow-y-auto"
                    >
                        <option value="">{t("Категория")}</option>
                        {filterOptions.categories.map((cat) => (
                            <option key={cat.id} value={String(cat.id)}>
                                {lang === "uz" ? cat.title_uz : cat.title_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-1 text-xl text-[#191919] pointer-events-none" />
                </div>

                <div className="h-7.5 border-l border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-2xl">
                        <HiCurrencyDollar />
                    </span>
                    <span className="text-[15px] text-black">{t("Цена")}</span>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-x-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">{t("от")}</span>
                            <Input
                                type="text"
                                value={filters.priceMin}
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[16px] text-black">{t(currencySymbol)}</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">{t("до")}</span>
                            <Input
                                type="text"
                                value={filters.priceMax}
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[16px] text-black">{t(currencySymbol)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Поиск и кнопка перехода */}
            <div className="w-full flex gap-2.5 h-[54px] justify-end">
                {/* Поисковая строка + кнопка */}
                <div className="flex w-full border border-[#2EAA7B] rounded-xl overflow-hidden bg-white">
                    <div className="flex items-center px-3">
                        <FiSearch className="text-[#2EAA7B] h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder={t("Поиск по названию или ID")}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        isError={false}
                        className="w-full h-13.5 text-sm px-2 text-[#787878] placeholder-[#787878] bg-white outline-none"
                    />
                    <Button
                        onClick={onSearch}
                        className="px-5 text-sm font-semibold bg-[#2EAA7B] hover:bg-[#31B683] text-white transition duration-500 rounded-none"
                    >
                        {t("Поиск")}
                    </Button>
                </div>

                {/* Кнопка перехода */}
                <Button
                    onClick={handleNavigateToCategory}
                    className="text-[#2EAA7B] py-1 px-5 border rounded-xl font-semibold hover:bg-[#2EAA7B] hover:text-white transition text-[15px] duration-500"
                >
                    {t("Перейти к категории")}
                </Button>
            </div>

        </div >
    );
};
