import { useEffect, useState } from "react";
import { ModalBase, Button, Paragraph, Applink } from "../../../components";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { OfferDetail } from "../../../Store/api/types";
import { Link, useParams } from "react-router-dom";
import { useGetOfferContactViewQuery, useToggleFavoriteMutation } from "../../../Store/api/Api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { useTranslation } from "../../../../public/Locales/context/TranslationContext";

export const SellerInfoCard = ({ card, offer_type, userId }: { card: OfferDetail['data'], userId: number, offer_type?: string }) => {
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [isLinksModalOpen, setLinksModalOpen] = useState(false);
    const { data: contactData, isLoading: isContactLoading } = useGetOfferContactViewQuery(
        isContactModalOpen ? card.id : skipToken
    );
    const { t, lang } = useTranslation()
    const [isFavorite, setIsFavorite] = useState(card?.is_favourite ?? false);
    const [toggleFavoriteAPI] = useToggleFavoriteMutation();
    const { mode: currencyMode, rate } = useSelector((state: RootState) => state.currency);
    
    const formatPrice = (price?: number, priceCurrency?: "UZS" | "USD") => {
        if (typeof price !== 'number') return "—";
        
        const offerCurrency = priceCurrency || "UZS";
        
        // Если валюта оффера совпадает с выбранной валютой отображения, показываем как есть
        if (offerCurrency === currencyMode) {
            if (currencyMode === "USD") {
                return `${price.toLocaleString()} $`;
            }
            return `${price.toLocaleString()} ${t("UZS")}`;
        }
        
        // Если валюты не совпадают, конвертируем
        if (currencyMode === "USD") {
            // Оффер в UZS, показываем в USD
            const converted = Math.round(price / (rate || 1));
            return `${converted.toLocaleString()} $`;
        } else {
            // Оффер в USD, показываем в UZS
            const converted = Math.round(price * (rate || 1));
            return `${converted.toLocaleString()} ${t("UZS")}`;
        }
    };
    
    const convertedPrice = formatPrice(card.price, card.price_currency);

    const handleToggleFavorite = async () => {
        try {
            const res = await toggleFavoriteAPI({ id: card.id }).unwrap();

            if (res?.status === "added") {
                setIsFavorite(true);
            } else if (res?.status === "removed" || res?.status === "deleted") {
                setIsFavorite(false);
            }
        } catch (e) {
            console.error("Ошибка при переключении избранного:", e);
        }
    };
    useEffect(() => {
        setIsFavorite(card?.is_favourite ?? false);
    }, [card?.is_favourite]);

    return (
        <div className="xl:max-w-113 w-full p-4 rounded-md shadow-md shadow-[#2EAA7B2E] flex flex-col gap-4 relative">
            {card.offer_status !== 'sold' && (
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 p-1 border rounded-full border-green-500 text-green-500"
                >
                    {isFavorite ? (
                        <BiSolidHeart className="w-6 h-6" />
                    ) : (
                        <BiHeart className="w-6 h-6" />
                    )}
                </button>
            )}
            <Paragraph className="text-[22px] font-bold text-[#101828] text-left">
                {convertedPrice}
            </Paragraph>
            {card.offer_status !== 'sold' && (
                <div className="flex items-center bg-[#E9F7F1] rounded-md p-3 gap-3">
                    <Applink
                        to={`/users/${userId}/${offer_type}`}
                        state={{ category: offer_type }}
                        className="flex gap-5 items-center">
                        <div className="rounded-full">
                            <img
                                src={`${card.user_photo || "../../../../images/profile.png"}`}
                                className="w-12 h-12 rounded-full object-cover"
                                alt="User photo"
                            />
                        </div>
                        <Paragraph className="text-[#101828] font-semibold">
                            {card.user_name || "Имя продавца"}
                        </Paragraph>
                    </Applink>
                </div>
            )}

            {card.offer_status !== 'sold' && (
                <Button
                    className="w-full bg-[#2EAA7B] text-white font-semibold py-2 rounded-md hover:bg-[#31B683] transition"
                    onClick={() => setContactModalOpen(true)}
                >
                    {t("Контакты продавца")}
                </Button>
            )}
            <Button
                className="w-full bg-[#E9F7F1] text-[#2EAA7B] font-semibold py-2 rounded-md hover:bg-[#d1f0e3] transition"
                onClick={() => setLinksModalOpen(true)}
            >
                {t("Ссылки")}
            </Button>

            {isContactModalOpen && (
                <ModalBase
                    title={t("Контакты продавца")}
                    ModalClassName="w-100 p-9"
                    message={isContactLoading
                        ? t("Загрузка...")
                        : contactData?.phone || t("Номер не найден")}
                    onClose={() => setContactModalOpen(false)}
                    showCloseButton={true} HeadingClassName={"font-inter font-bold text-3xl"}
                />
            )}

            {isLinksModalOpen && (
                <ModalBase
                    title={t("Ссылки")}
                    ModalClassName="w-100 p-9"
                    message={card.communication_channels?.length ? (
                        <div className="flex flex-col gap-2">
                            {card.communication_channels.map((channel, idx) => (
                                <a
                                    key={idx}
                                    href={channel.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2EAA7B] underline"
                                >
                                    {channel.channel_name}
                                </a>
                            ))}
                        </div>
                    ) : (
                        t("Ссылки отсутствуют")
                    )}
                    onClose={() => setLinksModalOpen(false)}
                    showCloseButton={true} HeadingClassName={"font-inter font-bold text-3xl"}
                />
            )}
        </div>
    );
};
