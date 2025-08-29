import { ICards } from "./Interfaces";
import { useToggleFavoriteMutation } from "../../Store/api/Api";
import { useState } from "react";
import { Card } from "./Card";
import { Applink } from "../AppLink/AppLink";
import { FaArrowRight } from "react-icons/fa6";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

export const HomeCards: React.FC<ICards & { forceAllFavorite?: boolean }> = ({
    cards,
    forceAllFavorite = false,
    cardWrapperClass,
    cardIconClass,
    cardHeadingClass,
    cardTextClass,
    containerClass,
    allViewLink,
    onFavoritesChanged,
    WhatchButtonClass,
}) => {
    const [toggleFavoriteAPI] = useToggleFavoriteMutation();
    const [favoriteIds, setFavoriteIds] = useState<number[]>(
        forceAllFavorite
            ? cards.map((c) => c.id)
            : cards.filter((c) => c.is_favourite).map((c) => c.id)
    );
    const { lang, t } = useTranslation();
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
    const handleConfirmRemove = (id: number | null) => {
        if (id !== null) {
            onFavoritesChanged?.(id, "removed");
        }
    };

    return (
        <div className={containerClass}>
            {cards.map((card) => {
                const isFavorite = forceAllFavorite || favoriteIds.includes(card.id);
                return (
                    <Card
                        card={card}
                        cardHeadingClass={cardHeadingClass}
                        cardIconClass={cardIconClass}
                        cardTextClass={cardTextClass}
                        is_favourite={isFavorite}
                        forceAllFavorite={forceAllFavorite}
                        cardWrapperClass={cardWrapperClass}
                        WhatchButtonClass={WhatchButtonClass}
                        handleFavorite={handleToggle}
                        handleConfirmRemove={handleConfirmRemove}
                    />

                );
            })}
            {allViewLink && (
                <div className="group h-full w-full">
                    <Applink to={allViewLink} className="flex h-full justify-center hover:text-white group-hover:bg-[#2EAA7B] transition items-center border border-[#2EAA7B] rounded-[8px]">
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-xl group-hover:text-white text-[#2EAA7B]">{t("Все")}</span>
                        </div>
                    </Applink>
                </div>

            )}
        </div>
    );
};
