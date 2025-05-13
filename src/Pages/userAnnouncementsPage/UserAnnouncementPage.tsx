import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
    Breadcrumbs,
    Header,
    Pagination,
    Footer,
    Heading,
    Button,
    Input,
    Paragraph,
    Filters,
    Cards,
    ModalBase,
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetUserOffersQuery } from "../../Store/api/Api";
import { FiltersState } from "../../utils/variables";
import { FiSearch } from "react-icons/fi";
import { urlToTypeMap, ruToApiOfferTypeMap } from "../../utils/categoryMap";

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

    const [isContactModalOpen, setContactModalOpen] = useState(false);
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
    const mappedCards: ICard[] = cards
        .filter((card) => card)
        .map((card) => ({
            id: card.id,
            title: card.title || "Название не указано",
            price: card.price ?? "Цена не указана",
            image: card.photos?.[0]?.photo || "/images/business_abstract.jpg",
            address: {
                address: card.address?.address || "Адрес не указан",
                city: {
                    name_ru: card.address?.city?.name_ru || "",
                },
            },
            area: card.area ? `${card.area} кв. м.` : "Площадь не указана",
            offer_type: card.offer_type,
            user_phone: card.user_phone || "",
        }));
    const totalPages = Math.ceil((data?.user_offers_count ?? 0) / itemsPerPage);
    const user = data?.user;

    return (

        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            {isContactModalOpen && (
                <ModalBase
                    title="Контакты продавца"
                    message={user?.phone || "Номер отсутствует"}
                    onClose={() => setContactModalOpen(false)}
                    showCloseButton={true}
                />
            )}
            <Header />
            <div className="flex px-48 py-[30px] pb-10 gap-10 items-start">
                <aside className="flex flex-col">
                    <Breadcrumbs category={category} title="Объявления пользователя" />
                    <Heading text="Объявления пользователя" level={2} className="text-[30px] font-bold text-black mt-4.5" />

                    {type && (
                        <Filters
                            offer_type={type as "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции"}
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
                        <div className="w-full border border-[#2EAA7B] rounded-2xl p-6 flex flex-col  items-start mt-16">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full">
                                    <img
                                        src={`${user.photo || "../../../../images/profile.png"}`}
                                        className="w-10 h-10"
                                        alt="User photo"
                                    />
                                </div>                                <div>
                                    <Paragraph className="font-bold text-[#101828] text-[16px]">{user.name}</Paragraph>
                                </div>
                            </div>
                            <div className="flex justify-between w-full ">
                                <div>
                                    <Paragraph className="text-[#6B7280] text-[13px] mt-1">
                                        Количество объявлений: {data?.user_offers_count}
                                    </Paragraph>
                                    <Paragraph className="text-[#6B7280] text-[13px]">
                                        На сайте с: {data?.user.created_at}
                                    </Paragraph>
                                </div>
                                <Button className="px-4 py-2 text-white bg-[#2EAA7B] rounded-md font-medium text-sm"
                                    onClick={() => setContactModalOpen(true)}>
                                    Посмотреть контакты
                                </Button>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-[30px]">
                            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isError ? (
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
                        </div>) : cards.length === 0 ? (
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
                        <Cards
                            cards={mappedCards}
                            containerClass="flex flex-col gap-7.5 rounded-xl w-317.75 mt-25"
                            cardWrapperClass="shadow-[1px_1px_4.5px_0px] shadow-[#28B13D4D]"
                            cardIconClass="w-85 h-58"
                            WhatchButtonClass="py-3 px-5 w-79.5 bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer"
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
