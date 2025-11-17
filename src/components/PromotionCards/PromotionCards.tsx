import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Breadcrumbs,
    Button,
    EmptyMessage,
    Footer,
    Header,
    Paragraph,
    Pagination,
} from "..";
import { useGetMyOffersQuery } from "../../Store/api/Api";
import { profileNavigate } from "../../utils/categoryMap";
import FireIcon from "../../assets/fire.svg?react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { FaLocationDot } from "react-icons/fa6";
import GpsIcon from '../../assets/gps.svg?react'
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

export const PromotionCards = () => {
    const [page, setPage] = useState(1);
    const perPage = 6;
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetMyOffersQuery({ page: page, per_page: 1000, is_paid: true });
    const { lang, t } = useTranslation()
    const offers = (data?.data || []).filter(
        (offer) => offer.paid_offer?.is_active === true
    );
    const paginatedOffers = offers.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(offers.length / perPage); const currencyMode = useSelector((state: RootState) => state.currency.mode);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);
    const formatPrice = (price?: number | string, priceCurrency?: "UZS" | "USD") => {
        const numericPrice = typeof price === "string" ? parseFloat(price) : price;
        if (typeof numericPrice !== "number" || isNaN(numericPrice)) return "—";

        const offerCurrency = priceCurrency || "UZS";
        
        // Если валюта оффера совпадает с выбранной валютой отображения, показываем как есть
        if (offerCurrency === currencyMode) {
            if (currencyMode === "USD") {
                return `$ ${numericPrice.toLocaleString()}`;
            }
            return `${numericPrice.toLocaleString()} ${t("UZS")}`;
        }

        // Если валюты не совпадают, конвертируем
        if (currencyMode === "USD") {
            // Оффер в UZS, показываем в USD
            if (!currencyRate || isNaN(currencyRate)) return "$ —";
            return `$ ${Math.round(numericPrice / currencyRate).toLocaleString()}`;
        } else {
            // Оффер в USD, показываем в UZS
            if (!currencyRate || isNaN(currencyRate)) return `${t("UZS")} —`;
            return `${Math.round(numericPrice * currencyRate).toLocaleString()} ${t("UZS")}`;
        }
    };
    return (
        <div className="w-screen min-h-screen flex-col flex">
            <Header navLinksData={profileNavigate} />

            <div className="container px-4 xl:px-20 lg:px-10 md:px-4 mx-auto py-7.5 flex-1">
                <Breadcrumbs
                    links={[
                        { label: t("Мои объявления"), href: "/announcements" },
                        { label: t("Продвигаемые объявления") },
                    ]}
                />

                {isLoading ? (
                    <div className="h-[400px] flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500 text-lg">{t("Ошибка загрузки объявлений")}</div>
                ) : offers.length === 0 ? (
                    <EmptyMessage
                        title="Нет продвигаемых объявлений"
                        subtitle="Здесь будут отображаться все активные продвигаемые объявления"
                        hideButton
                    />
                ) : (
                    <div className="flex flex-col gap-6 mt-8" >
                        <div className="flex flex-col gap-10.5 w-full" >
                            {paginatedOffers.map((offer) => (
                                <div
                                    key={offer.id}
                                    className="bg-white border border-[#E0E0E0] rounded-xl p-6 flex max-md:flex-col gap-6"
                                >
                                    {/* Фото */}
                                    <div className="relative col-span-1 w-100  max-md:w-full">
                                        <img
                                            src={offer.photos[0]?.photo ?? "/images/business_abstract.jpg"}
                                            alt="cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Информация */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Paragraph className="text-[#232323] text-2xl font-inter font-bold mb-2">
                                                {formatPrice(offer.price, offer.price_currency)}
                                            </Paragraph>
                                            <Paragraph className="text-[#232323] text-lg font-bold font-inter mb-3">
                                                {offer.title}
                                            </Paragraph>
                                            <div className="flex gap-1.5 mb-1">
                                                <FaLocationDot className="text-[#2EAA7B] w-4 h-4 mt-[2px]" />
                                                <Paragraph className="font-inter font-medium text-sm">
                                                    {offer?.address?.address ?? t("Адрес не указан")}, {lang === "uz" ? offer?.address?.city?.name_uz : offer?.address?.city?.name_ru ?? ""}
                                                </Paragraph>
                                            </div>
                                            <div className="flex gap-1.5 items-center">
                                                <GpsIcon className="w-4 h-4" />
                                                <Paragraph className="font-inter font-medium text-sm">
                                                    {offer.area} кв. м.
                                                </Paragraph>
                                            </div>
                                        </div>

                                        {/* Кнопки: В одну линию */}
                                        <div className="flex flex-col gap-4 mt-4">
                                            <Button
                                                className="text-[#2EAA7B] sm:w-2/3 md:w-3/4 lg:w-2/3 w-full border border-[#2EAA7B] px-5 h-11 rounded-md"
                                                onClick={() => navigate(`/${lang}/statistics/${offer.slug}`)}
                                            >
                                                Посмотреть статистику
                                            </Button>
                                            <div className="bg-[#FF1D1D] sm:w-2/3 md:w-3/4 lg:w-2/3 w-full text-white px-5 py-1 rounded-md flex justify-center items-center gap-2 font-semibold">
                                                Идёт продвижение (осталось {offer.paid_offer?.promotion_days_left} дней)
                                                <FireIcon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
            </div>

            <Footer showSmallFooter={true} />
        </div >
    );
};
