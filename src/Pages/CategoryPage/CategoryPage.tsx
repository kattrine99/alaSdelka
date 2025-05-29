import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    Breadcrumbs,
    CardSection,
    Header,
    Pagination,
    PopularSliderSection,
    Footer,
    Heading,
    Button,
    Input,
    Paragraph,
    Filters,
    EmptyMessage,
} from "../../components";
import './CategoryPage.css'
import { ICard } from "../../components/Cards/Interfaces";
import { useGetOffersQuery } from "../../Store/api/Api";
import { routeToCategoryIdMap, typeToTitleMap, urlToTypeMap } from "../../utils/categoryMap";
import { FiSearch } from "react-icons/fi";
import { FiltersState, ruToEnOfferTypeMap } from "../../utils/variables";
import { OfferFilters } from "../../Store/api/types";

function cleanObject<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== "" && value !== undefined)
    ) as Partial<T>;
}

export const CategoryPage = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const categoryKey = category?.toLowerCase() ?? "";
    const categoryId = routeToCategoryIdMap[categoryKey] || "";
    const type = useMemo(() => urlToTypeMap[categoryKey] ?? "", [categoryKey]);

    const pageTitle = typeToTitleMap[type as ICard["offer_type"]] ?? "Категория";
    const offerTypeFromURL = searchParams.get("offer_type") ?? "";
    const allowedOfferTypes = ["", "business", "franchise", "startup", "investments"] as const;
    type OfferType = typeof allowedOfferTypes[number];

    const isValidOfferType = (value: string): value is OfferType =>
        allowedOfferTypes.includes(value as OfferType);

    const validOfferType: OfferType = isValidOfferType(offerTypeFromURL)
        ? offerTypeFromURL
        : "";
    const [localFilters, setLocalFilters] = useState<FiltersState>({
        category: categoryId,
        city: searchParams.get("city") || "",
        stage: searchParams.get("stage") || "",
        paybackPeriod: searchParams.get("paybackPeriod") || "",
        priceMin: searchParams.get("priceMin") || "",
        priceMax: searchParams.get("priceMax") || "",
        investmentMin: searchParams.get("investmentMin") || "",
        investmentMax: searchParams.get("investmentMax") || "",
        profitabilityMin: searchParams.get("profitabilityMin") || "",
        profitabilityMax: searchParams.get("profitabilityMax") || "",
        listing_type: "",
        offer_type: validOfferType,
    });
    const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
        category: categoryId,
        city: searchParams.get("city") || "",
        stage: searchParams.get("stage") || "",
        paybackPeriod: searchParams.get("paybackPeriod") || "",
        priceMin: searchParams.get("priceMin") || "",
        priceMax: searchParams.get("priceMax") || "",
        investmentMin: searchParams.get("investmentMin") || "",
        investmentMax: searchParams.get("investmentMax") || "",
        profitabilityMin: searchParams.get("profitabilityMin") || "",
        profitabilityMax: searchParams.get("profitabilityMax") || "",
        listing_type: "",
        offer_type: validOfferType,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const itemsPerPage = 12;
    const isNumber = /^\d+$/.test(searchQuery);

    const queryParams: OfferFilters = {
        page: currentPage,
        per_page: itemsPerPage,
        offer_type: ruToEnOfferTypeMap[categoryKey] || "business",
        ...cleanObject({
            category: appliedFilters.category,
            city_id: appliedFilters.city,
            category_id: appliedFilters.category_id,
            stage: appliedFilters.stage,
            payback_period: appliedFilters.paybackPeriod,
            price_from: appliedFilters.priceMin,
            price_to: appliedFilters.priceMax,
            investment_from: appliedFilters.investmentMin,
            investment_to: appliedFilters.investmentMax,
            profitability_from: appliedFilters.profitabilityMin,
            profitability_to: appliedFilters.profitabilityMax,
            ...(searchQuery && (isNumber ? { id: searchQuery } : { title: searchQuery })),
        }),
    };

    const { data, isLoading, isError } = useGetOffersQuery(queryParams);
    const cards = data?.data || [];
    const totalPages = data?.meta?.last_page || 1;

    const exactCards = searchQuery
        ? cards.filter((card) =>
            isNumber ? String(card.id) === searchQuery : card.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : cards;
    useEffect(() => {
        setLocalFilters((prev) => ({
            ...prev,
            paybackPeriod: searchParams.get("paybackPeriod") || "",
        }));
    }, [searchParams]);
    useEffect(() => {
        const categoryIdFromURL = searchParams.get("category_id");
        const numericCategoryId = categoryIdFromURL ? Number(categoryIdFromURL) : undefined;

        const updated: FiltersState = {
            category: searchParams.get("category") || "",
            category_id: numericCategoryId,
            city: searchParams.get("city") || "",
            stage: searchParams.get("stage") || "",
            paybackPeriod: searchParams.get("paybackPeriod") || "",
            priceMin: searchParams.get("priceMin") || "",
            priceMax: searchParams.get("priceMax") || "",
            investmentMin: searchParams.get("investmentMin") || "",
            investmentMax: searchParams.get("investmentMax") || "",
            profitabilityMin: searchParams.get("profitabilityMin") || "",
            profitabilityMax: searchParams.get("profitabilityMax") || "",
            listing_type: "",
            offer_type: validOfferType,
        };

        setAppliedFilters(updated);
        setLocalFilters(updated);
        setSearchInput(searchParams.get("search") || "");
        setSearchQuery(searchParams.get("search") || "");
        setCurrentPage(1);
    }, [searchParams.toString()]);

    useEffect(() => {
        if (searchInput.trim() === "") {
            setSearchQuery("");
        }
    }, [searchInput]);

    function handleApplyFilters() {
        setAppliedFilters(localFilters);
        const query = new URLSearchParams();
        if (searchInput) query.append("search", searchInput);
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) query.append(key, String(value));
        });
        navigate(`/${categoryKey}?${query.toString()}`);
    }

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <div className="grid grid-cols-3 container mx-auto px-3 xl:px-0 py-[30px] pb-10 gap-10 items-start">
                <aside className="hidden lg:flex flex-col mr-[60px] col-span-1">
                    <Breadcrumbs category={type} />
                    <Heading text={pageTitle} level={2} className="text-[30px] font-bold text-black" />
                    <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
                        {cards.length.toLocaleString("ru-RU")} объявлений
                    </Paragraph>

                    {type && (
                        <Filters
                            offer_type={categoryKey as "business" | "startup" | "franchise" | "investments"}
                            filters={localFilters}
                            setFilters={setLocalFilters}
                            onApplyFilters={handleApplyFilters}
                        />
                    )}
                </aside>

                <main className="flex-1 col-span-3 lg:col-span-2 justify-end">
                    <div className="flex justify-between">
                        <aside className="flex lg:hidden flex-col mr-[60px]">
                            <Breadcrumbs category={type} />
                            <Heading text={pageTitle} level={2} className="text-[30px] font-bold text-black" />
                            <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
                                {cards.length.toLocaleString("ru-RU")} объявлений
                            </Paragraph>
                        </aside>
                        <div className="flex items-center">
                            {type && (
                                <>
                                    <button onClick={() => setIsMobileFiltersOpen(true)} className="btn btn-primary px-5 py-3 bg-[#2EAA7B] text-white rounded-[6px] hover:bg-[#31B683] transition duration-300 lg:hidden">
                                        Открыть фильтры
                                    </button>
                                    {isMobileFiltersOpen && (
                                        <div className="mobile-filters-overlay">
                                            <div className="mobile-filters">
                                                <button onClick={() => setIsMobileFiltersOpen(false)} className="close-btn">×</button>
                                                <Filters
                                                    offer_type={categoryKey as "business" | "startup" | "franchise" | "investments"}
                                                    filters={localFilters}
                                                    setFilters={setLocalFilters}
                                                    onApplyFilters={handleApplyFilters}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden lg:flex justify-end gap-x-4">
                        <Button
                            className="px-5 py-3 bg-[#2EAA7B] text-white rounded-[6px] hover:bg-[#31B683] transition duration-300"
                            onClick={() => navigate('/add-offer')}
                        >
                            Добавить объявление
                        </Button>
                        <div
                            className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 w-[450px] bg-white overflow-hidden">
                            <div className="text-[#2EAA7B]">
                                <FiSearch className="w-[24px] h-[24px]" />
                            </div>
                            <Input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Поиск по названию или ID"
                                isError={false}
                                className="flex-1 w-full px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
                            />
                            <Button
                                className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-[#31B683] transition duration-300 rounded-none"
                                onClick={() => {
                                    if (searchInput.trim() === "") {
                                        setSearchQuery("");
                                    } else {
                                        setSearchQuery(searchInput.trim());
                                    }
                                    setCurrentPage(1);
                                }}>
                                Поиск
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col w-full h-full justify-center items-center bg-[url('../../../images/grid.png')] bg-no-repeat  bg-contain">
                            <div className="w-128 h-100 bg-[url('../../../images/404.png')] bg-contain bg-center bg-no-repeat flex flex-col items-center justify-end">
                                <Paragraph className="text-[20px] font-semibold text-black mb-4">Страница не найдена</Paragraph>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
                                >
                                    Перейти на главную
                                </Button>
                            </div>
                        </div>) : exactCards.length === 0 ? (
                            <EmptyMessage
                                title="Здесь еще нет объявлений"
                                subtitle="Ваше может стать первым!"
                                hideButton
                            />
                        ) : (
                        <CardSection
                            Class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-10 gap-x-2 transition duration-600"
                            title={pageTitle}
                            ClassName="py-9.75"
                            cards={exactCards}
                            hideViewAllButton
                        />
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </main>
            </div >
            <PopularSliderSection cards={cards} />
            <Footer showSmallFooter={true} />
        </div >
    );
};
