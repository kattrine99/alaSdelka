import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../../components";
import { useRef, useState } from "react";
import FlagIcon from '../../../assets/Flag.svg?react';
import PdfIcon from '../../../assets/pdf.svg?react';
import GalleryIcon from '../../../assets/gallery.svg?react';
import { HiPlus, HiX } from "react-icons/hi";
import { useCreateOfferMutation, useGetFiltersDataQuery } from "../../../Store/api/Api"
import { OfferDetail, OfferPayload } from "../../../Store/api/types";
import { useDispatch } from "react-redux";
import { setOfferData } from "../../../Store/tempStorage";

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

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [parking, setParking] = useState(true);
    const [clients, setClients] = useState(true);
    const [suppliers, setSuppliers] = useState(true);
    const [equipment, setEquipment] = useState(true);
    const [importedSupplies, setImportedSupplies] = useState(true);
    const [exportContracts, setExportContracts] = useState(true);
    const [noCredit, setNoCredit] = useState(true);
    const [hasBranches, setHasBranches] = useState(true);
    const [createOffer] = useCreateOfferMutation();
    const { data: filtersData } = useGetFiltersDataQuery();

    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>([""]);

    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [propertyOwnershipType, setPropertyOwnershipType] = useState("");
    const [businessShare, setBusinessShare] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [profit, setProfit] = useState("");
    const [paybackPeriod, setPaybackPeriod] = useState("");
    const [legalForm, setLegalForm] = useState("");
    const [startupStage, setStartupStage] = useState("");
    const [isInternationalFranchise, setIsInternationalFranchise] = useState(false);
    const [hasMasterFranchise, setHasMasterFranchise] = useState(false);
    const [hasCopyrights, setHasCopyrights] = useState(false);
    const [businessOwnership, setBusinessOwnership] = useState("");


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
        const payload: OfferPayload = {
            title,
            description,
            listing_type: listingType,
            offer_type: offerType,

            city_id: +city,
            address,
            amount: amount.replace(/\s+/g, "").trim(),
            user_name: `${firstName} ${lastName}`.trim(),
            user_phone: phoneNumber,

            // Удобства
            parking,
            clients,
            suppliers,
            equipment,
            imported_supplies: importedSupplies,
            export_contracts: exportContracts,
            no_credit: noCredit,
            has_branches: hasBranches,

            ...(isSell && {
                ownership_type: businessOwnership,
                property_ownership_type: propertyOwnershipType,
                documents: files,
                images,
                communication_links: links.map(link => link.trim()),
                business_share: String(businessShare),
                monthly_income: String(monthlyIncome),
                profit: String(profit),
                payback_period: String(paybackPeriod),
            }),

            ...(isBuy && {
                legal_form: legalForm
            }),

            ...(isStartup && {
                startup_stage: startupStage
            }),

            ...(isFranchise && {
                is_international_franchise: isInternationalFranchise,
                has_master_franchise: hasMasterFranchise,
            }),

            ...(isInvestments && {
                has_copyrights: hasCopyrights
            }),
        };

        try {
            const response = await createOffer(payload as Partial<OfferDetail>).unwrap();
            console.log("Успешно создано:", response);
            dispatch(setOfferData(payload));
            onNext();
        } catch (error) {
            console.error("Ошибка при создании:", error);
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Выбрать</option>
                        {filtersData?.categories.map((cat) => (
                            <option key={cat.id} value={cat.title_ru}>
                                {cat.title_ru}
                            </option>
                        ))}
                    </select>
                </div>
            }
            {/*Имя и фамилия*/}
            <div className="flex gap-3.5 w-[800px]">
                <div className="flex-1" >
                    <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Имя" type="text" placeholder="Введите" isError={false}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex-1 ">
                    <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Фамилия" type="text" placeholder="Введите" isError={false}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>
            {/*Номер телефона */}
            <div className="flex flex-col gap-2 w-[800px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%] mb-2.5 block">*Номер телефона</label>
                <div className="bg-[#F0F1F280] w-full rounded-[14px] flex items-center p-1 ">
                    <div className="w-[48px] h-[49px] rounded-[10px] bg-[#B4B8CC42] flex items-center justify-center mr-3">
                        <FlagIcon className="w-[25px] h-[25px] object-contain" />
                    </div>
                    <span className="text-[#101828] font-inter text-[16px] mr-2">+998</span>
                    <Input
                        type="tel"
                        placeholder="90 000 00 00"
                        className="bg-transparent outline-none w-full text-[#101828] font-inter text-[16px] placeholder:text-[#8A8A8A]" isError={false}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
            </div>
            {/*Стадия */}
            {isSell && isStartup &&
                <div className="flex flex-col gap-2 w-[800px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Стадия</label>
                    <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={startupStage}
                        onChange={(e) => setStartupStage(e.target.value)}>
                        <option className="">Выбрать</option>
                        {filtersData?.project_stages.map((stage) => (
                            <option key={stage.id} value={stage.name_ru}>
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}>
                    <option className="">Выбрать</option>
                    {filtersData?.cities.map((city) => (
                        <option key={city.id} value={city.name_ru}>
                            {city.name_ru}
                        </option>
                    ))}
                </select>
            </div>
            {/*Адрес */}
            {isSell && <div className="flex flex-col gap-2 w-[800px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Адрес" type="text" placeholder="Введите" isError={false}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} />
            </div>}
            {/*Форма владения бизнесом */}
            {isSell && isBusiness &&
                <div className="flex flex-col gap-2 w-[393px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения бизнесом</label>
                    <select
                        className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                        value={businessOwnership}
                        onChange={(e) => setBusinessOwnership(e.target.value)}
                    >
                        <option value="">Выбрать</option>
                        {filtersData?.business_types.map((type) => (
                            <option key={type.value} value={type.label_ru}>
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
                    LabelText="*Сумма" type="text" placeholder="Введите" isError={false}
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
                </>}
            {isBuy && <div className="flex flex-col gap-2 w-200 relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">Организационно правовая форма</label>
                <select
                    className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5"
                    value={legalForm}
                    onChange={(e) => setLegalForm(e.target.value)}
                >
                    <option value="">Выбрать</option>
                    {/*{filtersData?.legal_forms.map((form) => (
                        <option key={form.id} value={form.name_ru}>
                            {form.name_ru}
                        </option>
                    ))}*/}
                </select>
            </div>}
            {/* Детали объявления (переключатели) */}
            <Heading text={"Детали объявления"} level={3} className="font-inter font-semibold text-[#232323] text-xl leading-[130%]" />
            <div className="flex flex-col w-[393px] gap-6">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[#101828] font-inter w-full text-[16px] leading-[130%]">Парковка</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={parking}
                        onChange={() => setParking(!parking)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">База клиентов</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={clients}
                        onChange={() => setClients(!clients)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">База поставщиков</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={suppliers}
                        onChange={() => setSuppliers(!suppliers)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Оборудование и активы</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={equipment}
                        onChange={() => setEquipment(!equipment)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Поставки из-за рубежа</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={importedSupplies}
                        onChange={() => setImportedSupplies(!importedSupplies)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Контракты на экспорт</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={exportContracts}
                        onChange={() => setExportContracts(!exportContracts)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Отсутствие кредита</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={noCredit}
                        onChange={() => setNoCredit(!noCredit)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Наличие филиалов</span>
                    <Input
                        type="checkbox"
                        isError={false}
                        checked={hasBranches}
                        onChange={() => setHasBranches(!hasBranches)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>
                {isFranchise &&
                    <div className="flex flex-col w-[393px] gap-6">
                        <label className="flex items-center justify-between w-full cursor-pointer">
                            <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Международная франшиза</span>
                            <Input
                                type="checkbox"
                                isError={false}
                                checked={isInternationalFranchise}
                                onChange={() => setIsInternationalFranchise(!isInternationalFranchise)}
                                className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
  before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
  before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                            />
                        </label>
                        <label className="flex items-center justify-between w-full cursor-pointer">
                            <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Наличие мастер франшизы</span>
                            <Input
                                type="checkbox"
                                isError={false}
                                checked={hasMasterFranchise}
                                onChange={() => setHasMasterFranchise(!hasMasterFranchise)}
                                className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
  before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
  before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                            />
                        </label>
                    </div>
                }
                {isInvestments &&
                    <div className="flex flex-col w-[393px] gap-6">
                        <label className="flex items-center justify-between w-full cursor-pointer">
                            <span className="text-[#101828] w-full font-inter text-[16px] leading-[130%]">Авторские права</span>
                            <Input
                                type="checkbox"
                                isError={false}
                                checked={hasCopyrights}
                                onChange={() => setHasCopyrights(!hasCopyrights)}
                                className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
  before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
  before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                            />
                        </label>
                    </div>
                }

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


