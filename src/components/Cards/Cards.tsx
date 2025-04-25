import { useState } from "react";
import { Button, Heading, Paragraph } from "../index";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import FireIcon from '../../assets/fire.svg?react';
import HeartIcon from '../../assets/heart.svg?react';
import SolidHeartIcon from '../../assets/Solidheart.svg?react';
import { Link } from "react-router-dom";
import { ICards } from "./Interfaces";
import { offerTypeToUrlMap } from "../../utils/categoryMap";


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
                .sort((a, b) => Number(b.popular) - Number(a.popular))
                .map((card) => (
                    <div
                        key={card.id}
                        className={`relative rounded-lg shadow-lg bg-white flex flex-col h-full ${cardWrapperClass ?? ""}`}
                    >
                        {card.popular && (
                            <div className="absolute w-[125px] left-5 font-openSans translate-y-[-50%] bg-white border border-[#FD6A0D] text-[#FD6A0D] py-[5px] px-1.5 rounded-md font-semibold z-10 shadow-sm flex">
                                <FireIcon className="z-10 w-5 h-5 text-[#FD6A0D]" />
                                <Paragraph className="">
                                    Популярное
                                </Paragraph>
                            </div>
                        )}
                        <div className={`relative ${cardIconClass ?? ""}`}>

                            <img src={card.image || "../../../images/business_abstract.jpg"} alt={`${card.id}`} className="w-full h-[192px] object-cover" />
                            <button
                                onClick={() => toggleFavorite(card.id)}
                                className="absolute top-5 right-[18px] px-[7px] py-2 text-[#28B13D] bg-white rounded-full border-2 border-[#28B13D] shadow-sm"
                            >
                                {favorites.includes(card.id) ?
                                    <SolidHeartIcon className="w-8 h-7 border-1.5 border-[#FF1D1D] text-[#FF1D1D]" />
                                    :
                                    <HeartIcon className="w-8 h-7 text-center border-1.5" />
                                }
                            </button>
                        </div>

                        <div className="px-[18px] py-[21px] flex flex-col flex-1">
                            <div className=" flex flex-col">
                                <Heading
                                    text={card.price}
                                    level={2}
                                    className={`text-[24px] leading-[22px] font-bold font-inter text-[#232323] mb-[8px] ${cardHeadingClass ?? ""}`}
                                />
                                <Heading
                                    text={card.title}
                                    level={3}
                                    className={`text-[18px] leading-[22px] font-bold font-inter mb-[12px] ${cardHeadingClass ?? ""}`}
                                />
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[6px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationDot className="text-[#2EAA7B] h-[16px]" />
                                    Адрес: <span className="font-bold">  {card.address?.address ?? "Адрес не указан"}, {card.address?.city?.name_ru ?? ""}
                                    </span>
                                </Paragraph>
                                <Paragraph
                                    className={`text-gray-600 flex gap-x-2 font-inter text-[14px] font-medium mb-[18px] ${cardTextClass ?? ""}`}
                                >
                                    <FaLocationCrosshairs className="text-[#2EAA7B] h-[16px]" />
                                    {card.area}
                                </Paragraph>
                            </div>
                            <div className="w-full h-[44px] mt-auto">
                                <Link to={`/${offerTypeToUrlMap[card.offer_type]}/card/${card.id}`} className="w-full">
                                    <Button className="w-full py-[12px] bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer">
                                        <span className="flex gap-2 items-center">
                                            Просмотреть <FaArrowRight />
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                        </div>
                    </div>
                ))}
        </div>
    );
};
