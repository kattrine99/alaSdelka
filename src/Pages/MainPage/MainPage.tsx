import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar, categories, Button, Footer, EmptyMessage, Applink, HomeCardSection } from "../../components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopIcon from '../../assets/shop.svg?react';
import InvestInIcon from '../../assets/investin_v15.svg?react';
import { useGetFavoritesQuery, useGetHomeOffersQuery, useGetCurrencyRateQuery } from "../../Store/api/Api";
import { useGetMainStatisticsQuery } from "../../Store/api/Api";
import { FiltersState } from "../../utils/variables";
import { categoryRouteMap } from "../../utils/categoryMap";
import { Offer } from "../../Store/api/types";
import { skipToken } from "@reduxjs/toolkit/query";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { MetaTags } from "../../components/MetaTags";
import { FaArrowRight } from "react-icons/fa6";

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции">("Бизнес");
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { data: currencyRateData } = useGetCurrencyRateQuery();
    const siteSettings = useSelector((state: RootState) => state.siteSettings.settings);

    const { home } = siteSettings?.seo || {};

    const navigate = useNavigate();
    const [listingTypes, setListingTypes] = useState<Record<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции", "buy" | "sell">>({
        Бизнес: "sell",
        Франшиза: "sell",
        Стартапы: "sell",
        Инвестиции: "sell",
    });
    const { data: mainStats } = useGetMainStatisticsQuery();

    const cityStats = useMemo(() => {
        if (!mainStats?.cities_statistics) return null;

        switch (selectedCategory) {
            case "Бизнес":
                return mainStats.cities_statistics.business;
            case "Франшиза":
                return mainStats.cities_statistics.franchise;
            case "Стартапы":
                return mainStats.cities_statistics.startup;
            case "Инвестиции":
                return mainStats.cities_statistics.investments;
            default:
                return [];
        }
    }, [mainStats, selectedCategory]);
    const [, setAllFavorites] = useState<Offer[]>([]);

    const { data: favoritesData, refetch } = useGetFavoritesQuery({ page: 1, per_page: 1000 });
    useEffect(() => {
        const loadAllPages = async () => {
            const firstPage = favoritesData?.data || [];
            const totalPages = favoritesData?.meta?.last_page || 1;

            const restPages = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, i) =>
                    fetch(`/api/favourite-offers?page=${i + 2}`)
                        .then((res) => res.json())
                        .then((res) => res.data)
                )
            );

            const all = firstPage.concat(...restPages.flat());
            setAllFavorites(all);
        };

        if (favoritesData?.data) {
            loadAllPages();
        }
    }, [favoritesData]);
    const favoriteIds = Array.isArray(favoritesData)
        ? []
        : favoritesData?.data?.map((offer: Offer) => offer.id) ?? [];
    const handleFavoritesChanged = async (id: number, status: "added" | "removed") => {
        await refetch();
    };
    const [filters, setFilters] = useState<FiltersState>({
        city: "",
        stage: "",
        listing_type: "",
        paybackPeriod: "",
        priceMin: "",
        priceMax: "",
        investmentMin: "",
        investmentMax: "",
        profitabilityMin: "",
        profitabilityMax: "",
        categorySlug: "",
        offer_type: "",
        areaFrom: "",
        areaTo: "",
    });

    const businessType = listingTypes["Бизнес"];
    const franchiseType = listingTypes["Франшиза"];
    const startupType = listingTypes["Стартапы"];
    const [searchInput, setSearchInput] = useState("");
    const { lang, t } = useTranslation();

    const {
        data: businessOffers,
        isLoading: isLoadingBusiness,
    } = useGetHomeOffersQuery(listingTypes["Бизнес"]);
    const {
        data: franchiseOffers,
        isLoading: isLoadingFranchise,
    } = useGetHomeOffersQuery(listingTypes["Франшиза"]);
    const {
        data: startupOffers,
        isLoading: isLoadingStartup,
    } = useGetHomeOffersQuery(listingTypes["Стартапы"]);
    const investmentType = listingTypes["Инвестиции"];
    const {
        data: investmentOffers,
        isLoading: isLoadingInvestment,
    } = useGetHomeOffersQuery(
        investmentType === "buy" || investmentType === "sell" ? investmentType : skipToken
    );

    const handleApplyFilters = () => {
        const ruToEnOfferTypeMap = {
            "бизнес": "business",
            "франшиза": "franchise",
            "стартапы": "startup",
            "инвестиции": "investments",
        } as const;

        const categoryKey = selectedCategory.toLowerCase();
        const offerTypeValue = ruToEnOfferTypeMap[categoryKey as keyof typeof ruToEnOfferTypeMap] || "business";

        const query = new URLSearchParams();
        if (searchInput) query.append("search", searchInput);
        if (filters.city) query.append("city", filters.city);
        if (filters.stage) query.append("stage", filters.stage);
        if (filters.category_id) query.append("category_id", filters.category_id.toString());
        if (filters.priceMin) query.append("priceMin", filters.priceMin);
        if (filters.priceMax) query.append("priceMax", filters.priceMax);
        if (filters.investmentMin) query.append("investmentMin", filters.investmentMin);
        if (filters.investmentMax) query.append("investmentMax", filters.investmentMax);
        if (filters.profitabilityMin) query.append("profitabilityMin", filters.profitabilityMin);
        if (filters.profitabilityMax) query.append("profitabilityMax", filters.profitabilityMax);

        if (offerTypeValue) query.append("offer_type", offerTypeValue);

        const categoryRoute = categoryRouteMap[categoryKey] || "business";
        navigate(`/${lang}/${categoryRoute}?${query.toString()}`);

    };
    function formatAmountUSD(amount: number): string {
        if (amount >= 1000000000000) {
            return `${(amount / 1000000000000).toFixed(1)} ${t("трлн")}`;
        } else if (amount >= 1000000000) {
            return `${(amount / 1000000000).toFixed(1)} ${t("млрд")}`;
        } else if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(0)} ${t("млн")}`;
        } else if (amount >= 1_000) {
            return `${(amount / 1_000).toFixed(0)} ${t("тыс")}`;
        } else {
            return amount.toLocaleString();
        }
    }
    const amountInUSD = (mainStats?.total_sold_amount ?? 0) / (currencyRateData?.rate ?? 1);
    const displayAmount = formatAmountUSD(amountInUSD);
    const translatedCategories = categories.map((item) => ({
        ...item,
        label: t(item.label),
        id: item.label
    }));
    return (
        <>
            {(home != null && home) && (
                <MetaTags title={home.title} description={home.description} keywords={home.keywords} />
            )}
            <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
                <Header />
                <section className="px-4 xl:px-20 lg:px-10 md:px-4 transition duration-500 ease-in-out relative overflow-hidden bg-gradient-to-tr from-[#16503A] to-[#31B683]">
                    <div className="flex justify-end">
                        <div
                            className="absolute right-[-12rem] bottom-[-5rem] w-96 h-96 md:w-150 md:h-150 lg:w-178 lg:h-178 md:right-[-16rem] lg:right-[-80px] md:bottom-[-9rem] bg-[url('/images/Check.png')] bg-no-repeat bg-contain rotate-[12deg] pointer-events-none z-0"></div>
                    </div>
                    <div className="relative container mx-auto py-17.5">
                        {/* Текст */}
                        <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-3xl w-full">
                            <Heading
                                level={1}
                                text={t("Купите, продайте или инвестируйте в бизнес")}
                                className="text-[clamp(32px,4vw,60px)] font-bold leading-tight text-white"
                            />
                            <Paragraph
                                className="text-white text-[clamp(16px,1.5vw,18px)] max-w-3/5 md:w-full font-semibold leading-snug">
                                <span className="inline-flex items-baseline align-baseline relative top-2">
                                    {/* <InvestInIcon className="w-[120px] md:w-[168.39px] h-auto" /> */}
                                </span>
                                {t("Первая в Узбекистане специализированная площадка для размещения объявлений о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов")}
                            </Paragraph>
                        </div>
                        <div className="mt-4">
                            {isAuthenticated ? (
                                <Applink
                                    to="/add-offer"
                                    className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] hover:bg-[#31B683] text-sm font-medium transition duration-600"
                                >
                                    {t("Создать объявление")}
                                </Applink>
                            ) : (
                                <Applink
                                    to="/login?next-step=/add-offer"
                                    className="bg-[#2EAA7B] text-white px-5 py-3 rounded-[10px] hover:bg-[#31B683] text-sm font-medium transition duration-600"
                                >
                                    {t("Создать объявление")}
                                </Applink>
                            )}
                        </div>
                        {/* Поиск */}
                        <div className="mt-4 flex-col relative flex">

                            {/* Категории */}
                            {/* <div className="max-w-142 bg-white rounded-t-xl border-b border-[#E0E0E0]">
                                <NavLinks
                                    links={translatedCategories}
                                    variant="tabs"
                                    activeLabel={selectedCategory}
                                    onClick={(label) => {
                                        if (
                                            label === "Бизнес" ||
                                            label === "Франшиза" ||
                                            label === "Инвестиции" ||
                                            label === "Стартапы"
                                        ) {
                                            setSelectedCategory(label);
                                        }
                                    }}
                                    className="flex text-[18px] font-openSans font-semibold"
                                    activeClassName="text-[#2EAA7B] w-34 py-3.5 px-4.25  border-b"
                                    inactiveClassName="text-[#787878] w-34 py-3.5 px-4.25 hover:text-[#2EAA7B] "
                                    underlineColor="bg-[#2EAA7B]"
                                />
                            </div> */}

                            {/* Фильтр Поиск*/}
                            {/* <FilterBar
                                filters={filters}
                                setFilters={setFilters}
                                searchInput={searchInput}
                                setSearchInput={setSearchInput}
                                selectedCategory={selectedCategory}
                                onSearch={handleApplyFilters}
                            /> */}
                        </div>
                    </div>
                </section>

                {/* Карточки */}
                <section className="mt-12.5 mb-8.75 px-4 xl:px-20 lg:px-10 md:px-4 transition duration-500 ease-in-out container mx-auto">
                    <div className="flex justify-start">
                        <div className="flex items-center justify-between  max-lg:flex max-lg:flex-col max-sm:justify-center w-full mb-6">
                            <div >
                                <Button onClick={() => {
                                    navigate(`$/{lang}/business`)
                                }} className={""}>
                                    <Heading level={2} text={t("Бизнес")} className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                                </Button>
                            </div>
                            <div className="col-span-2 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "sell" }))}
                                    className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-"sm: w - full whitespace - nowrap px - 6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration - 500 font - inter leading - [150 %] font - semibold
                        ${businessType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                            : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                        } `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Продажа бизнеса")}
                                </Button>
                                <Button
                                    onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "buy" }))}
                                    className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${businessType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"} `}
                                >
                                    <ShopIcon className="w-5 h-5" />
                                    {t("Покупка бизнеса")}
                                </Button>
                            </div>
                            <div></div>
                        </div>

                    </div>
                    {
                        isLoadingBusiness ? (
                            <div className="flex justify-center items-center py-7.5">
                                <div
                                    className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : ((() => {
                            const businessCards = Object.values(businessOffers?.business || {});

                            if (businessCards.length === 0) {
                                return (
                                    <EmptyMessage
                                        title={t("Здесь еще нет объявлений")}
                                        subtitle={t("Ваше может стать первым!")}
                                        hideButton
                                    />
                                );
                            }

                            return (
                                <HomeCardSection
                                    key={businessType}
                                    title="Бизнес"
                                    allViewLink="/business"
                                    cards={businessCards}
                                    initialFavorites={favoriteIds}
                                    onFavoritesChanged={handleFavoritesChanged}
                                    maxVisible={8}
                                    Class="grid grid-cols-1 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-2 gap-y-10 gap-x-2 transition duration-300 ease-in-out"
                                    ClassName="container mx-auto py-7.5"
                                />
                            );
                        })())
                    }
                </section >
                <section className="mt-12.5 mb-8.75 px-4 xl:px-20 lg:px-10 md:px-4 transition duration-500 ease-in-out container mx-auto">
                    <div className="flex justify-start">
                        <div className="flex justify-between items-center max-lg:flex max-lg:flex-col max-sm:justify-center w-full mb-6">
                            <div>
                                <Button onClick={() => {
                                    navigate(`$/{lang}/franchise`)
                                }} className={""}>
                                    <Heading level={2} text={t("Франшиза")} className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                                </Button>
                            </div>
                            <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150 %] font-semibold
                        ${franchiseType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                        : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                    } `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Продажа франшизы")}
                                </Button>
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "buy" }))} className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${franchiseType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"} `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Покупка франшизы")}
                                </Button>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    {isLoadingFranchise ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div
                                className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        ((() => {
                            const franchiseCards = Object.values(franchiseOffers?.franchise || {});

                            if (franchiseCards.length === 0) {
                                return (
                                    <EmptyMessage
                                        title={t("Здесь еще нет объявлений")}
                                        subtitle={t("Ваше может стать первым!")}
                                        hideButton
                                    />
                                );
                            }

                            return (
                                <HomeCardSection
                                    key={franchiseType}
                                    title="Франшиза"
                                    cards={franchiseCards}
                                    allViewLink="/franchise"
                                    initialFavorites={favoriteIds}
                                    maxVisible={8}
                                    Class="grid grid-cols-1 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-2 gap-y-10 gap-x-8 transition duration-300 ease-in-out"
                                    ClassName="container mx-auto py-7.5"
                                />
                            );
                        })()))}


                </section>
                <section className="mt-12.5 mb-8.75 px-4 xl:px-20 lg:px-10 md:px-4 transition duration-500 ease-in-out container mx-auto">
                    <div className="flex justify-start">
                        <div className="flex justify-between items-center max-lg:flex max-lg:flex-col max-sm:justify-center w-full mb-6">
                            <div>
                                <Button onClick={() => {
                                    navigate(`/${lang}/startup`)
                                }} className={""}>
                                    <Heading level={2} text={t("Стартапы")} className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                                </Button>
                            </div>
                            <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${startupType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                        : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                    } `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Поиск инвестора")}
                                </Button>
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "buy" }))} className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${startupType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"} `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Поиск инвестпроекта")}
                                </Button>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    {isLoadingStartup ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div
                                className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) :
                        ((() => {
                            const startupCards = Object.values(startupOffers?.startup || {});

                            if (startupCards.length === 0) {
                                return (
                                    <EmptyMessage
                                        title={t("Здесь еще нет объявлений")}
                                        subtitle={t("Ваше может стать первым!")}
                                        hideButton
                                    />
                                );
                            }

                            return (
                                <HomeCardSection
                                    key={startupType}
                                    title="Стартапы"
                                    cards={startupCards}
                                    initialFavorites={favoriteIds}
                                    maxVisible={8}
                                    allViewLink="/startup"
                                    Class="grid grid-cols-1 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-2 gap-y-10 gap-x-4 md:gap-x-8 transition duration-300 ease-in-out"
                                    ClassName="container mx-auto py-7.5"
                                />
                            );
                        })())}

                </section>
                <section className="mt-12.5 mb-8.75 px-4 xl:px-20 lg:px-10 md:px-4 transition duration-500 ease-in-out container mx-auto">
                    <div className="flex justify-start">
                        <div className="flex justify-between items-center max-lg:flex max-lg:flex-col max-sm:justify-center w-full mb-6">
                            <div>
                                <Button onClick={() => {
                                    navigate(`/${lang}/investments`)
                                }} className={""}>
                                    <Heading level={2} text={t("Инвестиции")}
                                        className="font-openSans font-bold text-3xl hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 cursor-pointer" />
                                </Button>
                            </div>
                            <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Инвестиции: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${investmentType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                        : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                    } `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Поиск инвестора")}
                                </Button>
                                <Button onClick={() => setListingTypes(prev => ({ ...prev, Инвестиции: "buy" }))} className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${investmentType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"} `}>
                                    <ShopIcon className="w-5 h-5 hover:text-white" />
                                    {t("Поиск инвестпроекта")}
                                </Button>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    {isLoadingInvestment ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div
                                className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : ((() => {
                        const investmentsCards = Object.values(investmentOffers?.investments || {});

                        if (investmentsCards.length === 0) {
                            return (
                                <EmptyMessage
                                    title={t("Здесь еще нет объявлений")}
                                    subtitle={t("Ваше может стать первым!")}
                                    hideButton
                                />
                            );
                        }

                        return (<HomeCardSection
                            title="Инвестиции"
                            cards={investmentOffers?.investments || []} maxVisible={4}
                            initialFavorites={favoriteIds}
                            allViewLink="/investments"
                            Class="grid grid-cols-1 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-2 gap-y-10 gap-x-8 transition duration-300 ease-in-out" ClassName={"container mx-auto py-7.5"} />
                        );
                    })())}

                </section>
                {/* Города */}
                <section
                    className="relative min-h-152.5 w-screen overflow-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
                    <div className="min-h-[610px] bg-[url(./images/Streets.png)] bg-center-bottom bg-no-repeat bg-cover">
                        <div className="container mx-auto py-[70px] px-4 xl:px-20 lg:px-10 md:px-4">
                            <Heading
                                text={t("Города")}
                                level={2}
                                className="font-openSans font-bold text-3xl leading-[100%] mb-[25px]"
                            />
                            {/* КАТЕГОРИИ */}
                            <NavLinks
                                links={categories}
                                variant="tabs"
                                activeLabel={selectedCategory}
                                onClick={(label) => {
                                    if (categories.find((cat) => cat.label === label)) {
                                        setSelectedCategory(label as typeof selectedCategory);
                                    }
                                }}
                                className="flex flex-wrap md:flex-nowrap gap-4 text-[24px] text-start font-openSans mb-6.25 font-bold"
                                activeClassName="w-full px-6 py-4 bg-[#2EAA7B] text-white rounded-xl"
                                inactiveClassName="w-full px-6 py-4 bg-white font-openSans text-[#232323] border border-[#2EAA7B] rounded-xl hover:bg-[#31B683]/10"
                            />

                            {/* ГОРОДА */}
                            <div className="grid 2xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
                                {cityStats &&
                                    cityStats.map((city, idx) => (
                                        <div
                                            key={idx}
                                            className="w-full flex flex-col transition duration-300 ease-in-out bg-[#4f4f4f] text-white py-4 px-6 rounded-[12px] gap-0.5"
                                        >
                                            <span className="font-openSans font-bold text-2xl max-sm:text-[14px] leading-[150%]">
                                                {lang === "uz" ? city.name_uz : city.name_ru}
                                            </span>
                                            <span className="font-Urbanist font-bold text-[40px] max-sm:text-[28px] leading-[150%]">
                                                {city.offers_count.toLocaleString(lang === "uz" ? "uz-UZ" : "ru-RU")}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/*Почему Invest In*/}
                <section className="relative overflow-hidden w-full bg-[url('/images/Mask.png')] bg-repeat">
                    <div className="py-17.5 flex lg:flex-row justify-between flex-col mx-auto container px-4 xl:px-20 lg:px-10 md:px-4 overflow-hidden">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-6 max-w-2xl w-full">
                                <Heading
                                    level={1}
                                    className="text-[24px] md:text-[32px] font-bold leading-tight text-black" text={""}>
                                    {t("Почему")} <span className="text-[#31B683]">{t("Invest In")}</span> {t("— лучший инструмент для продажи бизнеса?")}
                                </Heading>

                                <Paragraph
                                    className=" mt-[12px] w-full text-[#232323] font-inter font-normal leading-[125%] text-[16px] md:text-3xl">
                                    {t("С Invest In благодаря поддержке на всех этапах сделки вы сможете продать свой бизнес на условиях, которые будут выгодны и удобны для вас. На нашем сайте уже:")}
                                </Paragraph>
                            </div>
                            {/*Цифры*/}
                            <div className="flex justify-start gap-5 mt-[58px]">
                                <div className="grid grid-cols-2 gap-[20px] md:max-w-2xl w-full">
                                    <div className="bg-white w-full font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                        <Paragraph className="font-inter text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                            {mainStats?.offers_count?.toLocaleString("ru-RU")}<span
                                                className="text-[#2EAA7B]">+</span>
                                        </Paragraph>
                                        <Paragraph className="font-inter text-2xl max-sm:text-[16px] leading-[100%] mt-2">{t("объявлений")}</Paragraph>
                                    </div>

                                    <div className="bg-white w-full font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                        <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                            {mainStats?.deals_count?.toLocaleString("ru-RU")}<span
                                                className="text-[#2EAA7B]">+</span>
                                        </Paragraph>
                                        <Paragraph className="font-inter text-2xl max-sm:text-[16px] leading-[100%] mt-2">{t("сделок")}</Paragraph>
                                    </div>
                                    <div
                                        className="bg-white font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                        <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                            {mainStats?.partners_count?.toLocaleString("ru-RU")}
                                        </Paragraph>
                                        <Paragraph className="font-inter text-2xl max-sm:text-[16px] leading-[100%] mt-2">{t("партнёров")}</Paragraph>
                                    </div>
                                    <div
                                        className="bg-white font-inter text-black flex flex-col items-center text-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                        <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                            <span className="text-[#2EAA7B]">$</span>{displayAmount}
                                        </Paragraph>
                                        <Paragraph className="font-inter text-2xl max-sm:text-[16px] leading-[100%] mt-2">{t("продано бизнесов")}</Paragraph>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <img src="/images/WhyInvestIn.png" alt="" className="w-full max-w-3xl" />
                        </div>
                    </div>
                </section>
                <Footer showSmallFooter={true} />
            </div >
        </>
    );
};
