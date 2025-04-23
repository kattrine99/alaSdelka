import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../../components";
import { useRef, useState } from "react";
import FlagIcon from '../../../assets/Flag.svg?react';
import PdfIcon from '../../../assets/pdf.svg?react';
import GalleryIcon from '../../../assets/gallery.svg?react';
import { HiPlus, HiX } from "react-icons/hi";

interface Props {
    category: "Бизнес" | "Франшиза" | "Стартап" | "Инвестиции";
    onNext: () => void;
}

export const InformationStep: React.FC<Props> = ({ category, onNext }) => {
    const isFranchise = category === "Франшиза";
    const isStartup = category === "Стартап";
    const isBusiness = category === "Бизнес";
    const isInvestments = category === "Инвестиции";

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

    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>([""]);

    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);


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
        return title.trim() === "" || amount.trim() === "";
    };
    return (
        <div className="flex flex-col gap-6 p-10 bg-[#F8F8F8]">
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

            <div className="flex flex-col gap-2">
                <label className=""></label>
                <Input className="bg-[#F0F1F280] w-[800px] rounded-[14px] outline-none py-3.5 px-4.5" type="text" placeholder="Введите" isError={false} LabelClassName="font-inter text-[16px] leading-[130%]" LabelText="*Название бизнеса" onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input
                    isTextArea
                    LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Описание"
                    placeholder="Введите текст"
                    value={description}
                    className="bg-[#F0F1F280] resize-none w-[800px] h-[118px] rounded-[14px] outline-none py-3.5 px-4.5"
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={category === "Бизнес" ? 3000 : 2000} isError={false} />
                <span className="absolute bottom-2 right-3 text-sm text-[#8A8A8A] font-inter">
                    {description.length}/{category === "Бизнес" ? 3000 : 2000}
                </span>
            </div>
            {isBusiness &&
                <div className="flex flex-col gap-2 w-[800px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Категория объявления</label>
                    <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5">
                        <option className="">Выбрать</option>
                    </select>
                </div>
            }
            <div className="flex gap-3.5 w-[800px]">
                <div className="flex-1" >
                    <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Имя" type="text" placeholder="Введите" isError={false} />
                </div>
                <div className="flex-1 ">
                    <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                        LabelText="*Фамилия" type="text" placeholder="Введите" isError={false} />
                </div>
            </div>

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
                        className="bg-transparent outline-none w-full text-[#101828] font-inter text-[16px] placeholder:text-[#8A8A8A]" isError={false} />
                </div>
            </div>
            {isStartup &&
                <div className="flex flex-col gap-2 w-[800px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Стадия</label>
                    <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5">
                        <option className="">Выбрать</option>
                    </select>
                </div>
            }
            <div className="flex flex-col gap-2 w-[800px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Город</label>
                <select className="bg-[#F0F1F280] w-[800px] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5">
                    <option className="">Выбрать</option>
                </select>
            </div>
            <div className="flex flex-col gap-2 w-[800px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Адрес" type="text" placeholder="Введите" isError={false} />
            </div>
            {isBusiness &&
                <div className="flex flex-col gap-2 w-[393px] relative">
                    <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения бизнесом</label>
                    <select className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5">
                        <option className="">Выбрать</option>
                    </select>
                </div>
            }
            <div className="flex flex-col gap-2 w-[393px] relative">
                <label className="text-[#101828] font-inter text-[16px] leading-[130%]">*Форма владения помещением</label>
                <select className="bg-[#F0F1F280] rounded-[14px] text-[#686A70] outline-none py-3.5 px-4.5">
                    <option className="">Выбрать</option>
                </select>
            </div>

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
            </div>

            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Сумма" type="text" placeholder="Введите" isError={false} />
            </div>

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
            </div>

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
            </div>

            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="Доля продаваемого бизнеса" type="text" placeholder="Введите" isError={false} />
            </div>
            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="Сумма среднемесячного дохода" type="text" placeholder="Введите" isError={false} />
            </div>

            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="Сумма прибыли" type="text" placeholder="Введите" isError={false} />
            </div>
            <div className="flex flex-col gap-2 w-[393px] relative">
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="Окупаемость (месяц)" type="text" placeholder="Введите" isError={false} />
            </div>

            {/* Детали объявления (переключатели) */}
            <Heading text={"Детали объявления"} level={3} className="font-inter font-semibold text-[#232323] text-xl leading-[130%]" />
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-20 gap-y-5 w-[800px]">
                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Парковка</span>
                    <input
                        type="checkbox"
                        checked={parking}
                        onChange={() => setParking(!parking)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">База клиентов</span>
                    <input
                        type="checkbox"
                        checked={clients}
                        onChange={() => setClients(!clients)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">База поставщиков</span>
                    <input
                        type="checkbox"
                        checked={suppliers}
                        onChange={() => setSuppliers(!suppliers)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Оборудование и активы</span>
                    <input
                        type="checkbox"
                        checked={equipment}
                        onChange={() => setEquipment(!equipment)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Поставки из-за рубежа</span>
                    <input
                        type="checkbox"
                        checked={importedSupplies}
                        onChange={() => setImportedSupplies(!importedSupplies)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Контракты на экспорт</span>
                    <input
                        type="checkbox"
                        checked={exportContracts}
                        onChange={() => setExportContracts(!exportContracts)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Отсутствие кредита</span>
                    <input
                        type="checkbox"
                        checked={noCredit}
                        onChange={() => setNoCredit(!noCredit)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>

                <label className="flex items-center justify-between w-full cursor-pointer">
                    <span className="text-[#101828] font-inter text-[16px] leading-[130%]">Наличие филиалов</span>
                    <input
                        type="checkbox"
                        checked={hasBranches}
                        onChange={() => setHasBranches(!hasBranches)}
                        className="appearance-none w-[44px] h-[24px] bg-gray-300 rounded-full relative transition-all duration-300 checked:bg-[#2EAA7B]
      before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:w-[20px] before:h-[20px]
      before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-[20px]"
                    />
                </label>
            </div>

            <div className="mt-10">
                <Button
                    onClick={onNext}
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
