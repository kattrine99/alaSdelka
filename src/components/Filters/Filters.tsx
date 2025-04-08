import { Paragraph, Button, Input } from "../index"
import FrameIcon from '../../assets/frame.svg?react'
import CopyIcon from '../../assets/copy-success.svg?react'
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import WalletIcon from '../../assets/wallet-add.svg?react'
import ChartIcon from '../../assets/Chart.svg?react'
import { MdOutlineArrowDropDown } from "react-icons/md"
import { FiltersState } from "../../utils/variables"
import { useState } from "react";
import { ICard } from "../Cards/Cards";

interface FiltersProps {
    category: "бизнес" | "франшиза" | "стартап" | "инвестиции";
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export const Filters: React.FC<FiltersProps> = ({ category, filters, setFilters }) => {
    const buttonsData = [
        "Не важно",
        "До 6 месяцев",
        "До 3 лет",
        "До 1 года"
    ]

    const [filteredCards, setFilteredCards] = useState<ICard[]>([]);

    const handleSearch = async () => {
        try {
            const res = await fetch("/api/your-data-endpoint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters),
            });

            if (!res.ok) {
                throw new Error(`Ошибка запроса: ${res.statusText}`);
            }

            const data = await res.json();
            setFilteredCards(data);
        } catch (error) {
            console.error("Ошибка при фильтрации:", error);
        }
    };


    const showPayback = ["бизнес", "франшиза"].includes(category);
    const showStage = category === "стартап";
    const showProfit = category === "франшиза";
    const showInvestments = ["франшиза", "стартап"].includes(category);
    const showPrice = ["бизнес", "инвестиции"].includes(category);

    return (
        <div className="w-full mt-5">
            {/* Категории */}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>Категории</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                        <option value="">Все категории</option>
                        <option>Кафе</option>
                        <option>категория</option>
                        <option>категория</option>
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
                    <select value={filters.city} onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                        <option value="">Выбрать</option>
                        <option>Ташкент</option>
                        <option>Самарканд</option>
                        <option>Бухара</option>
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
                        <select value={filters.stage} onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                            className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                            <option value="">Выбрать</option>
                            <option>Идея</option>
                            <option>Разработка</option>
                            <option>Готовый продукт</option>
                        </select>
                        <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                    </div>
                </div>
            )}

            {/*Период окупаемости*/}
            {
                showPayback && (<div className="w-[286px] gap-y-2">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-[#2EAA7B] w-4 h-4" />
                        <Paragraph>Период окупаемости</Paragraph>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4 text-black font-inter font-normal text-3.5 leading-4.5">
                        {
                            buttonsData.map((item) => {

                                return <Button className={"py-[8.5px] px-3 border-1 border-[#ECECEC] focus:border-[#2EAA7B] focus:text-[#2EAA7B] rounded-full "}>{item}</Button>
                            })
                        }
                    </div>
                </div>
                )
            }
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
            <div className="w-[286px] mt-4">
                {["Найти", "Сбросить"].map((item) => (
                    <Button
                        key={item}
                        onClick={() => {
                            if (item === "Найти") {
                                handleSearch();
                            } else {
                                setFilters({
                                    city: "",
                                    category: "",
                                    paybackPeriod: "",
                                    priceMin: "",
                                    priceMax: "",
                                    investmentMin: "",
                                    investmentMax: "",
                                    profitabilityMin: "",
                                    profitabilityMax: "",
                                    stage: "",
                                });
                            }
                        }}
                        className="w-full py-3 px-5 border border-[#2EAA7B] mb-2.5 hover:bg-[#2EAA7B] hover:text-white focus:bg-[#2EAA7B] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA7B] outline-none"
                    >
                        {item}
                    </Button>
                ))}
            </div>

        </div>
    )
}