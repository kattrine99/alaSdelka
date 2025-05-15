import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../../components";
import { useRef, useState } from "react";
import FlagIcon from '../../../assets/Flag.svg?react';
import PdfIcon from '../../../assets/pdf.svg?react';
import GalleryIcon from '../../../assets/gallery.svg?react';
import { HiPlus, HiX } from "react-icons/hi";
import { useGetFiltersDataQuery } from "../../../Store/api/Api"
import { OfferPayload } from "../../../Store/api/types";
import { useDispatch } from "react-redux";
import { setOfferData } from "../../../Store/tempStorage";
import { useCreateOfferMutation, usePublishOfferMutation, useGetUserInfoQuery } from "../../../Store/api/Api";

interface Props {
    offerType: "business" | "franchise" | "startup" | "investments";
    listingType: "sell" | "buy";
    onNext: () => void;
}


export const InformationStep: React.FC<Props> = ({ offerType, listingType, onNext }) => {
    const isFranchise = offerType === "franchise";
    const isStartup = offerType === "startup";
    const isBusiness = offerType === "business";
    const isInvestments = offerType === "investments";
    const isSell = listingType === "sell";
    const isBuy = listingType === "buy"

    const [categoryId, setCategoryId] = useState<string>("");
    const [cityId, setCityId] = useState<string>("");
    const [Area, setArea] = useState("");
    const [projectStageId, setProjectStageId] = useState<string>("");
    const [createOffer] = useCreateOfferMutation();
    const [publishOffer] = usePublishOfferMutation();
    const [selectedConveniences, setSelectedConveniences] = useState<number[]>([]);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const { data: filtersData } = useGetFiltersDataQuery();
    const conveniences = filtersData?.conveniences || [];
    const { data: userInfo } = useGetUserInfoQuery();

    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>([""]);
    const fullName = userInfo?.name?.trim() || "";
    const [firstName, lastName = ""] = fullName.split(" ");
    const phoneNumber = userInfo?.phone?.replace("+998", "") || "";
    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [address, setAddress] = useState("");
    const [propertyOwnershipType, setPropertyOwnershipType] = useState("");
    const [businessShare, setBusinessShare] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [profit, setProfit] = useState("");
    const [paybackPeriod, setPaybackPeriod] = useState("");
    const [FoundationYear, setFoundationYear] = useState("");
    const [businessOwnership, setBusinessOwnership] = useState("");

    const toggleConvenience = (id: number) => {
        setSelectedConveniences(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files ? Array.from(e.target.files) : [];
        setFiles(prev => [...prev, ...newFiles]);
    };
    const handleRemove = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newImages = e.target.files ? Array.from(e.target.files) : [];
        setImages(prev => [...prev, ...newImages]);
    };

    const handleImageRemove = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
    };

    const handleAddLink = () => {
        setLinks([...links, ""]);
    };

    const isNextDisabled = () => {
        return !title.trim() || !amount.trim();
    };
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const wrappedDocuments = files.map(file => ({ document: file }));
        const wrappedImages = images.map((file, index) => ({
            photo: file,
            order: index + 1
        }));
        const payload: OfferPayload = {
            title,
            description,
            listing_type: listingType,
            offer_type: offerType,
            city_id: cityId,
            address,
            category_id: categoryId,
            amount: Number(amount.replace(/\s/g, "")) || 0,
            user_name: `${firstName} ${lastName}`.trim(),
            user_phone: "+998" + phoneNumber,
            convenience_ids: selectedConveniences,
            business_type: businessOwnership,
            ...(isSell && {
                property_ownership_type: propertyOwnershipType,
                documents: wrappedDocuments,
                images: wrappedImages,
                communication_links: links.map(link => link.trim()),
                business_share: String(businessShare),
                monthly_income: String(monthlyIncome),
                profit: String(profit),
                payback_period: String(paybackPeriod),
                foundation_year: String(FoundationYear),
            }),

            ...(isStartup && {
                project_stage_id: projectStageId ? parseInt(projectStageId, 10) : undefined,
            }),
            area: Number(Area)
        };
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (key === 'documents' && Array.isArray(value)) {
                value.forEach((doc, i) => {
                    formData.append(`documents[${i}][document]`, doc.document);
                });
            } else if (key === 'images' && Array.isArray(value)) {
                value.forEach((img, i) => {
                    formData.append(`images[${i}][photo]`, img.photo);
                    formData.append(`images[${i}][order]`, img.order.toString());
                });
            } else if (Array.isArray(value)) {
                value.forEach((v) => {
                    formData.append(`${key}[]`, v);
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        try {
            const response = await createOffer(formData).unwrap();
            const id = response?.data?.id;

            if (!id) {
                console.error("Оффер создан, но ID отсутствует");
                return;
            }

            const city_name = filtersData?.cities.find(c => String(c.id) === cityId)?.name_ru || "Город не указан";

            dispatch(setOfferData({
                ...payload,
                id,
                city_name
            }));

            await publishOffer(id).unwrap();

            onNext();

        } catch (error) {
            console.error("Ошибка при создании или публикации оффера:", error);
        }
    };



    return (
        <div className="flex flex-col gap-6 p-10 bg-[#F8F8F8]">
            {/*Хединги для всех типов */}
            <div>
                {/*Для бизнеса */}
                {isBusiness &&
                    <Heading className="text-3xl font-inter text-[#101828] mb-1.5 font-semibold leading-10 space-x-[-1%]" text={"Информация о бизнесе"} level={2} />
                }
                {/*Для Франшизы */}
                {isFranchise &&
                    <Heading className="text-3xl font-inter text-[#101828] mb-1.5 font-semibold leading-10 space-x-[-1%]" text={"Информация о франшизе"} level={2} />
                }
                {/*Для Инвестиций */}
                {isInvestments &&
                    <Heading className="text-3xl font-inter text-[#101828] mb-1.5 font-semibold leading-10 space-x-[-1%]" text={"Информация об инвестициях"} level={2} />
                }
                {/*Для стартапа */}
                {isStartup &&
                    <Heading className="text-3xl font-inter text-[#101828] mb-1.5 font-semibold leading-10 space-x-[-1%]" text={"Информация о стартапе"} level={2} />
                }
                <Paragraph className="text-[#667085] font-inter text-[16px] leading-5 space-x-3.5">Заполните все необходимые данные для добавления нового объявления</Paragraph>
            </div>
            {/*Название */}
            <div className="flex flex-col gap-2">
                <Input className="bg-[#F0F1F280] w-[800px] rounded-[14px] outline-none py-3.5 px-4.5" type="text" placeholder="Введите" isError={false} LabelClassName="font-inter text-[16px] leading-[130%]" LabelText="*Название бизнеса" onChange={(e) => setTitle(e.target.value)} />
            </div>
            {/*Описание textarea */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input
                    isTextArea
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Описание"
                    placeholder="Введите текст"
                    value={description}
                    className="bg-[#F0F1F280] resize-none w-[800px] h-[118px] rounded-[14px] outline-none py-3.5 px-4.5"
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={offerType === "business" ? 3000 : 2000} isError={false} />
                <span className="absolute bottom-2 right-3 text-sm text-[#8A8A8A] font-inter">
                    {description.length}/{offerType === "business" ? 3000 : 2000}
                </span>
            </div>
            {/*Категория объявления */}
            {isSell && isBusiness &&
                <div className="flex flex-col gap-2 w-[800px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Категория объявления</label>
                    <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Выбрать</option>
                        {filtersData?.categories.map((cat) => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.title_ru}
                            </option>
                        ))}
                    </select>
                </div>
            }
            {/*Имя и фамилия*/}
            <div className="flex gap-3.5 w-[800px]">
                <div className="flex-1" >
                    <Input
                        className="bg-[#b5b5b667]  text-gray-500 cursor-not-allowed w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Имя"
                        type="text"
                        placeholder="Введите"
                        isError={false}
                        value={firstName}
                        disabled
                    />
                </div>
                <div className="flex-1 ">
                    <Input
                        className="bg-[#b5b5b667] text-gray-500 cursor-not-allowed w-full rounded-[14px] outline-none py-3.5 px-4.5"
                        LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Фамилия"
                        type="text"
                        placeholder="Введите"
                        isError={false}
                        value={lastName}
                        disabled
                    />
                </div>
            </div>
            {/*Номер телефона */}
            <div className="flex flex-col gap-2 w-[800px] relative ">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%] mb-2.5 block">*Номер телефона</label>
                <div className="bg-[#b5b5b667] w-full rounded-[14px] flex items-center p-1 ">
                    <div className="w-[48px] h-[49px] rounded-[10px] bg-[#b4b8cc] flex items-center justify-center mr-3">
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
            {isSell && isStartup &&
                <div className="flex flex-col gap-2 w-[800px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Стадия</label>
                    <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={projectStageId}
                        onChange={(e) => setProjectStageId(e.target.value)}>
                        <option className="">Выбрать</option>
                        {filtersData?.project_stages.map((stage) => (
                            <option key={stage.id} value={String(stage.id)}>
                                {stage.name_ru}
                            </option>
                        ))}
                    </select>
                </div>
            }
            {/*Город */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Город</label>
                <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}>
                    <option className="">Выбрать</option>
                    {filtersData?.cities.map((city) => (
                        <option key={city.id} value={String(city.id)}>
                            {city.name_ru}
                        </option>
                    ))}
                </select>
            </div>
            {/*Адрес */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Адрес" type="text" placeholder="Введите" isError={false}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} />
            </div>
            {/*Площадь */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Площадь" type="text" placeholder="Введите" isError={false}
                    value={Area}
                    onChange={(e) => setArea(e.target.value)} />
            </div>
            {/*Форма владения бизнесом */}
            {isSell &&
                <div className="flex flex-col gap-2 w-[393px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения бизнесом</label>
                    <select
                        className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={businessOwnership}
                        onChange={(e) => setBusinessOwnership(e.target.value)}
                    >
                        <option value="">Выбрать</option>
                        {filtersData?.business_types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label_ru}
                            </option>
                        ))}
                    </select>
                </div>
            }
            {/*Форма владения помещением */}
            {isSell && <div className="flex flex-col gap-2 w-[393px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения помещением</label>
                <select className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                    value={propertyOwnershipType}
                    onChange={(e) => setPropertyOwnershipType(e.target.value)}
                >
                    <option className="">Выбрать</option>
                    <option value="rent">Аренда</option>
                    <option value="owned">Собственность</option>
                </select>
            </div>}

            {isSell &&
                <div className="flex flex-col gap-2">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%] mb-2.5">
                        Документы и лицензии
                    </label>

                    <div className="flex gap-4 flex-wrap">
                        {files.map((file, idx) => (
                            <div
                                key={idx}
                                className="relative border border-dashed border-[#2EAA7B] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                            >
                                <button
                                    onClick={() => handleRemove(idx)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] flex items-center justify-center transition"
                                >
                                    <HiX className="text-gray-500 text-sm" />
                                </button>
                                <PdfIcon className="w-9 h-9 mb-2" />
                                <p className="text-[#232323] font-medium text-sm truncate w-full">{file.name}</p>
                                <p className="text-[#667085] text-sm">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="border border-dashed border-[#2EAA7B] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                        >
                            <div className="bg-[#EBF9F5] w-9 h-9 rounded-full flex items-center justify-center mb-2">
                                <HiPlus className="text-[#2EAA7B] text-lg" />
                            </div>
                            <p className="text-[#232323] font-medium">Загрузить документ</p>
                            <p className="text-[#667085] text-sm">Формат: PDF, Excel</p>
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
            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Сумма, сум" type="text" placeholder="Введите" isError={false}
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setAmount(e.target.value)} />
            </div>

            {isSell &&
                <div className="flex flex-col gap-2">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%] mb-2.5">
                        Изображение
                    </label>

                    <div className="flex gap-4 flex-wrap">
                        {images.map((file, idx) => (
                            <div
                                key={idx}
                                className="relative border border-dashed border-[#2EAA7B] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                            >
                                <button
                                    onClick={() => handleImageRemove(idx)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] flex items-center justify-center transition"
                                >
                                    <HiX className="text-gray-500 text-sm" />
                                </button>

                                <GalleryIcon className="w-9 h-9 mb-2" />
                                <p className="text-[#232323] font-medium text-sm truncate w-full">{file.name}</p>
                                <p className="text-[#667085] text-sm">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="border border-dashed border-[#2EAA7B] rounded-[16px] px-6 py-4 w-[260px] h-[120px] flex flex-col items-center justify-center text-center"
                        >
                            <div className="bg-[#EBF9F5] w-9 h-9 rounded-full flex items-center justify-center mb-2">
                                <HiPlus className="text-[#2EAA7B] text-lg" />
                            </div>
                            <p className="text-[#232323] font-medium">Загрузить изображение</p>
                            <p className="text-[#667085] text-sm">620×220 px</p>

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </button>
                    </div>
                </div>}

            {isSell &&
                <div className="flex flex-col w-[800px]">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">Ссылка на официальные каналы коммуникации</label>

                    {links.map((link, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Input
                                type="url"
                                value={link}
                                placeholder="https://..."
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                                isError={false}
                            />
                        </div>
                    ))}

                    <button onClick={handleAddLink} className="text-[#2EAA7B] font-inter font-semibold text-[16px] leading-[130%] underline text-left w-max">
                        + Добавить доп. канал
                    </button>
                </div>}

            {isSell &&
                <>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Доля продаваемого бизнеса" type="text" placeholder="Введите" isError={false}
                            value={businessShare}
                            onChange={(e) => setBusinessShare(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Сумма среднемесячного дохода" type="text" placeholder="Введите" isError={false}
                            onChange={(e) => setMonthlyIncome(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Сумма прибыли" type="text" placeholder="Введите" isError={false}
                            value={profit}
                            onChange={(e) => setProfit(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Окупаемость (месяц)" type="text" placeholder="Введите" isError={false}
                            value={paybackPeriod}
                            onChange={(e) => setPaybackPeriod(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Год основания бизнеса" type="text" placeholder="Введите" isError={false}
                            value={FoundationYear}
                            onChange={(e) => setFoundationYear(e.target.value)} />
                    </div>
                </>}
            {isBuy && <div className="flex flex-col gap-2 w-200 relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">Организационно правовая форма</label>
                <select
                    className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                    value={businessOwnership}
                    onChange={(e) => setBusinessOwnership(e.target.value)}
                >
                    <option value="">Выбрать</option>
                    {filtersData?.business_types.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label_ru}
                        </option>
                    ))}
                </select>
            </div>}
            {/* Детали объявления (переключатели) */}
            <Heading text={"Детали объявления"} level={3} className="font-inter font-semibold text-[#232323] text-xl leading-[130%]" />
            <div className="flex flex-col w-[393px] gap-6">
                {conveniences.map(({ id, name_ru }) => {
                    // Условия фильтрации по isFranchise и isInvestments
                    const isFranchiseOnly = [10, 11].includes(id);
                    const isInvestmentOnly = [9].includes(id);

                    if (isFranchiseOnly && !isFranchise) return null;
                    if (isInvestmentOnly && !isInvestments) return null;

                    return (
                        <label key={id} className="flex items-center justify-between cursor-pointer">
                            <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">{name_ru}</span>
                            <Input
                                type="checkbox"
                                isError={false}
                                checked={selectedConveniences.includes(id)}
                                onChange={() => toggleConvenience(id)}
                                className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
            before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
            before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                            />
                        </label>
                    );
                })}
            </div>


            <div className="mt-10">
                <Button
                    onClick={handleSubmit}
                    disabled={isNextDisabled()}
                    className={`flex items-center gap-2 ${isNextDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#2EAA7B] text-white"
                        } px-6 py-2 rounded-md`}
                >
                    Дальше <FiChevronRight />
                </Button>
            </div>
        </div>
    );
};


