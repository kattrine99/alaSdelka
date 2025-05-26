import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../../components";
import { useMemo, useRef, useState } from "react";
import FlagIcon from '../../../assets/Flag.svg?react';
import PdfIcon from '../../../assets/pdf.svg?react';
import GalleryIcon from '../../../assets/gallery.svg?react';
import { HiPlus, HiX } from "react-icons/hi";
import { useGetFiltersDataQuery } from "../../../Store/api/Api"
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
    const [links, setLinks] = useState<Array<{ channel_name: string; link: string }>>([{ channel_name: "", link: "" }]);
    const fullName = userInfo?.name?.trim() || "";
    const phoneNumber = userInfo?.phone?.replace("+998", "") || "";
    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [addressText, setAddressText] = useState("");
    const [propertyOwnershipType, setPropertyOwnershipType] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>(0);
    const [profit, setProfit] = useState<number | undefined>(0);
    const [expences, setExpences] = useState<number | undefined>(0);
    const [percentageForSale, setpercentageForSale] = useState<number | undefined>(0);
    const [paybackPeriod, setPaybackPeriod] = useState<number | undefined>(0);
    const [FoundationYear, setFoundationYear] = useState<number | undefined>(0);
    const [businessOwnership, setBusinessOwnership] = useState("");
    const currentYear = new Date().getFullYear();
    const foundationYears = useMemo(() => {
        const years = [];
        for (let y = currentYear; y >= 1930; y--) {
            years.push(y);
        }
        return years;
    }, [currentYear]);
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
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setImages(prev => [...prev, ...fileArray]);
    };


    const handleImageRemove = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };
    const handleNumericInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setter: (val: number) => void
    ) => {
        const value = e.target.value.replace(/\D/g, "");
        setter(Number(value));
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index].link = value;
        setLinks(updatedLinks);
    };
    const handleChannelNameChange = (index: number, value: string) => {
        const updated = [...links];
        updated[index].channel_name = value;
        setLinks(updated);
    };
    const handleAddLink = () => {
        setLinks([...links, { channel_name: "", link: "" }]);
    };

    const isNextDisabled = () => {
        return !title.trim() || !amount.trim();
    };
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("listing_type", listingType);
        formData.append("offer_type", offerType);
        formData.append("category_id", categoryId);
        formData.append("price", amount.replace(/\s/g, ""));
        formData.append("user_name", fullName);
        formData.append("user_phone", "+998" + phoneNumber);
        formData.append("area", Area);

        formData.append("address[address]", addressText.trim() || "Не указан");
        formData.append("address[latitude]", "0");
        formData.append("address[longitude]", "0");
        formData.append("address[city_id]", cityId);

        selectedConveniences.forEach((id, index) => {
            formData.append(`conveniences[${index}]`, String(id));
        });

        if (isSell) {
            formData.append("premises_ownership_form", propertyOwnershipType);
            formData.append("business_type", businessOwnership);
            formData.append("average_monthly_revenue", String(monthlyIncome || 0));
            formData.append("average_monthly_profit", String(profit || 0));
            formData.append("average_monthly_expenses", String(expences || 0));
            formData.append("payback_period", String(paybackPeriod || 0));
            formData.append("percentage_for_sale", String(percentageForSale || 0));
            formData.append("foundation_year", String(FoundationYear || 0));

            files.forEach(file => {
                formData.append('documents[]', file);
            });

            images.forEach((image, idx) => {
                formData.append(`photos[${idx}][photo]`, image);
                formData.append(`photos[${idx}][order]`, String(idx));
            });


            links.forEach((link, idx) => {
                if (link.channel_name.trim() && link.link.trim()) {
                    formData.append(`communication_channels[${idx}][channel_name]`, link.channel_name.trim());
                    formData.append(`communication_channels[${idx}][link]`, link.link.trim());
                }
            });
        }

        if (isStartup) {
            formData.append("project_stage_id", projectStageId);
        }
        console.log([...formData.entries()])
        try {
            const response = await createOffer(formData).unwrap();
            const id = response?.data?.id;

            if (!id) {
                console.error("Оффер создан, но ID отсутствует");
                return;
            }

            const selectedCity = filtersData?.cities.find(c => String(c.id) === cityId);
            const city_name = selectedCity?.name_ru || "Город не указан";
            const photosFromServer = response.data.photos ?? [];

            dispatch(setOfferData({
                id,
                title,
                description,
                listing_type: listingType,
                offer_type: offerType,
                price: Number(amount.replace(/\s/g, "")) || 0,
                category_id: categoryId,
                user_name: fullName,
                user_phone: "+998" + phoneNumber,
                area: Number(Area) || 0,
                address: {
                    address: addressText.trim() || "Не указан",
                    latitude: 0,
                    longitude: 0,
                    city_id: Number(cityId) || 0,
                },
                conveniences: selectedConveniences,
                city_name,
                ...(isSell && {
                    business_type: businessOwnership,
                    premises_ownership_form: propertyOwnershipType,
                    average_monthly_revenue: monthlyIncome || 0,
                    average_monthly_profit: profit || 0,
                    average_monthly_expenses: expences || 0,
                    payback_period: paybackPeriod || 0,
                    percentage_for_sale: percentageForSale || 0,
                    foundation_year: FoundationYear || 0,
                    documents: files,
                    photos: photosFromServer,
                    communication_channels: links
                        .filter(link => link.channel_name.trim() && link.link.trim())
                        .map(link => ({
                            channel_name: link.channel_name.trim(),
                            link: link.link.trim(),
                        })),
                }),
                ...(isStartup && {
                    project_stage_id: Number(projectStageId) || 0,
                }),
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
                <Input
                    className={`bg-[#F0F1F280] w-200 rounded-[14px] outline-none py-3.5 px-4.5 ${!title ? 'border border-red-500' : ''
                        }`}
                    type="text"
                    placeholder="Введите"
                    isError={!title}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                    LabelText="*Название бизнеса"
                />
                {!title && (
                    <p className="text-red-500 text-sm">Пожалуйста, введите название бизнеса</p>
                )}
            </div>
            {/*Описание textarea */}
            <div className="flex flex-col gap-2 w-full max-w-[800px] relative">
                <Input
                    isTextArea
                    required
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Описание"
                    placeholder="Введите текст"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`bg-[#F0F1F280] resize-none w-full h-[118px] rounded-[14px] outline-none py-3.5 px-4.5 ${!description ? 'border border-red-500' : ''
                        }`}
                    maxLength={offerType === "business" ? 3000 : 2000}
                    isError={!description}
                />
                <span className="absolute bottom-2 right-3 text-sm text-[#8A8A8A] font-inter">
                    {description.length}/{offerType === "business" ? 3000 : 2000}
                </span>
                {!description && (
                    <p className="text-red-500 text-sm">Пожалуйста, введите описание</p>
                )}
            </div>
            {/*Категория объявления */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Категория объявления</label>
                <select
                    required
                    className={`bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!categoryId ? 'border border-red-500' : ''
                        }`}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Выбрать</option>
                    {filtersData?.categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                            {cat.title_ru}
                        </option>
                    ))}
                </select>
                {!categoryId && (
                    <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите категорию</p>
                )}
            </div>

            {/*Имя и фамилия*/}
            <div className="flex gap-3.5 w-200">
                <Input
                    className="bg-[#b5b5b667]  text-gray-500 cursor-not-allowed w-full rounded-[14px] outline-none py-3.5 px-4.5"
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Имя Фамилия"
                    type="text"
                    placeholder="Введите"
                    isError={false}
                    value={fullName}
                    disabled
                />
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
                    <select className={`bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!projectStageId ? 'border border-red-500' : ''
                        }`}
                        value={projectStageId}
                        onChange={(e) => setProjectStageId(e.target.value)}>
                        <option className="">Выбрать</option>
                        {filtersData?.project_stages.map((stage) => (
                            <option key={stage.id} value={String(stage.id)}>
                                {stage.name_ru}
                            </option>
                        ))}
                    </select>
                    {!projectStageId && (
                        <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите стадию проекта</p>
                    )}
                </div>
            }
            {/*Город */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Город</label>
                <select className={`bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!cityId ? 'border border-red-500' : ''
                    }`}
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}>
                    <option className="">Выбрать</option>
                    {filtersData?.cities.map((city) => (
                        <option key={city.id} value={String(city.id)}>
                            {city.name_ru}
                        </option>
                    ))}
                </select>
                {!cityId && (
                    <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите город</p>
                )}
            </div>
            {/*Адрес */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input className={`bg-[#F0F1F280] w-200 rounded-[14px] outline-none py-3.5 px-4.5 ${!addressText ? 'border border-red-500' : ''
                    }`}
                    LabelText="*Адрес" type="text" placeholder="Введите" isError={!addressText}
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)} />
                {!addressText && (
                    <p className="text-red-500 text-sm">Пожалуйста, введите Адрес</p>
                )}
            </div>
            {/*Площадь */}
            <Input
                className="bg-[#F0F1F280] w-200 rounded-[14px] outline-none py-3.5 px-4.5"
                LabelClassName="font-inter text-[16px] leading-[130%] block mb-3"
                LabelText="Площадь, кв. м."
                type="text"
                placeholder="Введите"
                isError={false}
                value={Area}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setArea(value);
                }}
            />
            {/*Форма владения бизнесом */}
            {isSell &&
                <div className="flex flex-col gap-2 w-[393px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения бизнесом</label>
                    <select
                        className={`bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!businessOwnership ? 'border border-red-500' : ''
                            }`}
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
                    {!businessOwnership && (
                        <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите форму</p>
                    )}
                </div>
            }
            {/*Форма владения помещением */}
            {isSell && <div className="flex flex-col gap-2 w-[393px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения помещением</label>
                <select className={`bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5 ${!propertyOwnershipType ? 'border border-red-500' : ''
                    }`}
                    value={propertyOwnershipType}
                    onChange={(e) => setPropertyOwnershipType(e.target.value)}
                >
                    <option className="">Выбрать</option>
                    {filtersData?.premises_ownership_form.map((form) => (
                        <option key={form.value} value={String(form.value)}>
                            {form.label_ru}
                        </option>
                    ))}
                </select>
                {!propertyOwnershipType && (
                    <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите форму</p>
                )}
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
                <Input className={`bg-[#F0F1F280] w-200 rounded-[14px] outline-none py-3.5 px-4.5 ${!amount ? 'border border-red-500' : ''
                    }`} LabelText="*Сумма, сум" type="text" placeholder="Введите" isError={false}
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        setAmount(formatted);
                    }} />
                {!amount && (
                    <p className="text-red-500 text-sm">Пожалуйста, введите сумму</p>
                )}
            </div>

            {/*Изображения */}
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
            {isSell && (
                <div className="flex flex-col w-[800px]">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">Ссылка на официальные каналы коммуникации</label>

                    {links.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Input
                                type="text"
                                value={item.channel_name}
                                placeholder="Например: Telegram"
                                onChange={(e) => handleChannelNameChange(index, e.target.value)}
                                className="bg-[#F0F1F280] w-60 rounded-[14px] outline-none py-3.5 px-4.5"
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
                        className="text-[#2EAA7B] font-inter font-semibold text-[16px] leading-[130%] underline text-left w-max mt-2"
                    >
                        + Добавить доп. канал
                    </button>
                </div>
            )}

            {isSell &&
                <>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input
                            className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                            LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Доля продаваемого бизнеса"
                            type="text"
                            placeholder="Введите"
                            isError={false}
                            value={String(percentageForSale)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                const value = e.target.value.replace(/\D/g, ""); // только цифры
                                const numeric = Math.min(Number(value), 100);   // ограничиваем до 100
                                setpercentageForSale(numeric);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input
                            className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                            LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Сумма среднемесячного дохода"
                            type="text"
                            placeholder="Введите"
                            isError={false}
                            value={monthlyIncome?.toLocaleString("ru-RU").replace(/,/g, " ")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                const rawValue = e.target.value.replace(/\D/g, "");
                                setMonthlyIncome(Number(rawValue));
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input
                            className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                            LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Сумма среднемесячного расхода"
                            type="text"
                            placeholder="Введите"
                            isError={false}
                            value={expences?.toLocaleString("ru-RU").replace(/,/g, " ")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                const rawValue = e.target.value.replace(/\D/g, "");
                                setExpences(Number(rawValue));
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input
                            className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5"
                            LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Сумма прибыли"
                            type="text"
                            placeholder="Введите"
                            isError={false}
                            value={profit?.toLocaleString("ru-RU").replace(/,/g, " ")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                const rawValue = e.target.value.replace(/\D/g, "");
                                setProfit(Number(rawValue));
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                            LabelText="Окупаемость (месяц)" type="text" placeholder="Введите" isError={false}
                            value={String(paybackPeriod)}
                            onChange={(e) => handleNumericInput(e, setPaybackPeriod)} />
                    </div>
                    <div className="flex flex-col gap-2 w-[393px] relative">
                        <label className="text-[#101828] font-inter text-[16px] leading-[130%]">Год основания бизнеса</label>
                        <select
                            className="bg-[#F0F1F280] w-full rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                            value={String(FoundationYear)}
                            onChange={(e) => setFoundationYear(Number(e.target.value))}
                        >
                            <option value="">Выбрать</option>
                            {foundationYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
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

