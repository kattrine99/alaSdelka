import { Applink, Button, Heading, ModalBase, Paragraph } from "../index";
import FireIcon from '../../assets/fire.svg?react';
import GalleryIcon from '../../assets/gallery.svg?react';
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { offerTypeToUrlMap } from "../../utils/categoryMap";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { ICardComponent } from "./Interfaces";
import { useRef, useState } from "react";
import { translationService } from "../../utils/googleTranslate";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // стили свайпера
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";

export const Card: React.FC<ICardComponent & { forceAllFavorite: boolean }> = ({
    is_favourite = false,
    forceAllFavorite = false,
    handleFavorite,
    handleConfirmRemove,
    card,
    cardWrapperClass,
    cardIconClass,
    cardHeadingClass,
    cardTextClass,
}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { lang, t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [translaedTitle, setTranslatedTitle] = useState(card.title);
    const currencyMode = useSelector((state: RootState) => state.currency.mode);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);
    const handleToggle = async (id: number) => {
        handleFavorite(id)
    };
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
    if (card) {
        translationService.translateText(card.title, lang).then(function (value) {
            if (value) {
                setTranslatedTitle(value);
            }
        });
    }
    const swiperRef = useRef(null);
    const handleMouseMove = (e) => {
        
        const swiper = swiperRef.current;
        
        if (!swiper || !swiper.slides || swiper.slides.length <= 1) return;

        const sliderElement = swiper.el;
        const rect = sliderElement.getBoundingClientRect();
        const sliderWidth = rect.width;
        const mouseX = e.clientX - rect.left;
        const slidesCount = swiper.slides.length;

        const slideWidth = sliderWidth / slidesCount;
        const slideIndex = Math.floor(mouseX / slideWidth);

        if (slideIndex !== swiper.activeIndex) {
            swiper.slideTo(slideIndex);
        }
    }
    return (
        <Applink to={`/${offerTypeToUrlMap[card.offer_type]}/card/${card.slug}`} key={card.id} className={`relative bg-white rounded-lg flex ${cardWrapperClass ?? ""}`}>
            {(card.is_paid || card.offer_status === "sold") && (
                <div className="absolute -top-5 left-5 z-10 flex gap-2">
                    {card.is_paid && card.offer_status !== "sold" && (
                        <div className="font-openSans bg-white border border-[#FD6A0D] text-[#FD6A0D] py-[5px] px-1.5 rounded-md font-semibold shadow-sm flex items-center gap-1">
                            <FireIcon className="w-5 h-5 text-[#FD6A0D]" />
                            <Paragraph>{t("ТОП")}</Paragraph>
                        </div>
                    )}
                    {card.offer_status === "sold" && (
                        <div className="font-openSans bg-white border border-[#301DFF] text-[#301DFF] py-1.25 px-1.5 rounded-md font-semibold shadow-sm flex items-center justify-center">
                            <Paragraph>{t("Продано")}</Paragraph>
                        </div>
                    )}
                </div>
            )}

            {/* ИЗОБРАЖЕНИЕ И СЕРДЕЧКО */}
            <div className={`relative group ${cardIconClass ?? ""}`}>
                {card.photos && card.photos.length > 0 ? (
                    <div onMouseMove={handleMouseMove} className="w-full max-h-[140px] rounded-md overflow-hidden">
                        <Swiper
                            modules={[Pagination]}
                            pagination={card.photos.length > 1 ? {
                                clickable: true,
                                bulletClass: "swiper-pagination-bullet custom-bullet",
                                bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
                            } : false}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            spaceBetween={0}
                            slidesPerView={1}
                        >
                            {card.photos.map((photo, idx) => (
                                <SwiperSlide key={idx}>
                                    <img
                                        src={photo.photo}
                                        alt={`${card.id}-${idx}`}
                                        className="w-full h-[140px] object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className="w-full h-[140px] flex justify-center bg-[#F0F0F0]">
                        <div className="flex flex-col justify-center items-center">
                            <GalleryIcon />
                        </div>
                    </div>
                )}

                {isAuthenticated && (
                    <FavoriteButton
                        isFavorite={is_favourite}
                        onToggle={() => {
                            if (is_favourite && forceAllFavorite) {
                                setShowModal(true);
                            } else {
                                handleToggle(card.id);
                            }
                        }}
                    />
                )}

                {/* контейнер для пагинации */}
                <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></div>
            </div>

            {/* КОНТЕНТ КАРТОЧКИ */}
            <div className="flex flex-col flex-1 justify-between px-[18px] py-[21px] ">
                <div className="flex flex-col">
                    <Heading
                        text={formatPrice(card.price, card.price_currency)}
                        level={2}
                        className={`text-[16px] leading-[22px] font-bold font-inter text-[#232323] mb-[8px] ${cardHeadingClass ?? ""}`}
                    />
                    <Heading
                        text={translaedTitle}
                        level={3}
                        className={`text-[14px] truncate line-clamp-2 leading-[22px] font-bold font-inter mb-[12px] ${cardHeadingClass ?? ""}`}
                    />
                    <Paragraph
                        className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}
                    >
                        <span className="font-bold text-[12px]">
                            {lang === "uz" ? card.address?.city?.name_uz : card.address?.city?.name_ru ?? ""}
                        </span>
                        <span className="text-neutral-400 truncate text-[12px]">{lang === 'uz' ? card.category?.title_uz : card.category?.title_ru}</span>
                    </Paragraph>
                </div>
            </div>
            {showModal && (
                <ModalBase
                    title={t("Удалить из избранного?")}
                    message={t("Вы действительно хотите исключить это объявление из избранного?")}
                    onClose={() => setShowModal(false)}
                    ModalClassName="max-w-100 p-8"
                    actions={<div className="flex flex-col gap-4 justify-end">
                        <Button onClick={() => {
                            handleConfirmRemove(card.id);
                            setShowModal(false);
                        }} className="w-full py-4 rounded-xl bg-red-500 text-white">{t("Удалить")}</Button>
                        <Button onClick={() => setShowModal(false)} className="w-full py-4 rounded-xl bg-[#2EAA7B] text-white">{t("Отмена")}</Button>
                    </div>} HeadingClassName={"font-inter font-semibold text-4xl leading-11"} />
            )}
        </Applink>
    );
}