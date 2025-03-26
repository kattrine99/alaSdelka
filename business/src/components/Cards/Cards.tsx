import { useState } from "react";
import { Heading, Paragraph } from "../index";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface ICard {
    id: number;
    image: string | null;
    price: string;
    title: string;
    address: string;
    area: string;
    popular: boolean;

    // кастомные классы
    wrapperClass?: string;
    iconClass?: string;
    headingClass?: string;
    textClass?: string;
}

interface ICards {
    cards: ICard[];
    containerClass?: string;
}

export const Cards: React.FC<ICards> = ({ cards, containerClass = "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }) => {
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
        );
    };

    return (
        <div className={containerClass}>
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={`relative p-6 rounded-lg shadow-md bg-white ${card.wrapperClass ?? ""}`}
                >
                    {/* Иконка избранного */}
                    <button
                        onClick={() => toggleFavorite(card.id)}
                        className="absolute top-3 right-3 text-red-500 bg-white rounded-full p-1 shadow-sm"
                    >
                        {favorites.includes(card.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <div className={`mb-4 ${card.iconClass ?? ""}`}>
                        <img src={card.image || ''} alt={`icon-${card.id}`} className="w-10 h-10" />
                    </div>

                    <Heading
                        text={card.title}
                        level={3}
                        className={`text-lg font-semibold mb-2 ${card.headingClass ?? ""}`}
                    />

                    <Paragraph className={`text-gray-600 ${card.textClass ?? ""}`}>
                        {card.price}
                    </Paragraph>
                    <Paragraph className={`text-gray-600 ${card.textClass ?? ""}`}>
                        {card.address}
                    </Paragraph>
                    <Paragraph className={`text-gray-600 ${card.textClass ?? ""}`}>
                        {card.area}
                    </Paragraph>
                </div>
            ))}
        </div>
    );
};
