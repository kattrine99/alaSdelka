import { Button, Heading, ModalBase, Paragraph } from "../index";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import FireIcon from '../../assets/fire.svg?react';
import { Link } from "react-router-dom";
import { ICards } from "./Interfaces";
import { offerTypeToUrlMap } from "../../utils/categoryMap";
import { useToggleFavoriteMutation } from "../../Store/api/Api";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { FavoriteButton } from "./FavoriteButton";
import { useState } from "react";

export const Cards: React.FC<ICards & { forceAllFavorite?: boolean }> = ({
    cards,
    forceAllFavorite = false,
    cardWrapperClass,
    cardIconClass,
    cardHeadingClass,
    cardTextClass,
    containerClass,
    onFavoritesChanged,
    WhatchButtonClass,
}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [toggleFavoriteAPI] = useToggleFavoriteMutation();
    const [showModal, setShowModal] = useState(false);
    const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<number[]>(
        forceAllFavorite
            ? cards.map((c) => c.id)
            : cards.filter((c) => c.is_favourite).map((c) => c.id)
    );
    const currencyMode = useSelector((state: RootState) => state.currency.mode);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);

    const handleToggle = async (id: number) => {
        const isAlreadyFavorite = favoriteIds.includes(id);
        setFavoriteIds((prev) =>
            isAlreadyFavorite ? prev.filter((favId) => favId !== id) : [...prev, id]
        );

        try {
            const res = await toggleFavoriteAPI({ id }).unwrap();

            setFavoriteIds((prev) =>
                res.status === "added"
                    ? [...new Set([...prev, id])]
                    : prev.filter((favId) => favId !== id)
            );

            onFavoritesChanged?.(id, res.status as "added" | "removed");
        } catch (e) {
            console.error("Ошибка при добавлении/удалении избранного", e);

            setFavoriteIds((prev) =>
                isAlreadyFavorite ? [...prev, id] : prev.filter((favId) => favId !== id)
            );
        }
    };
    const handleConfirmRemove = () => {
        if (pendingRemoveId !== null) {
            onFavoritesChanged?.(pendingRemoveId, "removed");
        }
        setShowModal(false);
        setPendingRemoveId(null);
    };
    const formatPrice = (price?: number | string) => {
        const numericPrice = typeof price === "string" ? parseFloat(price) : price;
        if (typeof numericPrice !== "number" || isNaN(numericPrice)) return "—";

        if (currencyMode === "USD") {
            if (!currencyRate || isNaN(currencyRate)) return "$ —";
            return `$ ${Math.round(numericPrice / currencyRate).toLocaleString()}`;
        }

        return `${numericPrice.toLocaleString()} сум`;
    };

    return (
        <div className={containerClass}>
            {cards.map((card) => {
                const isFavorite = forceAllFavorite || favoriteIds.includes(card.id);

                return (
                    <div key={card.id} className={`relative bg-white rounded-lg flex ${cardWrapperClass ?? ""}`}>
                        {/* СТАТУСЫ */}
                        {card.is_paid === true && (
                            <div className="absolute w-[125px] left-5 font-openSans translate-y-[-50%] bg-white border border-[#FD6A0D] text-[#FD6A0D] py-[5px] px-1.5 rounded-md font-semibold z-10 shadow-sm flex">
                                <FireIcon className="z-10 w-5 h-5 text-[#FD6A0D]" />
                                <Paragraph>Популярное</Paragraph>
                            </div>
                        )}
                        {card.offer_status === "sold" && (
                            <div className="absolute w-[125px] left-5 font-openSans translate-y-[-50%] bg-white border border-[#301DFF] text-[#301DFF] py-1.25 px-1.5 rounded-md font-semibold z-10 shadow-sm flex">
                                <Paragraph>Продано</Paragraph>
                            </div>
                        )}

                        {/* ИЗОБРАЖЕНИЕ И СЕРДЕЧКО */}
                        <div className={`relative ${cardIconClass ?? ""}`}>

                            <img
                                src={
                                    typeof card.image === "string"
                                        ? card.image
                                        : card.image instanceof File
                                            ? URL.createObjectURL(card.image)
                                            : "/images/business_abstract.jpg"
                                }
                                alt={`${card.id}`}
                                className="w-full object-cover"
                            />
                            {isAuthenticated && (
                                <FavoriteButton
                                    isFavorite={isFavorite}
                                    onToggle={() => {
                                        if (isFavorite && forceAllFavorite) {
                                            setPendingRemoveId(card.id);
                                            setShowModal(true);
                                        } else {
                                            handleToggle(card.id);
                                        }
                                    }}
                                />

                            )}
                        </div>

                        {/* КОНТЕНТ КАРТОЧКИ */}
                        <div className="px-[18px] py-[21px] flex flex-col flex-1">
                            <div className="flex flex-col">
                                <Heading
                                    text={formatPrice(card.price)}
                                    level={2}
                                    className={`text-[16px] md:text-[24px] leading-[22px] font-bold font-inter text-[#232323] mb-[8px] ${cardHeadingClass ?? ""}`}
                                />
                                <Heading
                                    text={card.title}
                                    level={3}
                                    className={`text-[14px] md:text-[18px] leading-[22px] font-bold font-inter mb-[12px] ${cardHeadingClass ?? ""}`}
                                />
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationDot className="text-[#2EAA7B] h-[16px]" />
                                    <span className="font-bold text-[12px]">
                                        {card.address?.address ?? "Адрес не указан"}, {card.address?.city?.name_ru ?? ""}
                                    </span>
                                </Paragraph>
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[18px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationCrosshairs className="text-[#2EAA7B] h-[16px]" />
                                    {card.area} кв.м
                                </Paragraph>
                            </div>

                            <div className="w-full h-[44px] mt-auto">
                                <Link to={`/${offerTypeToUrlMap[card.offer_type]}/card/${card.id}`} className="w-full">
                                    <Button className={WhatchButtonClass}>
                                        <span className="flex gap-2 items-center">
                                            Просмотреть <FaArrowRight />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                );
            })}
            {showModal && (
                <ModalBase
                    title="Удалить из избранного?"
                    message="Вы действительно хотите исключить это объявление из избранного?"
                    onClose={() => setShowModal(false)}
                    ModalClassName="max-w-100 p-8"
                    actions={<div className="flex flex-col gap-4 justify-end">
                        <Button onClick={handleConfirmRemove} className="w-full py-4 rounded-xl bg-red-500 text-white">Удалить</Button>
                        <Button onClick={() => setShowModal(false)} className="w-full py-4 rounded-xl bg-[#2EAA7B] text-white">Отмена</Button>
                    </div>} HeadingClassName={"font-inter font-semibold text-4xl leading-11"} />
            )}
        </div>
    );
};
