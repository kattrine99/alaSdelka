import { Button, Paragraph, CardPreview } from "../../../components";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { OfferPayload } from "../../../Store/api/types";
import { ICard } from "../../../components/Cards/Interfaces";
import { FaArrowRight } from "react-icons/fa";

interface Props {
    onPublish: () => void;
}

const mapOfferToCard = (data: OfferPayload): ICard => ({
    id: data.id ?? 0,
    title: data.title,
    description: data.description,
    price: data.amount,
    address: {
        address: data.address || "Адрес не указан",
        city: {
            name_ru: data.city_name || "Город не указан"
        }

    }, area: data.area || "Площадь не указана",
    image: data.images?.[0] ? URL.createObjectURL(data.images[0]) : null,

    is_favorite: false,
    offer_type: data.offer_type,
    listing_type: data.listing_type,
});

export const PublicationStep: React.FC<Props> = ({ onPublish }) => {
    const cardData = useSelector((state: RootState) => state.tempOffer.offerData);

    if (!cardData) return null;

    const card = mapOfferToCard(cardData);
    console.log("DATA FROM STORE:", cardData);

    return (
        <div className="flex flex-col items-start gap-6 bg-[#F8F8F8] p-5 ">
            <Paragraph className="text-3xl font-inter font-semibold text-[#101828] leading-10">Подтвердите и публикуйте</Paragraph>
            <Paragraph className="font-inter text-[#667085] text-[16px] leading-5 max-w-[600px]">
                Вы почти у цели! Посмотрите, как будет выглядеть ваш готовый листинг после окончательного одобрения. Обратите внимание, что мы можем отредактировать ваш листинг, чтобы помочь вам продать.
            </Paragraph>

            <div className="w-full max-w-[600px]">
                <CardPreview card={card} />
            </div>
                <Button className="bg-[#2EAA7B] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={onPublish}>
                    Опубликовать <FaArrowRight />
                </Button>
        </div>
    );
};
