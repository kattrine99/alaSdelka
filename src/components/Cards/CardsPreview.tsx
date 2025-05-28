import { Heading, Paragraph, Button } from "../../components";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { ICard } from "./Interfaces";
import { useEffect, useState } from "react";

interface CardPreviewProps {
    card: ICard;
    onPreview?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, onPreview }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof card.image === "string") {
            setImageUrl(card.image);
        }
    }, [card.image]);

    return (
        <div className="relative rounded-xl bg-white shadow-sm py-7.5 px-4.5 w-full max-w-[400px] flex flex-col">
            <div className="relative md:w-[360px] w-full h-[160px] md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center text-gray-400 text-sm">
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col ">
                <div>
                    <Heading text={`${String(card.price)} сум`} level={2} className="font-inter text-[24px] font-bold text-[#232323] mb-2" />
                    <Paragraph className="font-inter text-[#232323] text-[18px] font-bold">{card.title}</Paragraph>

                    <Paragraph className="flex font-inter font-medium text-[14px] mt-3 text-[#667085]">
                        <FaLocationDot className="text-[#2EAA7B] mr-1.5" />
                        Адрес: <span className=" font-bold text-[14px] ml-1.5">{card.address?.address}, {card.address?.city?.name_ru}</span>
                    </Paragraph>

                    {card.area && (
                        <Paragraph className="flex items-center font-inter font-medium text-[14px] mt-3 text-[#667085]">
                            <FaLocationCrosshairs className="text-[#2EAA7B] mr-1.5" />
                            {card.area} кв. м.
                        </Paragraph>
                    )}
                </div>

                <div className="mt-4.5">
                    <Button onClick={onPreview} className="bg-[#2EAA7B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                        Просмотреть <FaArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};
