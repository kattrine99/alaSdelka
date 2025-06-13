import { Button, Paragraph, CardPreview, ModalBase } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/store";
import { OfferPayload } from "../../../Store/api/types";
import { ICard } from "../../../components/Cards/Interfaces";
import { useCreateOfferMutation, usePublishOfferMutation } from "../../../Store/api/Api";
import { useState } from "react";
import { clearOfferData } from "../../../Store/tempStorage";
import { useTranslation } from "../../../../public/Locales/context/TranslationContext";

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
            name_ru: data.city_name || "Город не указан",
            name_uz: data.city_name || "Город не указан"
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
    const [createOffer] = useCreateOfferMutation();
    const [publishOffer] = usePublishOfferMutation();

    const [isPublishing, setIsPublishing] = useState(false);
    const [, setIsPublished] = useState(false);
    const [, setError] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const { lang, t } = useTranslation()
    if (!cardData) return null;

    const card = mapOfferToCard(cardData);

    const handlePublish = async () => {
        setIsPublishing(true);
        setError(false);

        try {
            const formData = new FormData();
            formData.append("title", cardData.title);
            formData.append("description", cardData.description);
            formData.append("listing_type", cardData.listing_type);
            formData.append("offer_type", cardData.offer_type);
            formData.append("category_id", String(cardData.category_id));
            formData.append("price", String(cardData.price));
            formData.append("user_name", cardData.user_name);
            formData.append("user_phone", cardData.user_phone);
            formData.append("area", String(cardData.area));
            formData.append("address[address]", cardData.address?.address || "Не указан");
            formData.append("address[latitude]", "0");
            formData.append("address[longitude]", "0");
            formData.append("address[city_id]", String(cardData.address?.city_id || ""));
            formData.append("premises_ownership_form", cardData.premises_ownership_form || "");
            formData.append("business_type", cardData.business_type || "");

            cardData.conveniences?.forEach((id, index) => {
                formData.append(`conveniences[${index}]`, String(id));
            });

            if (cardData.listing_type === "sell") {
                formData.append("average_monthly_revenue", String(cardData.average_monthly_revenue || 0));
                formData.append("average_monthly_profit", String(cardData.average_monthly_profit || 0));
                formData.append("average_monthly_expenses", String(cardData.average_monthly_expenses || 0));
                formData.append("payback_period", String(cardData.payback_period || 0));
                formData.append("percentage_for_sale", String(cardData.percentage_for_sale || 0));
                formData.append("foundation_year", String(cardData.foundation_year || 0));

                cardData.documents?.forEach(file => {
                    formData.append("documents[]", file);
                });

                cardData.photos?.forEach((item, idx) => {
                    formData.append(`photos[${idx}][photo]`, item.photo);
                    formData.append(`photos[${idx}][order]`, String(item.order));
                });

                cardData.communication_channels?.forEach((ch, idx) => {
                    formData.append(`communication_channels[${idx}][channel_name]`, ch.channel_name);
                    formData.append(`communication_channels[${idx}][link]`, ch.link);
                });
            }

            if (cardData.project_stage_id) {
                formData.append("project_stage_id", String(cardData.project_stage_id));
            }

            const createResponse = await createOffer(formData).unwrap();
            const newOfferId = createResponse.data.id;

            await publishOffer(newOfferId).unwrap();

            setIsPublished(true);
            dispatch(clearOfferData());
            onPublish();
        } catch (err) {
            console.error("Ошибка при публикации оффера:", err);
            setError(true);
            setIsErrorModalOpen(true);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div>
            {isErrorModalOpen && (
                <ModalBase
                    title={t("Что-то пошло не так")}
                    message={
                        <Paragraph className="text-[#232323] text-base">
                            {t("Пожалуйста, проверьте информацию в объявлении или повторите попытку позже.")}
                        </Paragraph>
                    }
                    onClose={() => setIsErrorModalOpen(false)}
                    ModalClassName="p-8"
                    HeadingClassName="text-[#101828] font-bold text-xl"
                />
            )
            }
            <div className="flex flex-col items-start gap-6 bg-[#F8F8F8] p-5">
                <Paragraph className="text-3xl font-inter font-semibold text-[#101828] leading-10">
                    {t("Подтвердите и публикуйте")}
                </Paragraph>
                <Paragraph className="font-inter text-[#667085] text-[16px] leading-5 max-w-[600px]">
                    {t("Вы почти у цели! Посмотрите, как будет выглядеть ваш готовый листинг после окончательного одобрения.")}
                </Paragraph>

                <div className="w-full max-w-150">
                    <CardPreview card={card} onPreview={onPreview} />
                </div>

                <Button
                    className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md mt-6"
                    onClick={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? t("Публикация...") : t("Опубликовать")}
                </Button>
            </div>

        </div >
    );
};

