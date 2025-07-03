import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useGetUserOffersQuery, useGetOfferContactViewQuery, useGetFavoritesQuery } from "../../Store/api/Api";

import { FiltersState } from "../../utils/variables";
import { FiSearch } from "react-icons/fi";
import { urlToTypeMap, ruToApiOfferTypeMap } from "../../utils/categoryMap";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

export const UserAnnouncementPage = () => {
    const { category, userId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
    const [contactPhone, setContactPhone] = useState<string | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const { data: favoritesData, refetch } = useGetFavoritesQuery({ page: 1, per_page: 1000 });
    const favoriteIds = favoritesData?.data?.map((offer: { id: number }) => offer.id) ?? [];


    const { data, isLoading, isError } = useGetUserOffersQuery({
        user_id: Number(userId),
        page: currentPage,
        per_page: 5,
        search: searchQuery,
        offer_type: filters.offer_type
            ? ruToApiOfferTypeMap[filters.offer_type as keyof typeof ruToApiOfferTypeMap]
            : undefined,
        listing_type: filters.listing_type || undefined,
        category_id: filters.category_id ? Number(filters.category_id) : undefined,
        city_id: filters.city ? Number(filters.city) : undefined,
        price_min: filters.priceMin ? Number(filters.priceMin) : undefined,
        price_max: filters.priceMax ? Number(filters.priceMax) : undefined,
    });

    const firstOfferId = data?.offers?.[0]?.id;
    const { data: contactData, isLoading: isLoadingPhone } = useGetOfferContactViewQuery(firstOfferId!, {
        skip: !isContactModalOpen || !firstOfferId,
    });


    useEffect(() => {
        if (contactData?.phone) setContactPhone(contactData.phone);
    }, [contactData]);
    const cards = data?.offers ?? [];
    const totalPages = Math.ceil((data?.user_offers_count ?? 0) / 12);
    const user = data?.user;

    const mappedCards: ICard[] = cards.map((card) => ({
        id: card.id,
        slug: card.slug,
        title: card.title || t("Название не указано"),
        price: card.price ?? t("Цена не указана"),
        photos: card.photos ?? [],
        address: {
            address: card.address?.address || t("Адрес не указан"),
            city: {
                name_ru: card.address?.city?.name_ru || "",
                name_uz: card.address?.city?.name_uz || "",
            },
        },
        area: card.area ? `${card.area} ${t("кв. м.")}` : t("Площадь не указана"),
        offer_type: card.offer_type,
        user_phone: card.user_phone || "",
        is_favourite: favoriteIds.includes(card.id),
    }));
    const handleFavoritesChanged = async (id: number, status: "added" | "removed") => {
        console.log(`Card ${id} was ${status}`);
        await refetch();
    };

    return (
        <div className="font-openSans min-h-screen flex flex-col w-screen overflow-x-hidden">
            {isContactModalOpen && (
                <ModalBase
                    title={t("Контакты продавца")}
                    ModalClassName='w-100 p-9'
                    message={isLoadingPhone
                        ? <span className="text-gray-400">{t("Загрузка...")}</span>
                        : contactPhone || t("Номер отсутствует")}
                    onClose={() => setContactModalOpen(false)}
                    showCloseButton={true}
                    HeadingClassName={""}
                />
            )}

            <Header />
            <div className="flex flex-1 container mx-auto px-3 md:px-0 max-xl:flex-col py-[30px] pb-10 gap-10 items-start">
                <aside className="flex flex-col">
                    <Breadcrumbs category={category} title={t("Объявления пользователя")} />
                    <Heading text={t("Объявления пользователя")} level={2} className="text-[30px] font-bold text-black mt-4.5" />
                    {type && (
                        <>
                            {/* Кнопка фильтров (только для mobile) */}
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden px-5 py-3 bg-[#2EAA7B] text-white rounded-[6px] hover:bg-[#31B683] transition duration-300 mb-4"
                            >
                                {t("Фильтры")}
                            </button>

                            {/* Фильтры для desktop */}
                            <div className="hidden lg:block">
                                <Filters
                                    offer_type={type as "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции"}
                                    filters={filters}
                                    setFilters={function(filters) {
                                        console.log('setFilters');
                                        setFilters(filters);
                                    }}
                                    onApplyFilters={function () { console.log('apply'), setCurrentPage(1)}}
                                />
                            </div>

                            {/* Мобильное модальное меню фильтров */}
                            {isMobileFiltersOpen && (
                                <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="text-xl font-bold mb-4"
                                    >
                                        ×
                                    </button>
                                    <Filters
                                        offer_type={type as "business" | "startup" | "franchise" | "investments" | "бизнес" | "франшиза" | "стартапы" | "инвстиции"}
                                        filters={filters}
                                        setFilters={setFilters}
                                        onApplyFilters={() => {
                                            setIsMobileFiltersOpen(false);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </aside>

                <main className="flex-1 justify-end max-w-full">
                    <div className="flex justify-end gap-x-4 mb-6">
                        <div className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 bg-white lg:w-1/2 w-full overflow-hidden">
                            <div className="text-[#2EAA7B]">
                                <FiSearch className="w-full h-[24px]" />
                            </div>
                            <Input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={t("Поиск по названию или ID")}
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
                                {t("Поиск")}
                            </Button>
                        </div>
                    </div>

                    {/* Карточка пользователя */}
                    {user && (
                        <div className="border border-[#2EAA7B] rounded-2xl p-6 w-full flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full">
                                    <img
                                        src={`${user.photo || "../../../../images/profile.png"}`}
                                        className="w-14 h-14 rounded-full object-cover"
                                        alt="User photo"
                                    />
                                </div>
                                <div>
                                    <Paragraph className="font-bold text-[#101828] text-[16px]">{user.name}</Paragraph>
                                </div>
                            </div>
                            <div className="flex  max-sm:flex-col max-sm:gap-3 justify-between w-full ">
                                <div>
                                    <Paragraph className="text-[#6B7280] text-[13px] mt-1">
                                        {t("Количество объявлений:")} {data?.user_offers_count}
                                    </Paragraph>
                                    <Paragraph className="text-[#6B7280] text-[13px]">
                                        {t("На сайте с")}: {data?.user.created_at}
                                    </Paragraph>
                                </div>
                                <Button className="px-4 py-2 text-white bg-[#2EAA7B] rounded-md font-medium text-sm"
                                    onClick={() => setContactModalOpen(true)}>
                                    {t("Посмотреть контакты")}
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
                                <Paragraph className="text-[20px] font-semibold text-black mb-4">{t("Страница не найдена")}</Paragraph>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
                                >
                                    {t("Перейти на главную")}
                                </Button>
                            </div>
                        </div>) : cards.length === 0 ? (
                            <div className="flex flex-col w-full h-full justify-center items-center bg-[url('../../../images/grid.png')] bg-no-repeat bg-contain" >
                                <div className="w-full h-100 bg-[url('../../../images/404.png')] bg-contain bg-center bg-no-repeat flex flex-col items-center justify-end">
                                    <Paragraph className="text-[20px] font-semibold text-black mb-4">{t("Страница не найдена")}</Paragraph>
                                    <Button
                                        onClick={() => navigate("/")}
                                        className="bg-[#2EAA7B] text-white py-2.5 px-6 rounded-[12px] text-[16px] font-medium"
                                    >
                                        {t("Перейти на главную")}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                        <Cards
                            cards={mappedCards}
                            onFavoritesChanged={handleFavoritesChanged}
                            containerClass="grid mt-10 gap-y-10 gap-x-2 transition duration-600"
                            cardWrapperClass="shadow-[1px_1px_4.5px_0px] shadow-[#28B13D4D] flex-col lg:flex-row justify-center"
                            cardIconClass="w-full max-h-48 lg:h-full lg:max-w-85 overflow-hidden"
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


