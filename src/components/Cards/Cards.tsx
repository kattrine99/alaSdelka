import { Button, Heading, Paragraph } from "../index";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import FireIcon from '../../assets/fire.svg?react';
import HeartIcon from '../../assets/heart.svg?react';
import SolidHeartIcon from '../../assets/Solidheart.svg?react';
import { Link } from "react-router-dom";
import { ICards } from "./Interfaces";
import { offerTypeToUrlMap } from "../../utils/categoryMap";
import { useToggleFavoriteMutation } from "../../Store/api/Api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";


export const Cards: React.FC<ICards> = ({
    cards,
    initialFavorites = [],
    cardWrapperClass,
    cardIconClass,
    cardHeadingClass,
    cardTextClass,
    containerClass,
    onFavoritesChanged,
    WhatchButtonClass,
}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [favoriteIds, setFavoriteIds] = useState<number[]>(initialFavorites);
    const [toggleFavoriteAPI] = useToggleFavoriteMutation();

    useEffect(() => {
        const areEqual =
            initialFavorites.length === favoriteIds.length &&
            initialFavorites.every((id) => favoriteIds.includes(id));

        if (!areEqual) {
            setFavoriteIds(initialFavorites);
        }
    }, [favoriteIds, initialFavorites]);


    const handleToggle = async (id: number) => {
        const isAlreadyFavorite = favoriteIds.includes(id);

        setFavoriteIds((prev) =>
            isAlreadyFavorite ? prev.filter((favId) => favId !== id) : [...prev, id]
        );

        try {
            const res = await toggleFavoriteAPI(id).unwrap();

            if (onFavoritesChanged) {
                onFavoritesChanged(id, res.status as "added" | "removed");
            }
        } catch (e) {
            console.error("Ошибка добавления в избранное", e);

            setFavoriteIds((prev) =>
                isAlreadyFavorite ? [...prev, id] : prev.filter((favId) => favId !== id)
            );
        }
    };



    return (
        <div className={containerClass}>

            {cards.map((card, index) => {
                const isFavorite = favoriteIds.includes(card.id);
                return (
                    <div
                        key={card.id}
                        className={`relative rounded-lg bg-white flex h-full ${cardWrapperClass ?? ""} delay-[${index * 100}ms]`}
                    >
                        {card.offer_status === "is_payed" && (
                            <div className="absolute w-[125px] left-5 font-openSans translate-y-[-50%] bg-white border border-[#FD6A0D] text-[#FD6A0D] py-[5px] px-1.5 rounded-md font-semibold z-10 shadow-sm flex">
                                <FireIcon className="z-10 w-5 h-5 text-[#FD6A0D]" />
                                <Paragraph className="">
                                    Популярное
                                </Paragraph>
                            </div>
                        )}
                        {card.offer_status === "sold" && (
                            <div className="absolute w-[125px] left-5 font-openSans translate-y-[-50%] bg-white border border-[#301DFF] text-[#301DFF] py-1.25 px-1.5 rounded-md font-semibold z-10 shadow-sm flex">
                                <FireIcon className="z-10 w-5 h-5 text-[#301DFF]" />
                                <Paragraph className="">
                                    Продано
                                </Paragraph>
                            </div>
                        )}
                        <div className={`relative ${cardIconClass ?? ""}`}>

                            <img src={card.image || "../../../images/business_abstract.jpg"} alt={`${card.id}`} className="w-full object-cover" />
                            {isAuthenticated &&
                                <button
                                    onClick={() => handleToggle(card.id)}
                                    className="absolute top-5 right-4.5"
                                >
                                    {isFavorite ? (
                                        <SolidHeartIcon className="w-8 h-7 border- py-0.5 border-[#2EAA7B] text-[#FF1D1D] bg-white rounded-full " />
                                    ) : (
                                        <HeartIcon className="w-8 h-7 text-center border-1 py-0.5 border-[#2EAA7B] text-[#2EAA7B] bg-white rounded-full" />
                                    )}
                                </button>
                            }
                        </div>

                        <div className="px-[18px] py-[21px] flex flex-col flex-1">
                            <div className=" flex flex-col">
                                <Heading
                                    text={`${card.price} сум`}
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
                                    <FaLocationDot className="text-[#2EAA7B] h-[16px] text-[20px]"/>
                                    <span className="font-bold text-[12px]">  {card.address?.address ?? "Адрес не указан"}, {card.address?.city?.name_ru ?? ""}
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
                )
            }
            )
            }
        </div>
    );
};
