import { Button, Heading, ModalBase, Paragraph } from "../index";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import FireIcon from '../../assets/fire.svg?react';
import GalleryIcon from '../../assets/gallery.svg?react';
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { offerTypeToUrlMap } from "../../utils/categoryMap";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { ICardComponent } from "./Interfaces";
import { useState } from "react";
import { translationService } from "../../utils/googleTranslate";

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
    WhatchButtonClass,
}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { lang, t } = useTranslation();
    const { lng } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [translaedTitle, setTranslatedTitle] = useState(card.title);
    const currencyMode = useSelector((state: RootState) => state.currency.mode);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);
    const handleToggle = async (id: number) => {
        handleFavorite(id)
    };
    const formatPrice = (price?: number | string) => {
        const numericPrice = typeof price === "string" ? parseFloat(price) : price;
        if (typeof numericPrice !== "number" || isNaN(numericPrice)) return "—";

        if (currencyMode === "USD") {
            if (!currencyRate || isNaN(currencyRate)) return "$ —";
            return `$ ${Math.round(numericPrice / currencyRate).toLocaleString()}`;
        }

        return `${numericPrice.toLocaleString()} ${t("сум")}`;
    };
    if (card) {
        translationService.translateText(card.title, lang).then(function (value) {
            if (value) {
                setTranslatedTitle(value);
            }
        });
    }
    return (
        <div key={card.id} className={`relative bg-white rounded-lg flex ${cardWrapperClass ?? ""}`}>
            {(card.is_paid || card.offer_status === "sold") && (
                <div className="absolute -top-5 left-5 z-10 flex gap-2">
                    {card.is_paid && card.offer_status !== "sold" && (
                        <div className="font-openSans bg-white border border-[#FD6A0D] text-[#FD6A0D] py-[5px] px-1.5 rounded-md font-semibold shadow-sm flex items-center gap-1">
                            <FireIcon className="w-5 h-5 text-[#FD6A0D]" />
                            <Paragraph>{t("Популярное")}</Paragraph>
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
            <div className={`relative ${cardIconClass ?? ""}`}>
                {card.photos && card.photos.length > 0 && card.photos[0].photo ? (
                    <img
                        src={card.photos[0].photo}
                        alt={`${card.id}`}
                        className="w-full object-contain"
                    />
                ) : (
                    <div className="w-full h-49 flex justify-center bg-[#F0F0F0]" >
                        <div className="flex flex-col justify-center items-center ">
                            <GalleryIcon />
                            <Paragraph>{t("Изображение отсутствует")}</Paragraph>
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
            </div>

            {/* КОНТЕНТ КАРТОЧКИ */}
            <div className="flex flex-col flex-1 justify-between px-[18px] py-[21px] ">
                <div className="flex flex-col">
                    <Heading
                        text={formatPrice(card.price)}
                        level={2}
                        className={`text-[16px] md:text-[24px] leading-[22px] font-bold font-inter text-[#232323] mb-[8px] ${cardHeadingClass ?? ""}`}
                    />
                    <Heading
                        text={translaedTitle}
                        level={3}
                        className={`text-[14px] md:text-[18px] leading-[22px] font-bold font-inter mb-[12px] ${cardHeadingClass ?? ""}`}
                    />
                    <Paragraph
                        className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}
                    >
                        <FaLocationDot className="text-[#2EAA7B] h-[16px]" />
                        <span className="font-bold text-[12px]">
                            {card.address?.address ?? t("Адрес не указан")}, {lang === "uz" ? card.address?.city?.name_uz : card.address?.city?.name_ru ?? ""}
                        </span>
                    </Paragraph>
                    <Paragraph
                        className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[18px] ${cardTextClass ?? ""}`}
                    >
                        <FaLocationCrosshairs className="text-[#2EAA7B] h-[16px]" />
                        {card.area} {t("кв. м.")}
                    </Paragraph>
                </div>

                <div className="w-full h-[44px] mt-auto">
                    <Link to={`/${lng}/${offerTypeToUrlMap[card.offer_type]}/card/${card.slug}`} className="w-full">
                        <Button className={WhatchButtonClass}>
                            <span className="flex gap-2 items-center">
                                {t("Просмотреть")} <FaArrowRight />
                            </span>
                        </Button>
                    </Link>
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
        </div>
    );
}