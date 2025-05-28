import { Button, Paragraph, CardPreview } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/store";
import { OfferPayload } from "../../../Store/api/types";
import { ICard } from "../../../components/Cards/Interfaces";
import { usePublishOfferMutation } from "../../../Store/api/Api";
import { useState } from "react";
import { clearOfferData } from "../../../Store/tempStorage";

interface Props {
    onPublish: () => void;
    onPreview: () => void;
}

const mapOfferToCard = (data: OfferPayload): ICard => ({
    id: data.id ?? 0,
    title: data.title,
    description: data.description,
    price: data.price,
    address: {
        address: data.address?.address || "Адрес не указан",
        city: {
            name_ru: data.city_name || "Город не указан"
        },

    }, area: data.area || 0,
    image: data.photos?.[0]?.preview ?? null,
    is_favourite: false,
    offer_type: data.offer_type,
    listing_type: data.listing_type,
});

export const PublicationStep: React.FC<Props> = ({ onPublish, onPreview }) => {
    const cardData = useSelector((state: RootState) => state.tempOffer.offerData);
    const dispatch = useDispatch();
    const [publishOffer] = usePublishOfferMutation();
    const [isPublishing, setIsPublishing] = useState(false);
    const [, setIsPublished] = useState(false);
    const [, setError] = useState(false);
    if (!cardData) return null;

    const card = mapOfferToCard(cardData);

    const handlePublish = async () => {
        if (!cardData?.id) return;
        setIsPublishing(true);
        setError(false);

        try {
            await publishOffer(cardData.id).unwrap();
            setIsPublished(true);
            dispatch(clearOfferData());
            onPublish();
        } catch (err) {
            console.error("Ошибка при публикации оффера:", err);
            setError(true);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-6 bg-[#F8F8F8] p-5 ">
            <Paragraph className="text-3xl font-inter font-semibold text-[#101828] leading-10">Подтвердите и публикуйте</Paragraph>
            <Paragraph className="font-inter text-[#667085] text-[16px] leading-5 max-w-[600px]">
                Вы почти у цели! Посмотрите, как будет выглядеть ваш готовый листинг после окончательного одобрения. Обратите внимание, что мы можем отредактировать ваш листинг, чтобы помочь вам продать.
            </Paragraph>

            <div className="w-full max-w-[600px]">
                <CardPreview card={card} onPreview={onPreview} />
            </div>
            <Button
                className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md mt-6"
                onClick={handlePublish}
                disabled={isPublishing}
            >
                {isPublishing ? "Публикация..." : "Опубликовать"}
            </Button>
        </div>
    );
};
