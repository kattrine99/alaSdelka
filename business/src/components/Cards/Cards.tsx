import { useState } from "react";
import { Button, Heading, Paragraph } from "../index";
import { FaRegHeart, FaHeart, FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";


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
                    <div className={` ${cardIconClass ?? ""}`}>
                        <img src={card.image || ''} alt={`${card.id}`} />
                    </div>
                    <button
                        onClick={() => toggleFavorite(card.id)}
                        className="absolute top-[160px] right-[18px] text-[#28B13D] bg-white rounded-full border-1 p-3 shadow-sm"
                    >
                        {favorites.includes(card.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <div className="px-[18px] py-[21px] flex flex-col justify-between">
                        <div>
                            <Heading
                                text={card.price}
                                level={2}
                                className={`text-[24px] leading-[22px] font-bold font-inter text-[#28B13D] mb-[8px] ${cardHeadingClass ?? ""}`}
                            />
                            <Heading
                                text={card.title}
                                level={3}
                                className={`text-[18px] leading-[22px] font-bold font-inter  mb-[12px] ${cardHeadingClass ?? ""}`}
                            />
                            <Paragraph className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}>
                                <FaLocationDot className="text-[#28B13D] h-[16px]" />Адрес: <span className="font-bold">{card.address}</span>
                            </Paragraph>
                            <Paragraph className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[18px] ${cardTextClass ?? ""}`}>
                                <FaLocationCrosshairs className="text-[#28B13D] h-[16px]" />{card.area}
                            </Paragraph>
                        </div>
                        <Button className={" w-full py-[12px] bg-[#28B13D] text-white font-medium rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition"}>Просмотреть <FaArrowRight /></Button>
                    </div>
                </div>
            ))}
        </div>
    );
};
