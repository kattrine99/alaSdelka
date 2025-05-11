import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { Heading, Paragraph, PhotosSwiper } from "../index";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { FaBuilding, FaCopyright, FaGlobe, FaGlobeAmericas, FaParking, FaShoppingBasket, FaTools, FaUniversity, FaUsers } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { JSX, useEffect } from "react";

interface CardDetailPreviewProps {
    onBack: () => void;
}

export const CardDetailPreview: React.FC<CardDetailPreviewProps> = ({ onBack }) => {

    const conveniencesIcons: Record<string, JSX.Element> = {
        "Парковка": <FaParking className="w-10 h-10 text-[#7E7E7E]" />,
        "База клиентов": <FaUsers className="w-10 h-10 text-[#7E7E7E]" />,
        "База поставщиков": <FaShoppingBasket className="w-10 h-10 text-[#7E7E7E]" />,
        "Оборудование и активы": <FaTools className="w-10 h-10 text-[#7E7E7E]" />,
        "Поставки из-за рубежа": <FaGlobeAmericas className="w-10 h-10 text-[#7E7E7E]" />,
        "Контракты на экспорт": <RiContactsFill className="w-10 h-10 text-[#7E7E7E]" />,
        "Отсутствие кредита": <MdOutlineCreditCardOff className="w-10 h-10 text-[#7E7E7E]" />,
        "Наличие филиалов": <FaBuilding className="w-10 h-10 text-[#7E7E7E]" />,
        "Авторские права": <FaCopyright className="w-10 h-10 text-[#7E7E7E]" />,
        "Международная франшиза": <FaGlobe className="w-10 h-10 text-[#7E7E7E]" />,
        "Наличие мастер франшизи": <FaUniversity className="w-10 h-10 text-[#7E7E7E]" />,
    };
    const data = useSelector((state: RootState) => state.tempOffer.offerData);
    useEffect(() => {
        return () => {
            data?.images?.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        };
    }, [data?.images]);
    if (!data) return <Paragraph>Нет данных для предпросмотра</Paragraph>;

    const conveniences = data.conveniences ?? [];

    return (
        <div className="px-[192px] py-10 ">
            <div className="mb-6 flex items-center gap-2 cursor-pointer text-[#28B13D]" onClick={onBack}>
                <HiOutlineArrowNarrowLeft className="w-5 h-5" />
                <span className="font-medium text-[15px]">Предварительный просмотр вашего объявления</span>
            </div>

            {/* Основной блок */}
            <div className="bg-[#F8F8F8] p-10   ">
                <Heading level={2} text={data.title || "Название"} className="text-[24px] mb-3.75" />
                <div className='flex gap-1.5'>
                    <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                    <Paragraph className="text-[#667085] text-sm mb-6">
                        {data.city_name ?? ""},
                        {data.address ?? "Адрес не указан"}
                    </Paragraph>
                </div>

                {/* Изображение */}
                <div className="flex-1">
                    {data.images && data.images.length > 0 && (
                        <div className="mb-6">
                            <PhotosSwiper
                                photos={data.images.map((file) => ({
                                    photo: URL.createObjectURL(file),
                                }))}
                            />
                        </div>
                    )}
                </div>

                {/* Удобства */}
                <div className="mb-6">
                    <Heading level={3} text="Удобства" className="text-[18px] mb-2" />
                    <div className="grid grid-cols-5 gap-x-12.5 gap-y-4">
                        {conveniences.map(name => (
                            <div key={name} className="flex items-center gap-3 text-sm text-gray-700">
                                {conveniencesIcons[name] ?? <span className="w-10 h-10" />}
                                <div className="flex flex-col">
                                    <span>{name}</span>
                                    <span className='font-inter font-bold text-xl text-[#2EAA7B]'>Есть</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Описание */}
                <div className="mb-6">
                    <Heading level={3} text="Описание" className="text-[18px] mb-2" />
                    <Paragraph>{data.description}</Paragraph>
                </div>

                {/* Финансы */}
                <div className="mb-6">
                    <Heading level={3} text="Информация и финансы" className="text-[18px] mb-2" />
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <li>Цена: <strong>{data.amount?.toLocaleString()} сум</strong></li>
                        <li>Доход: <strong>{data.monthly_income} сум</strong></li>
                        <li>Прибыль: <strong>{data.profit} сум</strong></li>
                        <li>Окупаемость: <strong>{data.payback_period} месяцев</strong></li>
                        <li>Доля бизнеса: <strong>{data.business_share}%</strong></li>
                    </ul>
                </div>

                {/* Локация */}
                <div>
                    <Heading level={3} text="Местоположение" className="text-[18px] mb-2" />
                    <Paragraph className="flex items-center text-[#667085] text-[14px]">
                        <FaLocationDot className="text-[#2EAA7B] mr-2" />
                        {data.city_name}, {data.address}
                    </Paragraph>
                </div>
            </div>
        </div>
    );
};
