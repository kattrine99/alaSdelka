import {Paragraph, Button, Input} from "../index";
import FrameIcon from '../../assets/frame.svg?react';
import CopyIcon from '../../assets/copy-success.svg?react';
import {FaLocationDot, FaClock} from "react-icons/fa6";
import {HiCurrencyDollar} from "react-icons/hi2";
import WalletIcon from '../../assets/wallet-add.svg?react';
import ChartIcon from '../../assets/Chart.svg?react';
import {useGetFiltersDataQuery} from "../../Store/api/Api";
import {FiltersState} from "../../utils/variables";
import {useEffect} from "react";
import {useTranslation} from "../../../public/Locales/context/TranslationContext";
import {useSelector} from "react-redux";
import {RootState} from "../../Store/store";
import GpsIcon from '../../assets/gps.svg?react'
import Select from "../Select/Select.tsx";

interface FiltersProps {
    offer_type: "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции";
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    onApplyFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({offer_type, filters, setFilters, onApplyFilters}) => {
    const {data: filterOptions, isLoading, isError} = useGetFiltersDataQuery();
    const buttonsData = ["Не важно", "До 6 месяцев", "До 1 года", "До 3 лет"];
    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);
    const currencySymbol = selectedCurrency === "UZS" ? "UZS" : "USD";

    const showPayback = ["business", "franchise"].includes(offer_type);
    const showStage = offer_type === "startup";
    const showProfit = offer_type === "franchise";
    const showInvestments = ["franchise", "startup"].includes(offer_type);
    const showPrice = ["business", "investments"].includes(offer_type);
    const showAreaFilters = ["business"].includes(offer_type);
    const {lang, t} = useTranslation()
    const update = (field: keyof FiltersState, value: string) => {
        setFilters(prev => ({...prev, [field]: value}));
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
    const handleCategoryChange = (value: string) => {
        const selected = filterOptions?.categories.find(cat => String(cat.slug) === value);
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
                    <FrameIcon className="text-[#2EAA62]"/>
                    <Paragraph>{t("Тип объявления")}</Paragraph>
                </div>
                <Select value={filters.listing_type || ""} onChange={(value) => update("listing_type", value)}
                        options={[
                            {
                                value: "sell",
                                label:
                                    offer_type === "investments" || offer_type === "startup"
                                        ? t("Поиск инвестора")
                                        : t("Продажа"),
                            },
                            {
                                value: "buy",
                                label:
                                    offer_type === "investments" || offer_type === "startup"
                                        ? t("Поиск инвестпроекта")
                                        : t("Покупка"),
                            },
                        ]}/>
            </div>
            {/* Категория */}
            <div className="gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA62]"/>
                    <Paragraph>{t("Категория проекта")}</Paragraph>
                </div>
                <Select value={filters.categorySlug || ""} onChange={handleCategoryChange}
                        searchable={true}
                        options={[
                            {
                                value: "",
                                label: t("Все категории")
                            },
                            ...filterOptions.categories.map((cat) => ({
                                value: cat.slug,
                                label: lang === "uz" ? cat.title_uz : cat.title_ru,
                            }))
                        ]}/>
            </div>

            {/* Город */}
            <div className="gap-y-2">
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-[#2EAA62]"/>
                    <Paragraph>{t("Город")}</Paragraph>
                </div>
                <Select value={filters.city} onChange={(value) => update("city", value)}
                        searchable={true}
                        options={[
                            {
                                value: "",
                                label: t("Все города"),
                            },
                            ...filterOptions.cities.map((city) => ({
                                value: city.slug,
                                label: lang === "uz" ? city.name_uz : city.name_ru,
                            }))
                        ]}/>
            </div>

            {/* Стадия проекта */}
            {showStage && (
                <div className="gap-y-2">
                    <div className="flex items-center gap-2">
                        <CopyIcon className="text-[#2EAA62]"/>
                        <Paragraph>{t("Стадия проекта")}</Paragraph>
                    </div>
                    <Select value={filters.stage} onChange={(value) => update("stage", value)}
                            options={[
                                {
                                    value: "",
                                    label: t("Выбрать"),
                                },
                                ...filterOptions.project_stages.map((el) => ({
                                    value: el.id.toString(),
                                    label: lang === "uz" ? el.name_uz : el.name_ru,
                                }))
                            ]}/>
                </div>
            )}

            {/* Период окупаемости */}
            {showPayback && (
                <div className="gap-y-2">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-[#2EAA62]"/>
                        <Paragraph>{t("Период окупаемости")}</Paragraph>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {buttonsData.map(item => (
                            <Button
                                key={item}
                                onClick={() => update("paybackPeriod", item)}
                                className={`px-4 py-2 rounded-lg border ${filters.paybackPeriod === item
                                    ? "bg-[#2EAA62] text-white border-[#2EAA62]"
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
                        <HiCurrencyDollar className="text-[#2EAA62]"/>
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
                        <GpsIcon className="text-[#2EAA62]"/>
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
                        <WalletIcon className="text-[#2EAA62]"/>
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
                            <span className="text-[14px] text-black">{t(currencySymbol)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Рентабельность */}
            {showProfit && (
                <div className="gap-y-2 mt-4">
                    <div className="flex items-center gap-2">
                        <ChartIcon className="text-[#2EAA62]"/>
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
                            <span className="text-[14px] text-black">{t(currencySymbol)}</span>
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
                            <span className="text-[14px] text-black">{t(currencySymbol)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Кнопки */}
            <div className="mt-4">
                <Button
                    onClick={onApplyFilters}
                    className="w-full py-3 px-5 border border-[#2EAA62] mb-2.5 hover:bg-[#2EAA62] hover:text-white focus:bg-[#2EAA62] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA62] outline-none"
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
                    className="w-full py-3 px-5 border border-[#2EAA62] mb-2.5 hover:bg-[#2EAA62] hover:text-white focus:bg-[#2EAA62] focus:text-white rounded-[6px] font-inter font-semibold text-[15px] leading-5.5 text-[#2EAA62] outline-none"
                >
                    {t("Сменить")}
                </Button>
            </div>
        </div>
    );
};
