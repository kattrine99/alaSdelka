import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../components";
import { useEffect, useMemo, useRef, useState } from "react";
import FlagIcon from '../../assets/Flag.svg?react';
import PdfIcon from '../../assets/pdf.svg?react';
import GalleryIcon from '../../assets/gallery.svg?react';
import { HiPlus, HiX } from "react-icons/hi";
import { useGetFiltersDataQuery, useUpdateOfferMutation, useGetUserInfoQuery, useDeleteOfferDocumentMutation, useDeleteOfferPhotoMutation } from "../../Store/api/Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { clearOfferData } from "../../Store/tempStorage";
import { OfferPayload } from "../../Store/api/types";

interface Props {
    onSuccess: () => void;
    id: number;
}
type DocumentItem = {
    id: number;
    document: string | File;
    name: string;
};
type PhotoItem = {
    id?: number;
    photo: File | string;
    preview: string;
    order: number;
};
export const UpdateInformationPage: React.FC<Props> = ({ onSuccess, id }) => {
    const offerData = useSelector((state: RootState) => state.tempOffer.offerData) as OfferPayload;
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { data: filtersData } = useGetFiltersDataQuery();
    const conveniences = filtersData?.conveniences || [];
    const { data: userInfo } = useGetUserInfoQuery();
    const { lang, t } = useTranslation();
    const offerType = offerData?.offer_type;
    const listingType = offerData?.listing_type;
    const [deleteOfferDocument] = useDeleteOfferDocumentMutation();
    const [deleteOfferPhoto] = useDeleteOfferPhotoMutation();

    const isFranchise = offerType === "franchise";
    const isStartup = offerType === "startup";
    const isInvestments = offerType === "investments";
    const isSell = listingType === "sell";
    const [updateOffer] = useUpdateOfferMutation();
    const [isUpdating, setIsUpdating] = useState(false);

    const [title, setTitle] = useState(offerData?.title || "");
    const [description, setDescription] = useState(offerData?.description || "");
    const [categoryId, setCategoryId] = useState(String(offerData?.category_id || ""));
    const [cityId, setCityId] = useState(String(offerData?.address?.city_id || ""));
    const [addressText, setAddressText] = useState(offerData?.address?.address || "");
    const [area, setArea] = useState(String(offerData?.area || ""));
    const [areaFrom, setAreaFrom] = useState(offerData?.area_from?.toString() || "");
    const [areaTo, setAreaTo] = useState(offerData?.area_to?.toString() || "");
    const [propertyOwnershipType, setPropertyOwnershipType] = useState(offerData?.premises_ownership_form || "");
    const [businessOwnership, setBusinessOwnership] = useState(offerData?.business_type || "");
    const [amount, setAmount] = useState(offerData?.price?.toLocaleString("ru-RU").replace(/,/g, " ") || "");
    const [currency, setCurrency] = useState<"sum" | "dollar">(offerData?.price_currency === "USD" ? "dollar" : "sum");
    const [percentageForSale, setPercentageForSale] = useState(offerData?.percentage_for_sale || 0);
    const [monthlyIncome, setMonthlyIncome] = useState(offerData?.average_monthly_revenue || 0);
    const [profit, setProfit] = useState(offerData?.average_monthly_profit || 0);
    const [expences, setExpences] = useState(offerData?.average_monthly_expenses || 0);
    const [paybackPeriod, setPaybackPeriod] = useState(offerData?.payback_period || 0);
    const [foundationYear, setFoundationYear] = useState(offerData?.foundation_year || 0);
    const [projectStageId, setProjectStageId] = useState(String(offerData?.project_stage_id || ""));
    const [selectedConveniences, setSelectedConveniences] = useState<number[]>(offerData?.conveniences || []);
    const [links, setLinks] = useState<{ channel_name: string; link: string }[]>(offerData?.communication_channels || [{ channel_name: "", link: "" }]);
    const [existingDocuments, setExistingDocuments] = useState<DocumentItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const extractFileName = (url: string): string => {
        return url.split("/").pop() || "file";
    }
    const fullName = userInfo?.name?.trim() || "";
    const phoneNumber = userInfo?.phone?.replace("+998", "") || "";

    const foundationYears = useMemo(() => {
        const years = [];
        for (let y = new Date().getFullYear(); y >= 1930; y--) years.push(y);
        return years;
    }, []);

    useEffect(() => {
        if (offerData) {
            setTitle(offerData.title || "");
            setDescription(offerData.description || "");
            setCategoryId(String(offerData.category_id || ""));
            setCityId(String(offerData?.address?.city_id || ""));
            setAddressText(offerData?.address?.address || "");
            setArea(String(offerData.area || ""));
            setAreaFrom(String(offerData.area_from) || "");
            setAreaTo(String(offerData.area_to) || "");
            setPropertyOwnershipType(offerData.premises_ownership_form || "");
            setBusinessOwnership(offerData.business_type || "");
            setAmount(offerData?.price?.toLocaleString("ru-RU").replace(/,/g, " ") || "");
            setCurrency(offerData?.price_currency === "USD" ? "dollar" : "sum");
            setPercentageForSale(offerData.percentage_for_sale || 0);
            setMonthlyIncome(offerData.average_monthly_revenue || 0);
            setProfit(offerData.average_monthly_profit || 0);
            setExpences(offerData.average_monthly_expenses || 0);
            setPaybackPeriod(offerData.payback_period || 0);
            setFoundationYear(offerData.foundation_year || 0);
            setProjectStageId(String(offerData?.project_stage_id || ""));
            setSelectedConveniences(offerData?.conveniences || []);
            setLinks(offerData?.communication_channels || [{ channel_name: "", link: "" }]);

            // Маппим документы, проверяем что массив есть
            setExistingDocuments(
                (offerData.documents ?? [])
                    .filter((doc) => doc.id !== undefined)
                    .map((doc) => ({
                        id: doc.id as number,
                        document: doc.document,
                        name: typeof doc.document === 'string'
                            ? extractFileName(doc.document)
                            : doc.document.name
                    }))
            );
            // Маппим фото
            setPhotos(
                (offerData.photos ?? [])
                    .filter((photo) => photo.id !== undefined)
                    .map((photo) => ({
                        id: photo.id as number,
                        photo: photo.photo,
                        preview: typeof photo.photo === 'string'
                            ? photo.photo
                            : URL.createObjectURL(photo.photo),
                        order: photo.order,
                    }))
            );
        }
    }, [offerData]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const newDocs: DocumentItem[] = files.map((file, idx) => ({
            id: 0,
            document: file,
            name: file.name,
        }));
        setExistingDocuments(prev => [...prev, ...newDocs]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const newImages = target.files ? Array.from(target.files) : [];
        const newPhotos = newImages.map((file, index) => ({
            photo: file,
            preview: URL.createObjectURL(file),
            order: photos.length + index,
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
    };
    const handleRemoveDocument = async (index: number) => {
        const doc = existingDocuments[index];

        if (doc.id !== 0) {
            try {
                await deleteOfferDocument({ offerId: id, documentId: doc.id }).unwrap();
            } catch (err) {
                console.error("Ошибка при удалении документа:", err);
                return;
            }
        }
        setExistingDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemovePhoto = async (index: number) => {
        const photo = photos[index];

        if (photo.id !== undefined) {
            try {
                await deleteOfferPhoto({ offerId: id, photoId: photo.id }).unwrap();
            } catch (err) {
                console.error("Ошибка при удалении фотографии:", err);
                return;
            }
        }
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);

            if (!title || !description || !categoryId || !cityId || !addressText || !userInfo?.name || !phoneNumber) {
                console.error("Все обязательные поля должны быть заполнены");
                return;
            }
            const payload = {
                title,
                description,
                price: parseInt(amount.replace(/\s/g, "")),
                price_currency: currency === "dollar" ? "USD" : "UZS",
                category_id: Number(categoryId),
                area: Number(area),
                address: {
                    address: addressText,
                    city_id: Number(cityId),
                },
                premises_ownership_form: propertyOwnershipType,
                business_type: businessOwnership,
                average_monthly_revenue: monthlyIncome,
                average_monthly_profit: profit,
                average_monthly_expenses: expences,
                payback_period: paybackPeriod,
                percentage_for_sale: percentageForSale,
                foundation_year: foundationYear,
                project_stage_id: Number(projectStageId),
                user_name: fullName,
                user_phone: "+998" + phoneNumber,
                conveniences: selectedConveniences,
                communication_channels: links,
                existing_documents: existingDocuments.map((doc) => doc.id),
                existing_photos: photos
                    .filter((p): p is (PhotoItem & { photo: string; id: number }) => typeof p.photo === 'string' && p.id !== undefined)
                    .map((p) => p.id),
            };

            await updateOffer({ id, payload }).unwrap();

            dispatch(clearOfferData());
            onSuccess();
        } catch (err) {
            console.error("Ошибка при обновлении:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChannelNameChange = (index: number, value: string) => {
        setLinks((prev) => {
            const updated = [...prev];
            updated[index].channel_name = value;
            return updated;
        });
    };

    const handleLinkChange = (index: number, value: string) => {
        setLinks((prev) => {
            const updated = [...prev];
            updated[index].link = value;
            return updated;
        });
    };

    const handleAddLink = () => {
        setLinks((prev) => [
            ...prev,
            { channel_name: "", link: "" },
        ]);
    };
    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setter: (value: number) => void
    ) => {
        const value = e.target.value.replace(/\D/g, "");
        setter(Number(value));
    };

    const toggleConvenience = (id: number) => {
        setSelectedConveniences((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };
    return (
        <div className="flex flex-col gap-6 p-10 max-md:p-4 bg-[#F8F8F8] text-[#4f4f4f] ">
            <Heading text={t("Обновление объявления")} level={2} className="text-3xl font-inter font-semibold" />
            <Paragraph>{t("Заполните или обновите данные для редактирования объявления.")}</Paragraph>

            {/*Название */}
            <div className="flex flex-col gap-2">
                <Input
                    className={`bg-[#F0F1F280] w-full max-w-200 rounded-[14px] outline-none py-3.5 px-4.5 ${!title ? 'border border-red-500' : ''
                        }`}
                    type="text"
                    placeholder={t("Введите")}
                    isError={!title}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                    LabelText={t("Название бизнеса")}
                />
                {!title && (
                    <p className="text-red-500 text-sm">{t("Пожалуйста, введите название бизнеса")}</p>
                )}
            </div>
            {/*Описание textarea */}
            <div className="flex flex-col gap-2 w-full max-w-200 relative">
                <Input
                    isTextArea
                    required
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText={t("Описание")}
                    placeholder={t("Введите текст")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`bg-[#F0F1F280] resize-none w-full h-[118px] rounded-[14px] outline-none py-3.5 px-4.5 ${!description ? 'border border-red-500' : ''
                        }`}
                    maxLength={3000}
                    isError={!description}
                />
                <span className="absolute bottom-2 right-3 text-sm text-[#8A8A8A] font-inter">
                    {description.length}/{3000}
                </span>
                {!description && (
                    <p className="text-red-500 text-sm">{t("Пожалуйста, введите описание")}</p>
                )}
            </div>
            {/*Категория объявления */}
            <div className="flex flex-col gap-2 w-full max-w-200 relative">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Категория объявления")}</label>
                <select
                    required
                    className={`bg-[#F0F1F280] w-full max-w-200  rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!categoryId ? 'border border-red-500' : ''
                        }`}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">{t("Выбрать")}</option>
                    {filtersData?.categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                            {lang === "uz" ? cat.title_uz : cat.title_ru}
                        </option>
                    ))}
                </select>
                {!categoryId && (
                    <p className="text-red-500 text-sm mt-1">{t("Пожалуйста, выберите категорию")}</p>
                )}
            </div>

            {/*Имя и фамилия*/}
            <div className="flex gap-3.5 w-full max-w-200 ">
                <Input
                    className="bg-[#b5b5b667]  text-gray-500 cursor-not-allowed w-full rounded-[14px] outline-none py-3.5 px-4.5"
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText={t("Имя")}
                    type="text"
                    placeholder={t("Введите")}
                    isError={false}
                    value={fullName}
                    disabled
                />
            </div>
            {/*Номер телефона */}
            <div className="flex flex-col gap-2 w-full max-w-200  relative ">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%] mb-2.5 block">{t("Номер телефона")}</label>
                <div className="bg-[#b5b5b667] w-full rounded-[14px] flex items-center p-1 ">
                    <div className="w-12 h-12 p-1 rounded-[10px] bg-[#b4b8cc] flex items-center justify-center mr-3">
                        <FlagIcon className="w-[25px] h-[25px] object-contain" />
                    </div>
                    <span className="text-gray-500 font-inter text-[16px] mr-2">+998</span>
                    <Input
                        type="tel"
                        placeholder="90 000 00 00"
                        className="placeholder:text-[#8A8A8A] disabled:text-gray-500 input-no-border cursor-not-allowed"
                        isError={false}
                        value={phoneNumber}
                        disabled
                    />
                </div>
            </div>
            {/*Стадия */}
            <div className="flex flex-col gap-2 w-full max-w-200  relative">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Стадия")}</label>
                <select className={`bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!projectStageId ? 'border border-red-500' : ''
                    }`}
                    value={projectStageId}
                    onChange={(e) => setProjectStageId(e.target.value)}>
                    <option className="">{t("Выбрать")}</option>
                    {filtersData?.project_stages.map((stage) => (
                        <option key={stage.id} value={String(stage.id)}>
                            {lang === "uz" ? stage.name_uz : stage.name_ru}
                        </option>
                    ))}
                </select>
                {!projectStageId && (
                    <p className="text-red-500 text-sm mt-1">{t("Пожалуйста, выберите стадию проекта")}</p>
                )}
            </div>

            {/*Город */}
            <div className="flex flex-col gap-2 w-full max-w-200  relative">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Город")}</label>
                <select className={`bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!cityId ? 'border border-red-500' : ''
                    }`}
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}>
                    <option className="">{t("Выбрать")}</option>
                    {filtersData?.cities.map((city) => (
                        <option key={city.id} value={String(city.id)}>
                            {lang === "uz" ? city.name_uz : city.name_ru}
                        </option>
                    ))}
                </select>
                {!cityId && (
                    <p className="text-red-500 text-sm mt-1">{t("Пожалуйста, выберите город")}</p>
                )}
            </div>
            {/*Адрес */}
            <div className="flex flex-col gap-2 w-full max-w-200 relative">
                <Input className={`bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5 ${!addressText ? 'border border-red-500' : ''
                    }`}
                    LabelText={t("Адрес")} type="text" placeholder={t("Введите")} isError={!addressText}
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)} />
                {!addressText && (
                    <p className="text-red-500 text-sm">{t("Пожалуйста, введите Адрес")}</p>
                )}
            </div>
            {/*Площадь */}
            {offerType == 'business' && listingType == 'buy' ? (
                <>
                    <Input
                        className="bg-[#F0F1F280] w-full max-w-200 rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                        LabelText={t("Площадь от, кв. м.")}
                        type="text"
                        isError={false}
                        value={areaFrom}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setAreaFrom(value);
                        }}
                    />
                    <Input
                        className="bg-[#F0F1F280] w-full max-w-200 rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                        LabelText={t("Площадь до, кв. м.")}
                        type="text"
                        isError={false}
                        value={areaTo}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setAreaTo(value);
                        }}
                    />
                </>
            ) : (
                <Input
                    className="bg-[#F0F1F280] w-full max-w-200 rounded-[14px] outline-none py-3.5 px-4.5"
                    LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                    LabelText={t("Площадь, кв. м.")}
                    type="text"
                    placeholder={t("Введите")}
                    isError={false}
                    value={area}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setArea(value);
                    }}
                />
            )}
            {/*Форма владения бизнесом */}
            <div className="flex flex-col gap-2 w-full max-w-98 relative">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Форма владения бизнесом")}</label>
                <select
                    className={`bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!businessOwnership ? 'border border-red-500' : ''
                        }`}
                    value={businessOwnership}
                    onChange={(e) => setBusinessOwnership(e.target.value)}
                >
                    <option value="">{t("Выбрать")}</option>
                    {filtersData?.business_types.map((type) => (
                        <option key={type.value} value={type.value}>
                            {lang === "uz" ? type.label_uz : type.label_ru}
                        </option>
                    ))}
                </select>
                {!businessOwnership && (
                    <p className="text-red-500 text-sm mt-1">{t("Пожалуйста, выберите форму")}</p>
                )}
            </div>
            {/*Форма владения помещением */}
            <div className="flex flex-col gap-2 w-full max-w-98  relative">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Форма владения помещением")}</label>
                <select className={`bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!propertyOwnershipType ? 'border border-red-500' : ''
                    }`}
                    value={propertyOwnershipType}
                    onChange={(e) => setPropertyOwnershipType(e.target.value)}
                >
                    <option className="">{t("Выбрать")}</option>
                    {filtersData?.premises_ownership_form.map((form) => (
                        <option key={form.value} value={String(form.value)}>
                            {lang === "uz" ? form.label_uz : form.label_ru}
                        </option>
                    ))}
                </select>
                {!propertyOwnershipType && (
                    <p className="text-red-500 text-sm mt-1">{t("Пожалуйста, выберите форму")}</p>
                )}
            </div>
            {isSell && <div className="flex flex-col gap-2">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%] mb-2.5">
                    {t("Документы и лицензии")}
                </label>

                <div className="flex gap-4 flex-wrap">
                    {existingDocuments.map((doc, idx) => (
                        <div
                            key={idx}
                            className="relative border border-dashed border-[#2EAA62] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                        >
                            <button
                                onClick={() => handleRemoveDocument(idx)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] flex items-center justify-center transition"
                            >
                                <HiX className="text-gray-500 text-sm" />
                            </button>

                            <PdfIcon className="w-9 h-9 mb-2" />
                            <p className="text-[#4f4f4f]  font-medium text-sm truncate w-full">
                                {doc.name}
                            </p>
                            <p className="text-[#667085] text-sm">
                                {typeof doc.document === "string"
                                    ? "Загружено"
                                    : `${(doc.document.size / 1024 / 1024).toFixed(1)} МБ`}
                            </p>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="border border-dashed border-[#2EAA62] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                    >
                        <div className="bg-[#EBF9F5] w-9 h-9 rounded-full flex items-center justify-center mb-2">
                            <HiPlus className="text-[#2EAA62] text-lg" />
                        </div>
                        <p className="text-[#4f4f4f]  font-medium">{t("Загрузить документ")}</p>
                        <p className="text-[#667085] text-sm">{t("Формат")}: PDF, Excel</p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.xls,.xlsx"
                            multiple
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </button>
                </div>
            </div>}
            {/*Сумма */}
            <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-2 w-full max-w-98  relative">
                    <Input
                        className={`bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5 ${!amount ? 'border border-red-500' : ''}`}
                        LabelText={t("Сумма")}
                        type="text"
                        placeholder={t("Введите")}
                        isError={false}
                        value={amount}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                            setAmount(formatted);
                        }}
                    />
                    {!amount && (
                        <p className="text-red-500 text-sm">{t("Пожалуйста, введите сумму")}</p>
                    )}
                </div>
                <select value={currency}
                    onChange={(e) => setCurrency(e.target.value as "sum" | "dollar")}
                    className={`bg-[#F0F1F280] max-w-40 h-full w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5`}
                >
                    <option value="sum">{t("UZS")}</option>
                    <option value="dollar">{t("Доллар США")}</option>
                </select>
            </div>

            {/*Изображения */}

            {isSell && <div className="flex flex-col gap-2">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%] mb-2.5">
                    {t("Изображение")}
                </label>

                <div className="flex gap-4 flex-wrap">
                    {photos.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative border border-dashed border-[#2EAA62] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                        >
                            <button
                                onClick={() => handleRemovePhoto(idx)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] flex items-center justify-center transition"
                            >
                                <HiX className="text-gray-500 text-sm" />
                            </button>

                            <GalleryIcon className="w-9 h-9 mb-2" />
                            <p className="text-[#4f4f4f]  font-medium text-sm truncate w-full">
                                {typeof file.photo === 'string' ? file.photo : file.photo.name}
                            </p>
                            <p className="text-[#667085] text-sm">
                                {typeof file.photo === 'string' ? '' : (file.photo.size / 1024 / 1024).toFixed(1) + " МБ"}
                            </p>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="border border-dashed border-[#2EAA62] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                    >
                        <div className="bg-[#EBF9F5] w-9 h-9 rounded-full flex items-center justify-center mb-2">
                            <HiPlus className="text-[#2EAA62] text-lg" />
                        </div>
                        <p className="text-[#4f4f4f]  font-medium">{t("Загрузить изображение")}</p>
                        <p className="text-[#667085] text-sm">620×220 px</p>

                        <Input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            isError={false} />
                    </button>
                </div>
            </div>}

            {/*Ссылки */}
            {isSell && <div className="flex flex-col w-full max-w-200 ">
                <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Ссылка на официальные каналы коммуникации")}</label>

                {links.map((item, index) => (
                    <div key={index} className="flex max-md:flex-col max-md:items-start items-center gap-3">
                        <Input
                            type="text"
                            value={item.channel_name}
                            placeholder={t("Например: Telegram")}
                            onChange={(e) => handleChannelNameChange(index, e.target.value)}
                            className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                            isError={false}
                        />
                        <Input
                            type="url"
                            value={item.link}
                            placeholder="https://..."
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            className="bg-[#F0F1F280] flex-1 rounded-[14px] outline-none py-3.5 px-4.5 mb-2"
                            isError={false}
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddLink}
                    className="text-[#2EAA62] font-inter font-semibold text-[16px] leading-[130%] underline text-left w-max mt-2"
                >
                    + {t("Добавить доп. канал")}
                </button>
            </div>}

            {/*Доля продаваемого бизнеса */}
            {isSell && <>
                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <Input
                        className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText={t("Доля продаваемого бизнеса")}
                        type="text"
                        placeholder={t("Введите")}
                        isError={false}
                        value={String(percentageForSale)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const numeric = Math.min(Number(value), 100);
                            setPercentageForSale(numeric);
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <Input
                        className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText={t("Сумма среднемесячного дохода")}
                        type="text"
                        placeholder={t("Введите")}
                        isError={false}
                        value={monthlyIncome?.toLocaleString("ru-RU").replace(/,/g, " ")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setMonthlyIncome(Number(rawValue));
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <Input
                        className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText={t("Сумма среднемесячного расхода")}
                        type="text"
                        placeholder={t("Введите")}
                        isError={false}
                        value={expences?.toLocaleString("ru-RU").replace(/,/g, " ")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setExpences(Number(rawValue));
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <Input
                        className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText={t("Сумма прибыли")}
                        type="text"
                        placeholder={t("Введите")}
                        isError={false}
                        value={profit?.toLocaleString("ru-RU").replace(/,/g, " ")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setProfit(Number(rawValue));
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText={t("Окупаемость (месяц)")} type="text" placeholder={t("Введите")} isError={false}
                        value={String(paybackPeriod)}
                        onChange={(e) => handleNumericInput(e, setPaybackPeriod)} />
                </div>
                <div className="flex flex-col gap-2 w-full max-w-98 relative">
                    <label className="text-[#4f4f4f]  font-inter text-[16px] leading-[130%]">{t("Год основания бизнеса")}</label>
                    <select
                        className="bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={String(foundationYear)}
                        onChange={(e) => setFoundationYear(Number(e.target.value))}
                    >
                        <option value="">{t("Выбрать")}</option>
                        {foundationYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </>}
            {/* Детали объявления (переключатели) */}
            <Heading text={t("Детали объявления")} level={3} className="font-inter font-semibold text-[#4f4f4f]  text-xl leading-[130%]" />
            <div className="flex flex-col w-full max-w-98 gap-6">
                {conveniences.map(({ id, name_ru, name_uz }) => {
                    const isFranchiseOnly = [10, 11].includes(id);
                    const isInvestmentOnly = [9].includes(id);

                    if (isFranchiseOnly && !isFranchise) return null;
                    if (isInvestmentOnly && !isInvestments) return null;

                    return (
                        <label key={id} className="flex items-center justify-between cursor-pointer">
                            <span className="text-[#4f4f4f]  w-full font-inter text-[16px] leading-[130%]">
                                {lang === "uz" ? name_uz : name_ru}
                            </span>
                            <Input
                                type="checkbox"
                                isError={false}
                                checked={selectedConveniences.includes(id)}
                                onChange={() => toggleConvenience(id)}
                                className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA62]
            before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
            before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                            />
                        </label>
                    );
                })}
            </div>
            <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`flex items-center max-w-60 gap-2 ${isUpdating ? "bg-gray-300 cursor-not-allowed" : "bg-[#2EAA62] text-white"} px-6 py-2 rounded-md`}
            >
                {(isUpdating ? t("Сохраняем...") : t("Сохранить изменения")) as string} <FiChevronRight />
            </Button>
        </div>
    );
};
