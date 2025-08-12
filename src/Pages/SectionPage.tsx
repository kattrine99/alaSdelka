import React, { useEffect, useMemo, useState } from "react";
import { Catalog } from "../components/Catalog";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { MetaTags } from "../components/MetaTags";
import { StaticPageSchema } from "../components/SchemaMarkup";
import { useTranslation } from "../../public/Locales/context/TranslationContext";
import { Breadcrumbs, Filters, Footer, Header, Heading, PopularSliderSection } from "../components";
import { typeToTitleMap, urlToTypeMap } from "../utils/categoryMap";
import { ICard } from "../components/Cards/Interfaces";
import { FiltersState } from "../utils/variables";
import { useNavigate, useSearchParams } from "react-router-dom";

type SectionType = "business" | "franchise" | "investments" | "startups";

interface SectionPageProps {
    section: SectionType;
}

const SectionPage: React.FC<SectionPageProps> = ({ section }) => {
    const siteSettings = useSelector((state: RootState) => state.siteSettings.settings);
    const { lang, t } = useTranslation() as { lang: 'ru' | 'uz', t: (key: string) => string };
    const categoryKey = section?.toLowerCase() ?? "";
    const navigate = useNavigate();
    const type = useMemo(() => urlToTypeMap[categoryKey] ?? "", [categoryKey]);
    const pageTitle = typeToTitleMap[type as ICard["offer_type"]]?.[lang] ?? "Категория";
    const [searchParams] = useSearchParams();
    const offerTypeFromURL = searchParams.get("offer_type") ?? "";
    const allowedOfferTypes = ["", "business", "franchise", "startup", "investments"] as const;
    type OfferType = typeof allowedOfferTypes[number];
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const isValidOfferType = (value: string): value is OfferType =>
        allowedOfferTypes.includes(value as OfferType);

    const validOfferType: OfferType = isValidOfferType(categoryKey)
        ? categoryKey
        : "";
    const [localFilters, setLocalFilters] = useState<FiltersState>({
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

    useEffect(() => {
        setAppliedFilters({
            city: localFilters.city,
            stage: localFilters.stage,
            paybackPeriod: localFilters.paybackPeriod,
            priceMin: localFilters.priceMin,
            priceMax: localFilters.priceMax,
            investmentMin: localFilters.investmentMin,
            investmentMax: localFilters.investmentMax,
            profitabilityMin: localFilters.profitabilityMin,
            profitabilityMax: localFilters.profitabilityMax,
            listing_type: localFilters.listing_type,
            offer_type: section as FiltersState["offer_type"],
        });
    }, [section])

    function handleApplyFilters() {
        setAppliedFilters(localFilters);
        const query = new URLSearchParams();
        if (searchInput) query.append("search", searchInput);
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) query.append(key, String(value));
        });
        navigate(`/${section}?${query.toString()}`);
    }
    return (
        <>
            {(siteSettings != null) && (
                <>
                    {(section == 'business') && (
                        <MetaTags title={siteSettings.seo.business.title} description={siteSettings.seo.business.description} keywords={siteSettings.seo.business.keywords} />
                    )}
                    {(section == 'franchise') && (
                        <MetaTags title={siteSettings.seo.franchise.title} description={siteSettings.seo.franchise.description} keywords={siteSettings.seo.franchise.keywords} />
                    )}
                    {(section == 'investments') && (
                        <MetaTags title={siteSettings.seo.investments.title} description={siteSettings.seo.investments.description} keywords={siteSettings.seo.investments.keywords} />
                    )}
                    {(section == 'startups') && (
                        <MetaTags title={siteSettings.seo.startups.title} description={siteSettings.seo.startups.description} keywords={siteSettings.seo.startups.keywords} />
                    )}
                    <StaticPageSchema pageType="business" title={siteSettings.seo.business.title} description={siteSettings.seo.business.description} locale={lang} />
                </>
            )}
            <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
                <Header />
                <div className="grid grid-cols-3 container mx-auto px-3 xl:px-0 py-[30px] pb-10 gap-10 items-start">
                    <aside className="hidden lg:flex flex-col mr-[60px] col-span-1">
                        <Breadcrumbs category={typeToTitleMap[type]?.[lang] || ""} />
                        <Heading text={t(pageTitle)} level={2} className="text-[30px] font-bold text-black" />
                        {/* <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
                            {cards.length.toLocaleString("ru-RU")} {t("объявлений")}
                        </Paragraph> */}

                        {type && (
                            <Filters
                                offer_type={categoryKey as "business" | "startup" | "franchise" | "investments"}
                                filters={localFilters}
                                setFilters={setLocalFilters}
                                onApplyFilters={handleApplyFilters}
                            />
                        )}
                    </aside>

                    <Catalog filter={appliedFilters} onSearchInputChange={setSearchInput} />
                </div >
                <PopularSliderSection />
                <Footer showSmallFooter={true} />
            </div>
        </>
    )
};

export default SectionPage;