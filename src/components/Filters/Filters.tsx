import { Paragraph, Button, Input } from "../index";
import FrameIcon from '../../assets/frame.svg?react';
import CopyIcon from '../../assets/copy-success.svg?react';
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import WalletIcon from '../../assets/wallet-add.svg?react';
import ChartIcon from '../../assets/Chart.svg?react';
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useGetFiltersDataQuery } from "../../Store/api/Api";
import { FiltersState } from "../../utils/variables";
import { FilterData } from "../../Store/api/types";
import { useState } from "react";

interface FiltersProps {
    category: "бизнес" | "франшиза" | "стартап" | "инвестиции";
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    onApplyFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ category, filters, setFilters, onApplyFilters }) => {
    const [activePaybackPeriod, setActivePaybackPeriod] = useState<string>("");
    const buttonsData = [
        "Не важно",
        "До 6 месяцев",
        "До 1 года",
        "До 3 лет"
    ];

    const { data: filterOptions, isLoading, isError } = useGetFiltersDataQuery();
    const [localFilters, setLocalFilters] = useState<FiltersState>(filters);

    const showPayback = ["бизнес", "франшиза"].includes(category);
    const showStage = category === "стартап";
    const showProfit = category === "франшиза";
    const showInvestments = ["франшиза", "стартап"].includes(category);
    const showPrice = ["бизнес", "инвестиции"].includes(category);

    if (isLoading) return <div>Загрузка фильтров...</div>;
    if (isError || !filterOptions) return <div>Ошибка загрузки фильтров</div>;

    return (
        <div className="w-full mt-5">

            {/* Категории */}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>Категории</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={localFilters.category}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, category: e.target.value }))}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                    >
                        <option value="">Все категории</option>
                        {filterOptions.categories.map((cat) => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.title_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                </div>
            </div>

            {/* Город */}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-[#2EAA7B]" />
                    <Paragraph>Город</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={localFilters.city}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, city: e.target.value }))}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                    >
                        <option value="">Выбрать</option>
                        {filterOptions.cities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                                {city.name_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                </div>
            </div>

            {/* Стадия проекта */}
            {showStage && (
                <div className="w-[286px] gap-y-2">
                    <div className="flex items-center gap-2">
                        <CopyIcon className="text-[#2EAA7B]" />
                        <Paragraph>Стадия проекта</Paragraph>
                    </div>
                    <div className="relative mt-2 mb-4">
                        <select
                            value={localFilters.stage}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, stage: e.target.value }))}
                            className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                        >
                            <option value="">Выбрать</option>
                            {filterOptions.project_stages.map((stage: FilterData["project_stages"][0]) => (
                                <option key={stage.id} value={String(stage.id)}>
                                    {stage.name_ru}
                                </option>
                            ))}
                        </select>
                        <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Период окупаемости */}
            {showPayback && (
                <div className="w-[286px] gap-y-2">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-[#2EAA7B]" />
                        <Paragraph>Период окупаемости</Paragraph>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {buttonsData.map((item) => (
                            <Button
                                key={item}
                                onClick={() => {
                                    setActivePaybackPeriod(item);
                                    setLocalFilters(prev => ({ ...prev, paybackPeriod: item === "Не важно" ? "" : item }));
                                }}
                                className={`py-[8.5px] px-3 border ${activePaybackPeriod === item ? "border-[#2EAA7B] text-[#2EAA7B]" : "border-[#ECECEC]"
                                    } rounded-full`}
                            >
                                {item}
                            </Button>
                        ))}

                    </div>
                </div>
            )}

            {/* Цена */}
            {showPrice && (<div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[#2EAA7B]">
                        <HiCurrencyDollar className="w-4 h-4" />
                    </span>
                    <span className="text-[15px] text-black">Цена</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                    <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                        <span className="text-[14px] text-black">от</span>
                        <Input
                            type="text"
                            placeholder="100 000"
                            className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                        <span className="text-[14px] text-black">сум</span>
                    </div>
                    <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                        <span className="text-[14px] text-black">до</span>
                        <Input
                            type="text"
                            placeholder="100 000"
                            className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                        <span className="text-[14px] text-black">сум</span>
                    </div>
                </div>
            </div>
            )}
            {/* Вложения */}
            {
                showInvestments && (
                    <div className="w-[286px] gap-y-2 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[#2EAA7B] text-2xl">
                                <WalletIcon className="w-4 h-4" />
                            </span>
                            <span className="text-[15px] text-black">Вложения</span>
                        </div>
                        <div className="flex gap-x-1.5 mt-2">
                            <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                                <span className="text-[14px] text-black">от</span>
                                <Input
                                    type="text"
                                    placeholder="100 000"
                                    className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                                <span className="text-[14px] text-black">сум</span>
                            </div>
                            <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                                <span className="text-[14px] text-black">до</span>
                                <Input
                                    type="text"
                                    placeholder="100 000"
                                    className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                                <span className="text-[14px] text-black">сум</span>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Рентабельность */}
            {showProfit && (
                <div className="w-[286px] mt-4">
                    <div className="flex items-center gap-2">
                        <span>
                            <ChartIcon className="w-4 h-4" />
                        </span>
                        <span className="text-[15px] text-black">Рентабельность</span>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">от</span>
                            <Input
                                type="text"
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">до</span>
                            <Input
                                type="text"
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            )}
            {/* Кнопки Найти и Сбросить */}
            <div className="w-[286px] mt-4">
                {["Найти", "Сбросить"].map((item) => (
                    <Button
                        key={item}
                        onClick={() => {
                            if (item === "Найти") {
                                setFilters(localFilters);
                                onApplyFilters();
                            } else {
                                const emptyFilters: FiltersState = {
                                    category: "",
                                    city: "",
                                    stage: "",
                                    paybackPeriod: "",
                                    priceMin: "",
                                    priceMax: "",
                                    investmentMin: "",
                                    investmentMax: "",
                                    profitabilityMin: "",
                                    profitabilityMax: "",
                                };
                                setLocalFilters(emptyFilters);
                                setFilters(emptyFilters);
                                onApplyFilters();
                            }
                        }}
                        className="w-full py-3 px-5 border border-[#2EAA7B] mb-2.5 hover:bg-[#2EAA7B] hover:text-white focus:bg-[#2EAA7B] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA7B] outline-none"
                    >
                        {item}
                    </Button>
                ))}
            </div>

        </div>
    );
};
