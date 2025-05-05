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
import { useState, useEffect } from "react";

interface FiltersProps {
    offer_type: "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции";
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    onApplyFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ offer_type, filters, setFilters, onApplyFilters }) => {
    const buttonsData = ["Не важно", "До 6 месяцев", "До 1 года", "До 3 лет"];


    const { data: filterOptions, isLoading, isError } = useGetFiltersDataQuery();

    const showPayback = ["business", "franchise"].includes(offer_type);
    const showStage = offer_type === "startup";
    const showProfit = offer_type === "franchise";
    const showInvestments = ["franchise", "startup"].includes(offer_type);
    const showPrice = ["business", "investments"].includes(offer_type);

    const [localFilters, setLocalFilters] = useState<FiltersState>(filters);
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    if (isLoading) return <div>Загрузка фильтров...</div>;
    if (isError || !filterOptions) return <div>Ошибка загрузки фильтров</div>;

    const update = (field: keyof FiltersState, value: string) =>
        setLocalFilters((prev) => ({ ...prev, [field]: value }));
    console.log(localFilters)
    return (
        <div className="w-full mt-5">
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>Категория проекта</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={localFilters.category_id ?? ""}
                        onChange={(e) => update("category_id", e.target.value)}
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

            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-[#2EAA7B]" />
                    <Paragraph>Город</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={localFilters.city}
                        onChange={(e) => update("city", e.target.value)}
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

            {showStage && (
                <div className="w-[286px] gap-y-2">
                    <div className="flex items-center gap-2">
                        <CopyIcon className="text-[#2EAA7B]" />
                        <Paragraph>Стадия проекта</Paragraph>
                    </div>
                    <div className="relative mt-2 mb-4">
                        <select
                            value={localFilters.stage}
                            onChange={(e) => update("stage", e.target.value)}
                            className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                        >
                            <option value="">Выбрать</option>
                            {filterOptions.project_stages.map((stage) => (
                                <option key={stage.id} value={String(stage.id)}>
                                    {stage.name_ru}
                                </option>
                            ))}
                        </select>
                        <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                    </div>
                </div>
            )}

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
                                onClick={() => update("paybackPeriod", item)}
                                className={`px-4 py-2 rounded-lg border ${localFilters.paybackPeriod === item ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "bg-white text-black border-gray-300"}`}
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {showPrice && (
                <div className="w-[286px] gap-y-2">
                    <div className="flex items-center gap-2">
                        <HiCurrencyDollar className="text-[#2EAA7B]" />
                        <Paragraph>Цена</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">от</span>
                            <Input type="text" value={localFilters.priceMin} onChange={(e) => update("priceMin", e.target.value)} placeholder="100 000" className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">от</span>
                            <Input type="text" value={localFilters.priceMax} onChange={(e) => update("priceMax", e.target.value)} placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>

                        </div>
                    </div>
                </div>
            )}

            {showInvestments && (
                <div className="w-[286px] gap-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <WalletIcon className="text-[#2EAA7B]" />
                        <Paragraph>Вложения</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">от</span>
                            <Input type="text" value={localFilters.investmentMin} onChange={(e) => update("investmentMin", e.target.value)} placeholder="от" className="w-full bg-[#F2F2F2] outline-none rounded-lg py-3 px-1.5" isError={false} />
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">до</span>
                            <Input type="text" value={localFilters.investmentMax} onChange={(e) => update("investmentMax", e.target.value)} placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            )}

            {showProfit && (
                <div className="w-[286px] gap-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <ChartIcon className="text-[#2EAA7B]" />
                        <Paragraph>Рентабельность</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">от</span>
                            <Input type="text" value={localFilters.profitabilityMin} onChange={(e) => update("profitabilityMin", e.target.value)} placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">до</span>
                            <Input type="text" value={localFilters.profitabilityMax} onChange={(e) => update("profitabilityMax", e.target.value)} placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[14px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-[286px] mt-4">
                {["Найти", "Сбросить"].map((item) => (
                    <Button
                        key={item}
                        onClick={() => {
                            if (item === "Найти") {
                                setFilters(localFilters);
                                onApplyFilters();
                            } else {
                                const cleared: FiltersState = {
                                    category: "",
                                    category_id: 0,
                                    city: "",
                                    stage: "",
                                    paybackPeriod: "",
                                    priceMin: "",
                                    priceMax: "",
                                    investmentMin: "",
                                    investmentMax: "",
                                    profitabilityMin: "",
                                    profitabilityMax: "",
                                    listing_type: "",
                                    offer_type: "",
                                };
                                setLocalFilters(cleared);
                                setFilters(cleared);
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
