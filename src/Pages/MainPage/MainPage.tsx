import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar, categories, Button, Footer, EmptyMessage } from "../../components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopIcon from '../../assets/shop.svg?react';
import InvestInIcon from '../../assets/investin_v15.svg?react';
import { useGetFavoritesQuery, useGetHomeOffersQuery } from "../../Store/api/Api";
import { useGetMainStatisticsQuery } from "../../Store/api/Api";
import { FiltersState } from "../../utils/variables";
import { categoryRouteMap } from "../../utils/categoryMap";
import { Offer } from "../../Store/api/types";

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции">("Бизнес")
        ;
    const navigate = useNavigate();
    const [listingTypes, setListingTypes] = useState<Record<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции", "buy" | "sell">>({
        Бизнес: "buy",
        Франшиза: "buy",
        Стартапы: "buy",
        Инвестиции: "buy",
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
        : favoritesData?.data?.map((offer) => offer.id) ?? [];
    const handleFavoritesChanged = async (id: number, status: "added" | "removed") => {
        console.log(`Card ${id} was ${status === "added" ? "added to" : "removed from"} favorites.`);
        await refetch();
    };
    const [filters, setFilters] = useState<FiltersState>({
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
        offer_type: "",
    });

    const businessType = listingTypes["Бизнес"];
    const franchiseType = listingTypes["Франшиза"];
    const startupType = listingTypes["Стартапы"];
    const [searchInput, setSearchInput] = useState("");


    const {
        data: businessOffers,
        isLoading: isLoadingBusiness,
        isError: isErrorBusiness
    } = useGetHomeOffersQuery(listingTypes["Бизнес"]);
    const {
        data: franchiseOffers,
        isLoading: isLoadingFranchise,
        isError: isErrorFranchise
    } = useGetHomeOffersQuery(listingTypes["Франшиза"]);
    const {
        data: startupOffers,
        isLoading: isLoadingStartup,
        isError: isErrorStartup
    } = useGetHomeOffersQuery(listingTypes["Стартапы"]);
    const {
        data: investmentOffers,
        isLoading: isLoadingInvestment,
        isError: isErrorInvestment
    } = useGetHomeOffersQuery("");

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
        if (filters.category) query.append("category", filters.category);
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
        navigate(`/${categoryRoute}?${query.toString()}`);

    };


    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <section className="px-4 xl:px-20 max-xl:px-10 md:px-0 transition duration-500 ease-in-out relative overflow-hidden bg-gradient-to-tr from-[#16503A] to-[#31B683]">
                <div className="flex justify-end">
                    <div
                        className="absolute right-[-12rem] bottom-[-5rem] w-96 h-96 md:right-[-16rem] lg:right-[-80px] md:bottom-[-9rem] md:w-212.5 md:h-212.5 bg-[url('/images/Check.png')] bg-no-repeat bg-contain rotate-[12deg] pointer-events-none z-0"></div>
                </div>
                <div className="relative container mx-auto py-17.5">
                    {/* Текст */}
                    <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-3xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,60px)] font-bold leading-tight text-white"
                        />
                        <Paragraph
                            className="text-white text-[clamp(16px,1.5vw,18px)] max-w-3/5 md:w-full font-semibold leading-snug">
                            <span className="inline-flex items-baseline align-baseline relative top-2 mr-1">
                                <InvestInIcon className="w-[120px] md:w-[168.39px] h-auto" />
                            </span>
                            — первая в Узбекистане специализированная площадка для размещения объявлений
                            о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов.
                        </Paragraph>
                    </div>
                    {/* Поиск */}
                    <div className="mt-4 w-full flex-col relative hidden md:flex">
                        {/* Категории */}
                        <div className="max-w-142 bg-white rounded-t-xl border-b border-[#E0E0E0]">
                            <NavLinks
                                links={categories}
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
                        </div>

                        {/* Фильтр Поиск*/}
                        <FilterBar
                            filters={filters}
                            setFilters={setFilters}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            selectedCategory={selectedCategory}
                            onSearch={handleApplyFilters}
                        />
                    </div>
                </div>
            </section>

            {/* Карточки */}
            <section className="mt-12.5 mb-8.75 px-3 xl:px-20 max-xl:px-10 md:px-0 transition duration-500 ease-in-out container mx-auto">
                <div className="flex justify-start">
                    <div className="grid grid-cols-3 max-lg:flex max-lg:flex-col max-sm:justify-center items-start w-full mb-6">
                        <div >
                            <Button onClick={() => {
                                navigate("/business")
                            }} className={""}>
                                <Heading level={2} text="Бизнес" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                            </Button>
                        </div>
                        <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                            <Button
                                onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "buy" }))}
                                className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${businessType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"}`}
                            >
                                <ShopIcon className="w-5 h-5" />
                                Покупка бизнеса
                            </Button>

                            <Button onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "sell" }))}
                                className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${businessType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                        : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                    }`}>
                                <ShopIcon className="w-5 h-5 hover:text-white" />
                                Продажа бизнеса
                            </Button>
                        </div>
                    </div>

                </div>
                {
                    isLoadingBusiness ? (
                        <div className="flex justify-center items-center py-7.5">
                            <div
                                className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isErrorBusiness ? (
                        <p className=" py-7.5 text-red-500">Ошибка загрузки данных</p>
                    ) :
                        ((() => {
                            const businessCards = Object.values(businessOffers?.business || {});

                            if (businessCards.length === 0) {
                                return (
                                    <EmptyMessage
                                        title="Здесь еще нет объявлений"
                                        subtitle="Ваше может стать первым!"
                                        hideButton
                                    />
                                );
                            }

                            return (
                                <CardSection
                                    key={businessType}
                                    title="Бизнес"
                                    cards={businessCards}
                                    initialFavorites={favoriteIds}
                                    onFavoritesChanged={handleFavoritesChanged}
                                    maxVisible={8}
                                    Class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-y-10 gap-x-2 transition duration-300 ease-in-out"
                                    ClassName="container mx-auto py-7.5"
                                />
                            );
                        })())
                }
            </section >
            <section className="mt-12.5 mb-8.75 px-3 xl:px-20 max-xl:px-10 md:px-0 transition duration-500 ease-in-out container mx-auto">
                <div className="flex justify-start">
                    <div className="grid grid-cols-3 max-lg:flex max-lg:flex-col max-sm:justify-center items-start w-full mb-6">
                        <div>
                            <Button onClick={() => {
                                navigate("/franchise")
                            }} className={""}>
                                <Heading level={2} text="Франшиза" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                            </Button>
                        </div>
                        <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                            <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "buy" }))} className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${franchiseType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"}`}>
                                <ShopIcon className="w-5 h-5 hover:text-white" />
                                Покупка франшизы
                            </Button>

                            <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${franchiseType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                    : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                }`}>
                                <ShopIcon className="w-5 h-5 hover:text-white" />
                                Продажа франшизы
                            </Button>
                        </div>
                    </div>
                </div>
                {isLoadingFranchise ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div
                            className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorFranchise ? (
                    <p className="px-48 py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    (
                        ((() => {
                            const franchiseCards = Object.values(franchiseOffers?.franchise || {});

                            if (franchiseCards.length === 0) {
                                return (
                                    <EmptyMessage
                                        title="Здесь еще нет объявлений"
                                        subtitle="Ваше может стать первым!"
                                        hideButton
                                    />
                                );
                            }

                            return (
                                <CardSection
                                    key={franchiseType}
                                    title="Франшиза"
                                    cards={franchiseCards}
                                    initialFavorites={favoriteIds}
                                    maxVisible={8}
                                    Class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-y-10 gap-x-8 transition duration-300 ease-in-out"
                                    ClassName="container mx-auto py-7.5"
                                />
                            );
                        })()))}


            </section>
            <section className="mt-12.5 mb-8.75 px-3 xl:px-20 max-xl:px-10 md:px-0 transition duration-500 ease-in-out container mx-auto">
                <div className="flex justify-start">
                    <div className="grid grid-cols-3 max-lg:flex max-lg:flex-col max-sm:justify-center items-start w-full mb-6">
                        <div>
                            <Button onClick={() => {
                                navigate("/startups")
                            }} className={""}>
                                <Heading level={2} text="Стартапы" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                            </Button>
                        </div>
                        <div className="col-span-1 max-lg:mt-2 max-sm:flex-col max-lg:w-full flex justify-center gap-4">
                            <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "buy" }))} className={`flex items-center justify-center gap-2 border rounded-[8px] h-13 min-w-70 max-sm:w-full max-sm:mt-3 whitespace-nowrap px-6 text-[16px] font-inter font-semibold transition
  ${startupType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]" : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"}`}>
                                <ShopIcon className="w-5 h-5 hover:text-white" />
                                Покупка стартапа
                            </Button>

                            <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-13  min-w-70 max-sm:w-full whitespace-nowrap px-6 border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${startupType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                    : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                                }`}>
                                <ShopIcon className="w-5 h-5 hover:text-white" />
                                Продажа стартапа
                            </Button>
                        </div>
                    </div>
                </div>
                {isLoadingStartup ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div
                            className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorStartup ? (
                    <p className="px-48 py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    ((() => {
                        const startupCards = Object.values(startupOffers?.startup || {});

                        if (startupCards.length === 0) {
                            return (
                                <EmptyMessage
                                    title="Здесь еще нет объявлений"
                                    subtitle="Ваше может стать первым!"
                                    hideButton
                                />
                            );
                        }

                        return (
                            <CardSection
                                key={startupType}
                                title="Стартапы"
                                cards={startupCards}
                                initialFavorites={favoriteIds}
                                maxVisible={8}
                                Class="grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-y-10 gap-x-4 md:gap-x-8 transition duration-300 ease-in-out"
                                ClassName="container mx-auto py-7.5"
                            />
                        );
                    })())}

            </section>
            <section className="mt-12.5 mb-8.75 px-3 xl:px-20 max-xl:px-10 md:px-0 transition duration-500 ease-in-out container mx-auto">
                <div className="flex justify-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <Button onClick={() => {
                            navigate('/investments')
                        }} className={""}>
                            <Heading level={2} text="Инвестиции"
                                className="font-openSans font-bold text-3xl hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 cursor-pointer" />
                        </Button>
                    </div>
                </div>
                {isLoadingInvestment ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div
                            className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorInvestment ? (
                    <p className="px-48 py-7.5 text-red-500">Ошибка загрузки данных</p>
                ) :
                    (<CardSection
                        title="Инвестиции"
                        cards={investmentOffers?.investments || []} maxVisible={4}
                        initialFavorites={favoriteIds}
                        Class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-y-10 gap-x-8 transition duration-300 ease-in-out" ClassName={"container mx-auto py-7.5"} />
                    )}

            </section>
            {/* Города */}
            <section
                className="relative min-h-152.5 w-screen overflow-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
                <div className="min-h-[610px] bg-[url(./images/Streets.png)] bg-center-bottom bg-no-repeat bg-cover">
                    <div className="py-[70px] px-4 sm:px-8 md:px-[96px] xl:px-48">
                        <Heading
                            text={"Города"}
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
                            className="flex flex-wrap md:flex-nowrap gap-4 text-[24px] text-start font-openSans mb-[25px] font-bold"
                            activeClassName="w-full px-6 py-4 bg-[#2EAA7B] text-white rounded-xl"
                            inactiveClassName="w-full px-2 py-1 bg-white font-openSans text-[#232323] border border-[#2EAA7B] rounded-xl hover:bg-[#31B683]/10"
                        />

                        {/* ГОРОДА */}
                        <div className="grid 2xl:grid-cols-6 lg:grid-cols-4 grid-cols-2 gap-3">
                            {cityStats &&
                                cityStats.map((city, idx) => (
                                    <div key={idx}
                                        className="w-full flex flex-col bg-[#1A1A1A] text-white py-4 px-6 rounded-[12px] gap-0.5">
                                        <span
                                            className="font-openSans font-bold text-2xl leading-[150%]">{city.name_ru}</span>
                                        <span className="font-Urbanist font-bold text-[40px] leading-[150%]">
                                            {city.offers_count.toLocaleString("ru-RU")}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/*Почему Invest In*/}
            <section className="relative overflow-hidden w-full bg-[url('/images/Mask.png')] bg-repeat">
                <div className="absolute right-[197px] hidden 2xl:block top-[61px] w-175.5 h-full bg-[url('/images/WhyInvestIn.png')] bg-no-repeat bg-contain px-48" ></div>
                <div className="relative py-17.5 max-2xl:px-10 px-4 sm:px-8 md:px-[96px] xl:px-48 overflow-hidden">
                    <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            className="text-[24px] md:text-[32px] font-bold leading-tight text-black" text={""}>
                            Почему <span className="text-[#31B683]">Invest In — лучший инструмент </span>
                            для продажи бизнеса?
                        </Heading>

                        <Paragraph
                            className=" mt-[12px] w-full text-[#232323] font-inter font-normal leading-[125%] text-[16px] md:text-3xl">
                            С Invest In благодаря поддержке на всех этапах сделки вы сможете продать свой бизнес на
                            условиях, которые будут выгодны и удобны для вас. На нашем сайте уже:
                        </Paragraph>
                    </div>
                    <div className="2xl:hidden mt-6">
                        <img src="/images/WhyInvestIn.png" alt="" className="w-full max-w-3xl" />
                    </div>
                    {/*Цифры*/}
                    <div className="flex justify-start gap-5 mt-[58px]">
                        <div className="grid grid-cols-2 gap-[20px] md:max-w-2xl w-full">
                            <div className="bg-white w-full font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                    {mainStats?.offers_count?.toLocaleString("ru-RU")}<span
                                        className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="text-2xl mt-2">объявлений</Paragraph>
                            </div>

                            <div className="bg-white w-full font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                    {mainStats?.deals_count?.toLocaleString("ru-RU")}<span
                                        className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="text-2xl mt-2">сделок</Paragraph>
                            </div>
                            <div
                                className="bg-white font-inter text-black flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                    {mainStats?.partners_count?.toLocaleString("ru-RU")}
                                </Paragraph>
                                <Paragraph className="text-2xl mt-2">партнёров</Paragraph>
                            </div>
                            <div
                                className="bg-white font-inter text-black flex flex-col items-center text-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] max-sm:text-3xl text-center font-bold leading-none transition duration-300">
                                    {mainStats?.total_sold_amount
                                        ? `${(+mainStats.total_sold_amount / 1000000).toFixed(0)} млн `
                                        : "—"}<span className="text-[#2EAA7B]">$</span>
                                </Paragraph>
                                <Paragraph className=" text-2xl mt-2">продано бизнесов</Paragraph>
                            </div>
                        </div>
                    </div>


                </div>
            </section>
            <Footer showSmallFooter={true} />
        </div >
    );
};
