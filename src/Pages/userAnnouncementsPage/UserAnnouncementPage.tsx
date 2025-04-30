import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
    Breadcrumbs,
    CardSection,
    Header,
    Pagination,
    Footer,
    Heading,
    Button,
    Input,
    Paragraph,
    Filters,
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetUserOffersQuery } from "../../Store/api/Api";
import { FiltersState } from "../../utils/variables";
import { FiSearch } from "react-icons/fi";
import { urlToTypeMap, typeToTitleMap, ruToApiOfferTypeMap } from "../../utils/categoryMap";

export const UserAnnouncementPage = () => {
    const { category, userId } = useParams();
    const navigate = useNavigate();

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
        listing_type: "",
        offer_type: "",
    });

    const type = urlToTypeMap[category ?? ""] ?? "бизнес";
    const pageTitle = typeToTitleMap[type as ICard["offer_type"]] ?? "Категория";

    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 12;

    const { data, isLoading, isError } = useGetUserOffersQuery({
        user_id: Number(userId),
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery,
        offer_type: filters.offer_type
            ? ruToApiOfferTypeMap[filters.offer_type as keyof typeof ruToApiOfferTypeMap]
            : undefined,
        listing_type: filters.listing_type || undefined,
        category_id: filters.category ? Number(filters.category) : undefined,
        city_id: filters.city ? Number(filters.city) : undefined,
        price_min: filters.priceMin ? Number(filters.priceMin) : undefined,
        price_max: filters.priceMax ? Number(filters.priceMax) : undefined,
    });

    const cards = data?.offers ?? [];
    const mappedCards: ICard[] = cards.map((card) => ({
        id: card.data.id,
        title: card.data.title || "Название не указано",
        price: card.data.price ? `${card.data.price.toLocaleString("ru-RU")} сум` : "Цена не указана",
        image: card.data.photos?.[0]?.photo || "/images/business_abstract.jpg",
        address: {
            address: card.data.address?.address || "Адрес не указан",
            city: {
                name_ru: card.data.address?.city?.name_ru || "",
            },
        },
        area: card.data.area ? `${card.data.area} кв. м.` : "Площадь не указана",
        offer_type: card.data.offer_type,
    }));
    const totalPages = Math.ceil((data?.user_offers_count ?? 0) / itemsPerPage);
    const user = data?.user;

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <div className="flex px-48 py-[30px] pb-10 gap-10 items-start">
                <aside className="flex flex-col m-auto">
                    <Breadcrumbs category={type} title="Объявления пользователя" />
                    <Heading text="Объявления пользователя" level={2} className="text-[30px] font-bold text-black mt-4.5" />

                    {type && (
                        <Filters
                            category={type as "бизнес" | "франшиза" | "стартап" | "инвестиции"}
                            filters={filters}
                            setFilters={setFilters}
                            onApplyFilters={() => setCurrentPage(1)}
                        />
                    )}
                </aside>

                <main className="flex-1 justify-end">
                    <div className="flex justify-end gap-x-4 mb-6">
                        <div className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 w-[450px] bg-white overflow-hidden">
                            <div className="text-[#2EAA7B]">
                                <FiSearch className="w-[24px] h-[24px]" />
                            </div>
                            <Input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Поиск по названию или ID"
                                isError={false}
                                className="flex-1 w-full py-3 px-5 text-[#787878] placeholder-[#787878] bg-white outline-none"
                            />
                            <Button
                                onClick={() => {
                                    setSearchQuery(searchInput);
                                    setCurrentPage(1);
                                }}
                                className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-green-600 transition rounded-none"
                            >
                                Поиск
                            </Button>
                        </div>
                    </div>

                    {/* Карточка пользователя */}
                    {user && (
                        <div className="w-full border border-[#2EAA7B] rounded-2xl p-6 flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-[40px] h-[40px] border border-[#2EAA7B] rounded-full"></div>
                                <div>
                                    <Paragraph className="font-bold text-[#101828] text-[16px]">{user.name}</Paragraph>
                                    <Paragraph className="text-[#6B7280] text-[13px] mt-1">
                                        Количество объявлений: {data?.user_offers_count}
                                    </Paragraph>
                                    <Paragraph className="text-[#6B7280] text-[13px]">
                                        На сайте с: 30.06.2024
                                    </Paragraph>
                                </div>
                            </div>
                            <Button className="px-4 py-2 text-white bg-[#2EAA7B] rounded-md font-medium text-sm">
                                Посмотреть контакты
                            </Button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isError ? (
                        <p className="px-48 py-[30px] text-red-500">Ошибка загрузки данных</p>
                    ) : cards.length === 0 ? (
                        <div className="flex flex-col w-full h-full justify-center items-center bg-[url('../../../images/grid.png')] bg-no-repeat bg-contain" >
                            <div className="w-128 h-100 bg-[url('../../../images/404.png')] bg-contain bg-center bg-no-repeat flex flex-col items-center justify-end">
                                <Paragraph className="text-[20px] font-semibold text-black mb-4">Страница не найдена</Paragraph>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
                                >
                                    Перейти на главную
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <CardSection
                            Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 transition duration-600"
                            title={pageTitle}
                            ClassName="py-9.75"
                            cards={mappedCards}
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
            <Footer showSmallFooter={true} />
        </div>
    );
};
