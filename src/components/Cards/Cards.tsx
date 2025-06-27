import { ICards } from "./Interfaces";
import { useToggleFavoriteMutation } from "../../Store/api/Api";
import { useState } from "react";
import { Card } from "./Card";

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
    const [toggleFavoriteAPI] = useToggleFavoriteMutation();
    const [favoriteIds, setFavoriteIds] = useState<number[]>(
        forceAllFavorite
            ? cards.map((c) => c.id)
            : cards.filter((c) => c.is_favourite).map((c) => c.id)
    );
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
        </div>
    );
};
