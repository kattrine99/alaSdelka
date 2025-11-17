import { Heading, Paragraph, Button } from "../../components";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { ICard } from "./Interfaces";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

interface CardPreviewProps {
    card: ICard;
    onPreview?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, onPreview }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { lang, t } = useTranslation();

    useEffect(() => {
        if (typeof card.image === "string") {
            setImageUrl(card.image);
        }
    }, [card.image]);

    function numberWithSpaces(x: number) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const currencyMode = useSelector((state: RootState) => state.currency.mode);
    const currencyRate = useSelector((state: RootState) => state.currency.rate);

    const formatCurrency = (price?: number, priceCurrency?: "UZS" | "USD") => {
        if (typeof price !== 'number') return "—";

        const offerCurrency = priceCurrency || "UZS";
        
        // Если валюта оффера совпадает с выбранной валютой отображения, показываем как есть
        if (offerCurrency === currencyMode) {
            if (currencyMode === "USD") {
                return `${numberWithSpaces(price)} $`;
            }
            return `${numberWithSpaces(price)} ${t("UZS")}`;
        }

        // Если валюты не совпадают, конвертируем
        if (currencyMode === "USD") {
            // Оффер в UZS, показываем в USD
            const converted = Math.round(price / (currencyRate || 1));
            return `${numberWithSpaces(converted)} $`;
        } else {
            // Оффер в USD, показываем в UZS
            const converted = Math.round(price * (currencyRate || 1));
            return `${numberWithSpaces(converted)} ${t("UZS")}`;
        }
    };

    return (
        <div className="relative rounded-xl bg-white shadow-sm py-7.5 px-4.5 w-full max-w-[400px] flex flex-col">
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
            <div className="flex-1 flex flex-col ">
                <div>
                    <Heading text={`${formatCurrency(card.price, card.price_currency)}`} level={2} className="font-inter text-[24px] font-bold text-[#232323] mb-2" />
                    <Paragraph className="font-inter text-[#232323] text-[18px] font-bold">{card.title}</Paragraph>

                    <Paragraph className="flex font-inter font-medium text-[14px] mt-3 text-[#667085]">
                        <FaLocationDot className="text-[#2EAA7B] mr-1.5" />
                        {t("Адрес:")} <span className=" font-bold text-[14px] ml-1.5">{card.address?.address}, {lang === "uz" ? card.address?.city?.name_uz : card.address?.city?.name_ru}</span>
                    </Paragraph>

                    {card.area ? (
                        <Paragraph className="flex items-center font-inter font-medium text-[14px] mt-3 text-[#667085]">
                            <FaLocationCrosshairs className="text-[#2EAA7B] mr-1.5" />
                            {card.area} {t("кв. м.")}
                        </Paragraph>
                    ) : (
                        <Paragraph className="flex items-center font-inter font-medium text-[14px] mt-3 text-[#667085]">
                            <FaLocationCrosshairs className="text-[#2EAA7B] mr-1.5" />
                            {t("Не указано")}
                        </Paragraph>
                    )}
                </div>

                <div className="mt-4.5 w-full">
                    <Button onClick={onPreview} className="bg-[#2EAA7B] w-full text-white px-4 py-2 rounded-md flex justify-center items-center gap-2">
                        {t("Просмотреть")} <FaArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};
