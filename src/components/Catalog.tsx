import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Breadcrumbs,
  CardSection,
  Pagination,
  Heading,
  Button,
  Input,
  Paragraph,
  EmptyMessage,
} from ".";
import '../Pages/CategoryPage/CategoryPage.css';
import { ICard } from "./Cards/Interfaces";
import { useGetOffersQuery } from "../Store/api/Api";
import { typeToTitleMap, urlToTypeMap } from "../utils/categoryMap";
import { FiSearch } from "react-icons/fi";
import { FiltersState, ruToEnOfferTypeMap } from "../utils/variables";
import { OfferFilters } from "../Store/api/types";
import { useTranslation } from "../../public/Locales/context/TranslationContext";
import { SearchResultsSchema } from "./SchemaMarkup";

export interface CatalogFilter {
  section?: string;       // business, franchise, ...
  categorySlug?: string;  // it, medicine, ...
  citySlug?: string;      // tashkent, ...
  stage: string;
  paybackPeriod: string;
  priceMin: string;
  priceMax: string;
  investmentMin: string;
  investmentMax: string;
  profitabilityMin: string;
  profitabilityMax: string;
  listing_type?: "buy" | "sell" | "" | null;
  offer_type: "business" | "startup" | "franchise" | "investments" | "" | null;
}

interface CatalogProps {
  filter: FiltersState;
  onSearchInputChange: (value: string) => void;
}

function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== "" && value !== undefined)
  ) as Partial<T>;
}

export const Catalog: React.FC<CatalogProps> = ({ filter, onSearchInputChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const { lang, t } = useTranslation() as { lang: 'ru' | 'uz', t: (key: string) => string };

  const categoryKey = filter.offer_type?.toLowerCase() ?? "";
  const type = useMemo(() => urlToTypeMap[categoryKey] ?? "", [categoryKey]);

  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  // const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const queryParams: OfferFilters = {
    page: currentPage,
    per_page: itemsPerPage,
    offer_type: ruToEnOfferTypeMap[categoryKey] || "business",
    ...cleanObject({
      city_id: filter.city,
      category_id: filter.categorySlug,
      stage: filter.stage,
      payback_period: filter.paybackPeriod,
      price_from: filter.priceMin,
      price_to: filter.priceMax,
      investment_from: filter.investmentMin,
      investment_to: filter.investmentMax,
      profitability_from: filter.profitabilityMin,
      profitability_to: filter.profitabilityMax,
      ...(searchQuery && { search: searchQuery }),
    }),
  };
  const { data, isLoading, isError } = useGetOffersQuery(queryParams);
  const cards = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;

  const pageTitle = typeToTitleMap[type as ICard["offer_type"]]?.[lang] ?? "Категория";

  return (
    <>
      <SearchResultsSchema query={""} offers={cards} filters={{ offer_type: categoryKey }} resultsCount={cards.length} locale={lang} />
      <main className="flex-1 col-span-3 lg:col-span-2 justify-end">
        <div className="flex justify-between">
          <aside className="flex lg:hidden flex-col mr-[60px]">
            <Breadcrumbs category={type} />
            <Heading text={pageTitle} level={2} className="text-[30px] font-bold text-black" />
            <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
              {cards.length.toLocaleString("ru-RU")} {t("объявлений")}
            </Paragraph>
          </aside>
        </div>
        <div className="hidden lg:flex justify-end gap-x-4">
          <Button
            className="px-5 py-3 bg-[#2EAA7B] text-white rounded-[6px] hover:bg-[#31B683] transition duration-300"
            onClick={() => navigate('/add-offer')}
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
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearchInputChange(e.target.value);
              }}
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
                onClick={() => navigate("/")}
                className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
              >
                {t("Перейти на главную")}
              </Button>
            </div>
          </div>) : cards.length === 0 ? (
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
            cards={cards}
            hideViewAllButton
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </main>
    </>
  );
}