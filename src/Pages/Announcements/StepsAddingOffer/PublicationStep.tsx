import { Button, Paragraph, CardPreview } from "../../../components";
import { FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { OfferPayload } from "../../../Store/api/types";
import { ICard } from "../../../components/Cards/Interfaces";

interface Props {
    onPublish: () => void;
}

const mapOfferToCard = (data: OfferPayload): ICard => ({
    id: 0, // временно
    title: data.title,
    description: data.description,
    price: data.amount,
    address: {
        address: data.address,
        city: {
            name_ru: data.city_id || "Город не указан"
        }
    }, area: "150 м²",
    image: data.images?.[0] ? URL.createObjectURL(data.images[0]) : null,
    is_favorite: false,
    offer_type: data.offer_type,
    listing_type: data.listing_type,
});

export const PublicationStep: React.FC<Props> = ({ onPublish }) => {
    const savedData = useSelector((state: RootState) => state.tempOffer.offerData);

    if (!savedData) return null;

    const card = mapOfferToCard(savedData);

    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <Paragraph className="text-[20px] font-semibold">Подтвердите и публикуйте</Paragraph>
            <Paragraph className="text-[#667085] max-w-[600px]">
                Вы почти у цели! Проверьте, как будет выглядеть ваше готовое объявление после окончательного оформления.
                Обратите внимание, что мы можем отредактировать ваш постинг, чтобы помочь вам продать.
            </Paragraph>

            <div className="w-full max-w-[600px] border rounded-lg p-4 shadow-sm bg-white">
                <CardPreview card={card} />
            </div>

            <Button
                onClick={onPublish}
                className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md flex items-center gap-2"
            >
                <FiCheck /> Опубликовать
            </Button>
        </div>
    );
};
