import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOfferBySlugQuery } from "../../Store/api/Api";
import { useDispatch } from "react-redux";
import { setOfferData, clearOfferData, setOfferId } from "../../Store/tempStorage";
import { ModalBase, Button, Footer, Header, Breadcrumbs } from "../../components";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { profileNavigate } from "../../utils/categoryMap";
import { OfferDetail, OfferPayload } from "../../Store/api/types";
import { UpdateInformationPage } from "./UpdateInformationStep";

export const UpdatePage = () => {
    const { t } = useTranslation();
    const { slug, lng } = useParams<{ slug: string, lng: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading, isError } = useGetOfferBySlugQuery(String(slug));
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (data?.data) {
            dispatch(setOfferData(mapApiDataToStore(data.data)));
        }
    }, [data]);

    const handleSuccess = () => {
        setIsSuccessModalOpen(true);
        dispatch(clearOfferData());
        setTimeout(() => {
            navigate(`/${lng}/announcements`);
        }, 3000);
    };

    if (isLoading) return <div>{t("Загрузка...")}</div>;
    if (isError) return <div>{t("Ошибка загрузки данных")}</div>;

    return (
        <div className="w-screen min-h-screen flex-col flex">
            <Header navLinksData={profileNavigate} />
            <div className="container mx-auto px-4 lg:px-10 xl:px-20 md:px-4 flex-1 py-6">
                <div className="mb-6">
                    <Breadcrumbs links={[
                        { label: t("Мои объявления"), href: "/announcements" },
                        { label: t("Изменение объявления") }
                    ]} />
                </div>
                {data?.data && (
                    <div className="container mx-auto py-12">
                        <UpdateInformationPage
                            id={data.data.id}
                            onSuccess={handleSuccess}
                        />
                    </div>
                )}

                {isSuccessModalOpen && (
                    <ModalBase
                        title={t("Успешно обновлено!")}
                        message={t("Ваше объявление успешно обновлено.")}
                        onClose={() => navigate(`/${lng}/announcements`)}
                        actions={
                            <Button
                                className="bg-[#2EAA62] text-white px-6 py-3 rounded-md"
                                onClick={() => navigate(`/${lng}/announcements`)}
                            >
                                {t("Перейти к списку")}
                            </Button>
                        }
                        HeadingClassName={"font-intere font-bold text-xl"}
                    />
                )}

            </div><Footer showSmallFooter={true} />
        </div>
    );
};

const mapApiDataToStore = (apiData: OfferDetail["data"]): OfferPayload => {
    return {
        id: apiData.id,
        title: apiData.title,
        description: apiData.description,
        listing_type: apiData.listing_type,
        offer_type: apiData.offer_type,
        category_id: apiData.category.id,
        price: apiData.price,
        area: apiData.area,
        area_from: apiData.area_from,
        area_to: apiData.area_to,
        user_name: apiData.user_name,
        user_phone: apiData.user_phone,
        address: {
            address: apiData.address.address || "",
            latitude: apiData.address.latitude || 0,
            longitude: apiData.address.longitude || 0,
            city_id: apiData.address.city.id,
        },
        conveniences: apiData.conveniences.map((conv) => conv.id),
        business_type: apiData.business_type,
        premises_ownership_form: apiData.premises_ownership_form,
        average_monthly_revenue: apiData.average_monthly_revenue,
        average_monthly_profit: apiData.average_monthly_profit,
        average_monthly_expenses: apiData.average_monthly_expenses,
        payback_period: apiData.payback_period,
        percentage_for_sale: apiData.percentage_for_sale,
        foundation_year: apiData.foundation_year,
        documents: apiData.documents.map((doc) => ({
            id: doc.id,
            document: doc.document,
            name: extractFileName(doc.document),
        })),
        photos: apiData.photos.map((photo) => ({
            id: photo.id,
            photo: photo.photo,
            order: photo.order,
        })),
        communication_channels: apiData.communication_channels,
        project_stage_id: apiData.project_stage?.id ?? null,
    };
};

const extractFileName = (url: string): string => {
    return url.split("/").pop() || "file";
};
