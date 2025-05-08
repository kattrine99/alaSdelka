import { Heading, Paragraph, Button } from "../../components";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import GalleryIcon from '../../assets/gallery.svg?react';
import { offerTypeToUrlMap } from "../../utils/categoryMap";
import { ICard } from "./Interfaces";
import { Link } from "react-router-dom";

interface CardPreviewProps {
    card: ICard;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card }) => {
    return (
        <div className="relative rounded-lg bg-white shadow-sm p-4 w-full max-w-[700px] flex flex-col md:flex-row">
            <div className="relative md:w-[260px] w-full h-[160px] md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                {card.image ? (
                    <img src={card.image} alt="preview" className="object-cover w-full h-full" />
                ) : (
                    <GalleryIcon className="w-12 h-12 text-gray-400" />
                )}
            </div>

            <div className="flex-1 md:ml-6 mt-4 md:mt-0 flex flex-col justify-between">
                <div>
                    <Heading text={String(card.price)} level={2} className="text-[20px] font-bold text-[#232323]" />
                    <Paragraph className="text-[#232323] text-[16px] font-semibold mt-1">{card.title}</Paragraph>

                    <Paragraph className="flex items-center text-[#667085] text-[14px] mt-2">
                        <FaLocationDot className="text-[#2EAA7B] mr-2" />
                        Адрес: {card.address?.address}, {card.address?.city?.name_ru}
                    </Paragraph>

                    {card.area && (
                        <Paragraph className="flex items-center text-[#667085] text-[14px] mt-1">
                            <FaLocationCrosshairs className="text-[#2EAA7B] mr-2" />
                            {card.area}
                        </Paragraph>
                    )}
                </div>

                <div className="mt-4">
                    <Link to={`/${offerTypeToUrlMap[card.offer_type]}/card/${card.id}`}>
                        <Button className="bg-[#2EAA7B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            Просмотреть <FaArrowRight />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
