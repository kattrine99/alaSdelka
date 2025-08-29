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
import { useGetCategorySeoQuery, useGetCitySeoQuery, useGetOffersQuery } from "../../Store/api/Api";
import { typeToTitleMap, urlToTypeMap } from "../../utils/categoryMap";
import { FiSearch } from "react-icons/fi";
import { FiltersState, ruToEnOfferTypeMap } from "../../utils/variables";
import { CategorySeo, CitySeo, OfferFilters } from "../../Store/api/types";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { MetaTags } from "../../components/MetaTags";
import { SearchResultsSchema, StaticPageSchema } from "../../components/SchemaMarkup";

function cleanObject<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== "" && value !== undefined)
    ) as Partial<T>;
}

interface CategoryPageProps {
    section?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({section}) => {
    const { category, city, lng } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { lang, t } = useTranslation() as { lang: 'ru' | 'uz', t: (key: string) => string };
    const siteSettings = useSelector((state: RootState) => state.siteSettings.settings);
    const categoryKey = section?.toLowerCase() ?? "";
    const type = useMemo(() => urlToTypeMap[categoryKey] ?? "", [categoryKey]) || 'business';

    let pageTitle = typeToTitleMap[type as ICard["offer_type"]]?.[lang] ?? "Категория";
    const offerTypeFromURL = searchParams.get("offer_type") ?? "business";
    const allowedOfferTypes = ["", "business", "franchise", "startup", "investments"] as const;
    type OfferType = typeof allowedOfferTypes[number];

    const isValidOfferType = (value: string): value is OfferType =>
        allowedOfferTypes.includes(value as OfferType);

    const validOfferType: OfferType = isValidOfferType(offerTypeFromURL)
        ? offerTypeFromURL
        : "";

    const [localFilters, setLocalFilters] = useState<FiltersState>({
        categorySlug: category || searchParams.get("categorySlug") || "",
        city: city || searchParams.get("city") || "",
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
        categorySlug: category || searchParams.get("categorySlug") || "",
        city: city || searchParams.get("city") || "",
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

    const selectedCurrency = useSelector((state: RootState) => state.currency.mode);

    let convertedPriceFrom = Number(appliedFilters.priceMin);
    let convertedPriceTo = Number(appliedFilters.priceMax);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);

    if (selectedCurrency === "USD" && currencyRate != null && !isNaN(currencyRate)) {
        convertedPriceFrom = Math.round(convertedPriceFrom * currencyRate);
        convertedPriceTo = Math.round(convertedPriceTo * currencyRate);
    }

    const queryParams: OfferFilters = {
        page: currentPage,
        per_page: itemsPerPage,
        offer_type: ruToEnOfferTypeMap[categoryKey],
        ...cleanObject({
            city_slug: appliedFilters.city,
            category_id: appliedFilters.category_id,
            category_slug: appliedFilters.categorySlug,
            stage: appliedFilters.stage,
            payback_period: appliedFilters.paybackPeriod,
            price_min: convertedPriceFrom == 0 ? undefined : convertedPriceFrom.toString(),
            price_max: convertedPriceTo == 0 ? undefined : convertedPriceTo.toString(),
            investment_min: appliedFilters.investmentMin,
            investment_max: appliedFilters.investmentMax,
            profitability_min: appliedFilters.profitabilityMin,
            profitability_max: appliedFilters.profitabilityMax,
            ...(searchQuery && (isNumber ? { id: searchQuery } : { title: searchQuery })),
        }),
    };

    const { data, isLoading, isError } = useGetOffersQuery(queryParams)
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
            category_id: numericCategoryId,
            categorySlug: category || searchParams.get("categorySlug") || "",
            city: city || searchParams.get("city") || "",
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
        navigate(`/${lang}/${categoryKey}?${query.toString()}`);
    }

    let categorySeo: CategorySeo | null = null;
    let citySeo: CitySeo | null = null;

    if (section == null && category != null) {
       const {data} = useGetCategorySeoQuery(category);
       if (data) {
        categorySeo = data;
       }
    }
    if (section == null && city != null) {
        const {data} = useGetCitySeoQuery(city);
        if (data) {
            citySeo = data;
        }
    }

    return (
        <>
            {(siteSettings != null) && (
                <>
                    {(section != null) && (
                        <>
                            {(section == 'business') && (
                                <>
                                    <MetaTags title={siteSettings.seo.business.title} description={siteSettings.seo.business.description} keywords={siteSettings.seo.business.keywords} />
                                    <StaticPageSchema pageType="business" title={siteSettings.seo.business.title} description={siteSettings.seo.business.description} locale={lang} />
                                </>
                            )}
                            {(section == 'franchise') && (
                                <>
                                    <MetaTags title={siteSettings.seo.franchise.title} description={siteSettings.seo.franchise.description} keywords={siteSettings.seo.franchise.keywords} />
                                    <StaticPageSchema pageType="franchise" title={siteSettings.seo.franchise.title} description={siteSettings.seo.franchise.description} locale={lang} />
                                </>
                            )}
                            {(section == 'investments') && (
                                <>
                                    <MetaTags title={siteSettings.seo.investments.title} description={siteSettings.seo.investments.description} keywords={siteSettings.seo.investments.keywords} />
                                    <StaticPageSchema pageType="investments" title={siteSettings.seo.investments.title} description={siteSettings.seo.investments.description} locale={lang} />
                                </>
                            )}
                            {(section == 'startup') && (
                                <>
                                    <MetaTags title={siteSettings.seo.startups.title} description={siteSettings.seo.startups.description} keywords={siteSettings.seo.startups.keywords} />
                                    <StaticPageSchema pageType="startups" title={siteSettings.seo.startups.title} description={siteSettings.seo.startups.description} locale={lang} />
                                </>
                            )}
                        </>
                    )}
                    {(category != null && section == null && categorySeo != null) && (
                        <>
                            <MetaTags title={categorySeo.title} description={categorySeo.description} keywords={categorySeo.keywords} ogDescription={categorySeo.og_description} ogImage={categorySeo.og_image} canonical={categorySeo.canonical_url} noindex={!categorySeo.is_indexable}/>
                            <StaticPageSchema pageType={category} title={categorySeo.title} description={categorySeo.description} locale={lang} />
                        </>
                    )}
                    {(city != null && section == null && citySeo != null) && (
                        <>
                            <MetaTags title={citySeo.title} description={citySeo.description} keywords={citySeo.keywords} ogDescription={citySeo.og_description} ogImage={citySeo.og_image} canonical={citySeo.canonical_url} noindex={!citySeo.is_indexable}/>
                            <StaticPageSchema pageType={city} title={citySeo.title} description={citySeo.description} locale={lang} />
                        </>
                    )}
                    <SearchResultsSchema query={""} offers={cards} filters={{ offer_type: categoryKey }} resultsCount={cards.length} locale={lang} />
                </>
            )}
            <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
                <Header />
                <div className="grid grid-cols-3 container mx-auto px-3 xl:px-0 py-[30px] pb-10 gap-10 items-start">
                    <aside className="hidden lg:flex flex-col mr-[60px] col-span-1">
                        <Breadcrumbs category={typeToTitleMap[type]?.[lang] || ""} />
                        <Heading text={t(pageTitle)} level={2} className="text-[30px] font-bold text-black" />
                        <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
                            {cards.length.toLocaleString("ru-RU")} {t("объявлений")}
                        </Paragraph>

                        {type && (
                            <Filters
                                offer_type={categoryKey as "business" | "startup" | "franchise" | "investments" || "business"}
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
                                    {cards.length.toLocaleString("ru-RU")} {t("объявлений")}
                                </Paragraph>
                            </aside>
                            <div className="flex items-center">
                                {type && (
                                    <>
                                        <button onClick={() => setIsMobileFiltersOpen(true)} className="btn btn-primary px-5 py-3 bg-[#2EAA7B] text-white rounded-[6px] hover:bg-[#31B683] transition duration-300 lg:hidden">
                                            {t("Фильтры")}
                                        </button>
                                        {isMobileFiltersOpen && (
                                            <div className="mobile-filters-overlay">
                                                <div className="mobile-filters">
                                                    <button onClick={() => setIsMobileFiltersOpen(false)} className="close-btn">×</button>
                                                    <Filters
                                                        offer_type={categoryKey as "business" | "startup" | "franchise" | "investments" || "business"}
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
                                onClick={() => navigate(`/${lang}/add-offer`)}
                            >
                                {t("Добавить объявление")}
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
                                    placeholder={t("Поиск по названию или ID")}
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
                                    {t("Поиск")}
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
                                    <Paragraph className="text-[20px] font-semibold text-black mb-4">{t("Страница не найдена")}</Paragraph>
                                    <Button
                                        onClick={() => navigate(`/${lng}/`)}
                                        className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
                                    >
                                        {t("Перейти на главную")}
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
                                Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-x-2 transition duration-600"
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
                <PopularSliderSection />
                <Footer showSmallFooter={true} />
            </div >
        </>
    );
};
