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
import { useEffect } from "react";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import GpsIcon from '../../assets/gps.svg?react'

interface FiltersProps {
    offer_type: "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции";
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    onApplyFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ offer_type, filters, setFilters, onApplyFilters }) => {
    const { data: filterOptions, isLoading, isError } = useGetFiltersDataQuery();
    const buttonsData = ["Не важно", "До 6 месяцев", "До 1 года", "До 3 лет"];
    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);
    const currencySymbol = selectedCurrency === "UZS" ? "сум" : "$";

    const showPayback = ["business", "franchise"].includes(offer_type);
    const showStage = offer_type === "startup";
    const showProfit = offer_type === "franchise";
    const showInvestments = ["franchise", "startup"].includes(offer_type);
    const showPrice = ["business", "investments"].includes(offer_type);
    const showAreaFilters = ["business"].includes(offer_type);
    const { lang, t } = useTranslation()
    const update = (field: keyof FiltersState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    useEffect(() => {
        if (filters.category_id && filterOptions?.categories?.length) {
            const matched = filterOptions.categories.find(cat => cat.id === filters.category_id);
            if (matched) {
                setFilters(prev => ({
                    ...prev,
                }));
            }
        }
    }, [filters.category_id, filterOptions, setFilters]);
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = filterOptions?.categories.find(cat => String(cat.slug) === e.target.value);
        if (selected) {
            setFilters(prev => ({
                ...prev,
                categorySlug: selected.slug,
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                categorySlug: undefined,
            }));
        }
    };

    if (isLoading) return <div>Загрузка фильтров...</div>;
    if (isError || !filterOptions) return <div>Ошибка загрузки фильтров</div>;

    return (
        <div className="w-full mt-5">
            <div className="gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>{t("Тип объявления")}</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={filters.listing_type || ""}
                        onChange={(e) => update("listing_type", e.target.value)}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                    >
                        <option value="sell">{(offer_type == 'investments' || offer_type == 'startup') ? (t("Поиск инвестора")) : t("Продажа")}</option>
                        <option value="buy">{(offer_type == 'investments' || offer_type == 'startup') ? (t("Поиск инвестпроекта")) : t("Покупка")}</option>
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                </div>
            </div>
            {/* Категория */}
            <div className="gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>{t("Категория проекта")}</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={filters.categorySlug || ""}
                        onChange={handleCategoryChange}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                    >
                        <option value="">{t("Все категории")}</option>
                        {filterOptions.categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>
                                {lang === "uz" ? cat.title_uz : cat.title_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                </div>
            </div>

            {/* Город */}
            <div className="gap-y-2">
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-[#2EAA7B]" />
                    <Paragraph>{t("Город")}</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select
                        value={filters.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                    >
                        <option value="">{t("Выбрать")}</option>
                        {filterOptions.cities.map(city => (
                            <option key={city.slug} value={String(city.slug)}>
                                {lang === "uz" ? city.name_uz : city.name_ru}
                            </option>
                        ))}
                    </select>
                    <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                </div>
            </div>

            {/* Стадия проекта */}
            {showStage && (
                <div className="gap-y-2">
                    <div className="flex items-center gap-2">
                        <CopyIcon className="text-[#2EAA7B]" />
                        <Paragraph>{t("Стадия проекта")}</Paragraph>
                    </div>
                    <div className="relative mt-2 mb-4">
                        <select
                            value={filters.stage}
                            onChange={(e) => update("stage", e.target.value)}
                            className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none"
                        >
                            <option value="">{t("Выбрать")}</option>
                            {filterOptions.project_stages.map(stage => (
                                <option key={stage.id} value={String(stage.id)}>
                                    {lang === "uz" ? stage.name_uz : stage.name_ru}
                                </option>
                            ))}
                        </select>
                        <MdOutlineArrowDropDown className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Период окупаемости */}
            {showPayback && (
                <div className="gap-y-2">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-[#2EAA7B]" />
                        <Paragraph>{t("Период окупаемости")}</Paragraph>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {buttonsData.map(item => (
                            <Button
                                key={item}
                                onClick={() => update("paybackPeriod", item)}
                                className={`px-4 py-2 rounded-lg border ${filters.paybackPeriod === item
                                    ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                    : "bg-white text-black border-gray-300"
                                    }`}
                            >
                                {t(item)}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Цена */}
            {showPrice && (
                <div className="gap-y-2">
                    <div className="flex items-center gap-2">
                        <HiCurrencyDollar className="text-[#2EAA7B]" />
                        <Paragraph>{t("Цена")}</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-3.5 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("от")}</span>
                            <Input
                                type="text"
                                value={filters.priceMin}
                                onChange={(e) => update("priceMin", e.target.value)}
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[14px] text-black">{t(currencySymbol)}</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("до")}</span>
                            <Input
                                type="text"
                                value={filters.priceMax}
                                onChange={(e) => update("priceMax", e.target.value)}
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[14px] text-black">{t(currencySymbol)}</span>
                        </div>
                    </div>
                </div>
            )}
            {showAreaFilters && (
                <div className="gap-y-2 mt-2">
                    <div className="flex items-center gap-2">
                        <GpsIcon className="text-[#2EAA7B]" />
                        <Paragraph>{t("Площадь, кв. м.")}</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-3.5 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("от")}</span>
                            <Input
                                type="text"
                                value={filters.areaFrom}
                                onChange={(e) => update("areaFrom", e.target.value)}
                                placeholder="10"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("до")}</span>
                            <Input
                                type="text"
                                value={filters.areaTo}
                                onChange={(e) => update("areaTo", e.target.value)}
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Вложения */}
            {showInvestments && (
                <div className="gap-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <WalletIcon className="text-[#2EAA7B]" />
                        <Paragraph>{t("Вложения")}</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("от")}</span>
                            <Input
                                type="text"
                                value={filters.investmentMin}
                                onChange={(e) => update("investmentMin", e.target.value)}
                                placeholder="100 000"
                                className="w-full py-3 text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                        </div>
                        <div className="flex items-center gap-1 px-4 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("до")}</span>
                            <Input
                                type="text"
                                value={filters.investmentMax}
                                onChange={(e) => update("investmentMax", e.target.value)}
                                placeholder="100 000"
                                className="w-full py-3 text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[14px] text-black">{t("сум")}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Рентабельность */}
            {showProfit && (
                <div className="gap-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <ChartIcon className="text-[#2EAA7B]" />
                        <Paragraph>{t("Рентабельность")}</Paragraph>
                    </div>
                    <div className="flex gap-x-1.5 mt-2">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("от")}</span>
                            <Input
                                type="text"
                                value={filters.profitabilityMin}
                                onChange={(e) => update("profitabilityMin", e.target.value)}
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[14px] text-black">{t("сум")}</span>
                        </div>
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[14px] text-black">{t("до")}</span>
                            <Input
                                type="text"
                                value={filters.profitabilityMax}
                                onChange={(e) => update("profitabilityMax", e.target.value)}
                                placeholder="100 000"
                                className="w-full text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                                isError={false}
                            />
                            <span className="text-[14px] text-black">{t("сум")}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Кнопки */}
            <div className="mt-4">
                <Button
                    onClick={onApplyFilters}
                    className="w-full py-3 px-5 border border-[#2EAA7B] mb-2.5 hover:bg-[#2EAA7B] hover:text-white focus:bg-[#2EAA7B] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA7B] outline-none"
                >
                    {t("Найти")}
                </Button>
                <Button
                    onClick={() => {
                        const cleared: FiltersState = {
                            category_id: undefined,
                            city: "",
                            stage: "",
                            paybackPeriod: "",
                            priceMin: "",
                            priceMax: "",
                            areaFrom: "",
                            areaTo: "",
                            investmentMin: "",
                            investmentMax: "",
                            profitabilityMin: "",
                            profitabilityMax: "",
                            listing_type: "",
                            offer_type: "",
                        };
                        setFilters(cleared);
                    }}
                    className="w-full py-3 px-5 border border-[#2EAA7B] mb-2.5 hover:bg-[#2EAA7B] hover:text-white focus:bg-[#2EAA7B] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA7B] outline-none"
                >
                    {t("Сбросить")}
                </Button>
            </div>
        </div>
    );
};
