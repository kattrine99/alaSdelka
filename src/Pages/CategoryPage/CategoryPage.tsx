import { useParams } from "react-router-dom";
import { useState } from "react";
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
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetOffersQuery } from "../../Store/api/Api";
import { typeToTitleMap, urlToApiOfferTypeMap, urlToTypeMap } from "../../utils/categoryMap";
import { FiSearch } from "react-icons/fi";
import { FiltersState } from "../../utils/variables";
import { OfferFilters } from "../../Store/api/types";

function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== "" && value !== undefined)
  ) as Partial<T>;
}

export const CategoryPage = () => {
  const { category } = useParams();

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
  });

  const type = urlToTypeMap[category ?? ""] ?? "";
  const apiOfferType = urlToApiOfferTypeMap[type] as OfferFilters["offer_type"];
  const pageTitle = typeToTitleMap[type as ICard["offer_type"]] ?? "Категория";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const queryParams: OfferFilters = {
    page: currentPage,
    per_page: itemsPerPage,
    offer_type: apiOfferType,
    ...cleanObject({
      category: filters.category,
      city_id: filters.city, // 👈 ПРАВИЛЬНО city_id
      stage: filters.stage,
      price_from: filters.priceMin,
      price_to: filters.priceMax,
      investment_from: filters.investmentMin,
      investment_to: filters.investmentMax,
      profitability_from: filters.profitabilityMin,
      profitability_to: filters.profitabilityMax,
    }),
  };

  const { data, isLoading, isError } = useGetOffersQuery(queryParams);
  const cards = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;

  return (
    <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
      <Header />
      <div className="flex px-48 py-[30px] pb-10 gap-10 items-start">
        <aside className="flex flex-col mr-[60px]">
          <Breadcrumbs category={type} />
          <Heading text={pageTitle} level={2} className="text-[30px] font-bold text-black" />
          <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
            {cards.length.toLocaleString("ru-RU")} объявлений
          </Paragraph>

          {type && (
            <Filters
              category={type as "бизнес" | "франшиза" | "стартап" | "инвестиции"}
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={() => setCurrentPage(1)} // сброс страницы при новом фильтре
            />
          )}
        </aside>

        <main className="flex-1 justify-end">
          <div className="flex justify-end gap-x-4">
            <Button className="px-5 py-3 bg-[#31B683] text-white rounded-[6px]">Добавить объявление</Button>
            <div className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 w-[450px] bg-white overflow-hidden">
              <div className="text-[#2EAA7B]">
                <FiSearch className="w-[24px] h-[24px]" />
              </div>
              <Input
                type="text"
                placeholder="Поиск по названию или ID"
                isError={false}
                className="flex-1 w-full px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
              />
              <Button className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-green-600 transition rounded-none">
                Поиск
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-[30px]">
              <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isError ? (
            <p className="px-48 py-[30px] text-red-500">Ошибка загрузки данных</p>
          ) : (
            <CardSection
              Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 transition duration-600"
              title={pageTitle}
              ClassName="py-[39px]"
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
      </div>
      <PopularSliderSection cards={cards} />
      <Footer showSmallFooter={true} />
    </div>
  );
};
