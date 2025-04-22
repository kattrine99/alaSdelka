import { FiChevronRight } from "react-icons/fi";
import { Button, Heading, Input, Paragraph } from "../../../components";
import { useState } from "react";
import FlagIcon from '../../../assets/Flag.svg?react';

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

            <div>
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
            <div>
                <Input className="bg-[#F0F1F280] w-full rounded-[14px] outline-none py-3.5 px-4.5" LabelClassName="font-inter text-[16px] leading-[130%]"
                    LabelText="*Адрес" type="text" placeholder="Введите" isError={false} />            </div>

            <div>
                <label>Форма владения помещением</label>
                <select className="select">
                    <option>Выбрать</option>
                </select>
            </div>

            {/* === Загрузка документов/изображений === */}
            <div>
                <label>Документы</label>
                <button className="upload-box">Загрузить документ</button>
            </div>

            <div>
                <label>Сумма</label>
                <input className="input" />
            </div>

            <div>
                <label>Изображение</label>
                <button className="upload-box">Загрузить изображение</button>
            </div>

            {/* === Поле ссылок на соцсети === */}
            <div>
                <label>Ссылки на коммуникации</label>
                <input className="input" placeholder="https://..." />
                <button className="text-green-600 underline mt-2">+ Добавить еще</button>
            </div>

            {/* === Финансовые поля === */}
            <div>
                <label>Доход</label>
                <input className="input" />
            </div>

            <div>
                <label>Средний расход</label>
                <input className="input" />
            </div>

            <div>
                <label>Сумма прибыли</label>
                <input className="input" />
            </div>

            <div>
                <label>Окупаемость (в мес.)</label>
                <input className="input" />
            </div>

            {/* === Детали объявления (переключатели) === */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Прописка
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    База клиентов
                </label>
                {/* … */}
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
