import { useState } from "react";
import { Button, Heading, Paragraph } from "../index";
import { FaRegHeart, FaHeart, FaArrowRight } from "react-icons/fa";

export interface ICard {
    id: number;
    image: string | null;
    price: string;
    title: string;
    address: string;
    area: string;
    popular: boolean;
}

interface ICards {
    cards: ICard[];
    containerClass?: string;
    cardWrapperClass?: string;
    cardIconClass?: string;
    cardHeadingClass?: string;
    cardTextClass?: string;
}

export const Cards: React.FC<ICards> = ({ cards, cardWrapperClass, cardIconClass, cardHeadingClass, cardTextClass, containerClass = "grid gap-6 sm:[grid-template-columns:repeat(auto-fit,minmax(360px,1fr))] " }) => {
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
                    className={`relative rounded-lg shadow-md bg-white ${cardWrapperClass ?? ""}`}
                >
                    <button
                        onClick={() => toggleFavorite(card.id)}
                        className="absolute top-3 right-3 text-[#28B13D] bg-white rounded-full border-1 p-3 shadow-sm"
                    >
                        {favorites.includes(card.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <div className={` ${cardIconClass ?? ""}`}>
                        <img src={card.image || ''} alt={`icon-${card.id}`} />
                    </div>

                    <div className="px-[18px] py-[21px] flex flex-col justify-between">
                        <div>
                            <Heading
                                text={card.title}
                                level={3}
                                className={`text-lg font-semibold mb-2 ${cardHeadingClass ?? ""}`}
                            />

                            <Paragraph className={`text-gray-600 ${cardTextClass ?? ""}`}>
                                {card.price}
                            </Paragraph>
                            <Paragraph className={`text-gray-600 ${cardTextClass ?? ""}`}>
                                Адрес: {card.address}
                            </Paragraph>
                            <Paragraph className={`text-gray-600 ${cardTextClass ?? ""}`}>
                                {card.area}
                            </Paragraph>
                        </div>
                        <Button className={" w-full h-10 bg-[#28B13D] text-white font-medium rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition"}>Просмотреть <FaArrowRight /></Button>
                    </div>
                </div>
            ))}
        </div>
    );
};
