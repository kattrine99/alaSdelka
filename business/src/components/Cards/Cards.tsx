import { useState } from "react";
import { Button, Heading, Paragraph } from "../index";
import { FaRegHeart, FaHeart, FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";

export interface ICard {
    type: "бизнес" | "франшиза" | "стартап" | "инвестиции";
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

export const Cards: React.FC<ICards> = ({
    cards,
    cardWrapperClass,
    cardIconClass,
    cardHeadingClass,
    cardTextClass,
    containerClass,
}) => {
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
        );
    };

    return (
        <div className={containerClass}>
            {cards
                .slice()
                .sort((a, b) => Number(b.popular) - Number(a.popular)) // популярные — первыми
                .map((card) => (
                    <div
                        key={card.id}
                        className={`relative rounded-lg shadow-lg bg-white ${cardWrapperClass ?? ""}`}
                    >
                        {card.popular && (
                            <div className="absolute right-3 w-[125px] text-center font-openSans translate-y-[-50%] bg-white border border-[#28B13D] text-[#28B13D] text-s px-4 py-1.5 rounded-md font-semibold z-10 shadow-sm">
                                Популярное
                            </div>
                        )}
                        <div className={`relative ${cardIconClass ?? ""}`}>

                            <img src={card.image || ""} alt={`${card.id}`} className="w-full h-auto object-cover" />
                            <button
                                onClick={() => toggleFavorite(card.id)}
                                className="absolute bottom-6 right-[18px] text-[#28B13D] bg-white rounded-full border p-3 shadow-sm"
                            >
                                {favorites.includes(card.id) ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        </div>

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
                                    className={`text-[18px] leading-[22px] font-bold font-inter mb-[12px] ${cardHeadingClass ?? ""}`}
                                />
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationDot className="text-[#28B13D] h-[16px]" />
                                    Адрес: <span className="font-bold">{card.address}</span>
                                </Paragraph>
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[18px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationCrosshairs className="text-[#28B13D] h-[16px]" />
                                    {card.area}
                                </Paragraph>
                            </div>

                            <Button className="w-full py-[12px] bg-[#28B13D] text-white font-medium rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition">
                                Просмотреть <FaArrowRight />
                            </Button>
                        </div>
                    </div>
                ))}
        </div>
    );
};
