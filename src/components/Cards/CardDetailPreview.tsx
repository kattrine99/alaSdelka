import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { Button, Heading, Paragraph, PhotosSwiper } from "../index";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { FaBuilding, FaCopyright, FaGlobe, FaGlobeAmericas, FaParking, FaShoppingBasket, FaTools, FaUniversity, FaUsers } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { JSX, useEffect, useState } from "react";
import { useGetFiltersDataQuery } from "../../Store/api/Api";
import GpsIcon from '../../assets/gps.svg?react'
import CategoryIcon from '../../assets/frame.svg?react'
import CalendarIcon from "../../assets/calendar.svg?react"
import DollarCircleIcon from "../../assets/dollar-circle.svg?react"
import MoneySendIcon from "../../assets/money-send.svg?react"
import PercentIcon from "../../assets/percentage-square.svg?react"
import ReceiptIcon from "../../assets/receipt-item.svg?react"
import WalletIcon from "../../assets/wallet-add.svg?react"
interface CardDetailPreviewProps {
    onBack: () => void;
}

export const CardDetailPreview: React.FC<CardDetailPreviewProps> = ({ onBack }) => {

    const conveniencesIcons: Record<string, JSX.Element> = {
        "Парковка": <FaParking className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "База клиентов": <FaUsers className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "База поставщиков": <FaShoppingBasket className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Оборудование и активы": <FaTools className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Поставки из-за рубежа": <FaGlobeAmericas className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Контракты на экспорт": <RiContactsFill className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Отсутствие кредита": <MdOutlineCreditCardOff className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Наличие филиалов": <FaBuilding className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Авторские права": <FaCopyright className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Международная франшиза": <FaGlobe className="w-[40px] h-[40px] text-[#7E7E7E]" />,
        "Наличие мастер франшизи": <FaUniversity className="w-[40px] h-[40px] text-[#7E7E7E]" />,
    };
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { data: filtersData } = useGetFiltersDataQuery();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const data = useSelector((state: RootState) => state.tempOffer.offerData);
    useEffect(() => {
        if (!data?.images) return;

        const urls = data.images.map(img => {
            if (img.photo instanceof File) {
                return URL.createObjectURL(img.photo);
            }
            return img.photo;
        });

        setPreviewUrls(urls);

        return () => {
            urls.forEach(url => {
                if (url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [data?.images]);



    if (!data) return <Paragraph>Нет данных для предпросмотра</Paragraph>;
    const conveniences = data.conveniences ?? [];
    const convenienceMap = filtersData?.conveniences?.reduce((acc, item) => {
        acc[item.id] = item.name_ru;
        return acc;
    }, {} as Record<number, string>) ?? {};
    const categoryName =
        filtersData?.categories?.find((c) => c.id === Number(data?.category_id))?.title_ru || "Категория не указана";

    return (
        <div className="px-[192px] py-10 ">
            <div className="mb-6 flex items-center gap-2 cursor-pointer text-[#28B13D]" onClick={onBack}>
                <HiOutlineArrowNarrowLeft className="w-5 h-5" />
                <span className="font-medium text-[15px]">Предварительный просмотр вашего объявления</span>
            </div>

            {/* Основной блок */}
            <div className="bg-[#F8F8F8] p-10">
                <Heading level={2} text={data.title || "Название"} className="text-[24px] mb-3.75" />
                <div className='flex gap-1.5'>
                    <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                    <Paragraph className="text-[#667085] text-sm mb-2">
                        {data.city_name ?? ""}, {data.address?.address ?? "Адрес не указан"}
                    </Paragraph>
                </div>
                <div className='flex gap-1.5 mb-2 items-center'>
                    <GpsIcon className='w-4 h-4' />
                    <Paragraph>{data.area} кв. м.</Paragraph>
                </div>
                <div className='flex gap-1.5 items-center mb-3.75'>
                    <CategoryIcon className='w-4 h-4 text-[#2EAA7B]' />
                    <Paragraph className="">{categoryName}</Paragraph>

                </div>
                {/* Изображение */}
                <div className="flex-1">
                    {data.images && data.images.length > 0 && (
                        <div className="mb-6">
                            {previewUrls.length > 0 && (
                                <div className="mb-6">
                                    <PhotosSwiper
                                        photos={previewUrls.map(url => ({ photo: url }))}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Удобства */}
                <div className="mb-6">
                    <Heading level={3} text="Удобства" className="text-[18px] mb-2" />
                    <div className="grid grid-cols-5 gap-x-12.5 gap-y-4">
                        {conveniences.map((id) => {
                            const name = convenienceMap[id];
                            if (!name) return null;

                            return (
                                <div key={id} className="flex gap-3 text-sm text-gray-700">
                                    {conveniencesIcons[name] ?? <span className="w-[40px] h-[40px]" />}
                                    <div className="flex flex-col">
                                        <span>{name}</span>
                                        <span className='font-inter font-bold text-xl text-[#2EAA7B]'>Есть</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
                {data.documents && data.documents.length > 0 && (
                    <div>
                        <Heading text={'Документация'} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                        <div className="flex flex-wrap gap-4 mt-3">
                            {data.documents.map((doc, index) => (
                                <a
                                    key={index}
                                    href={URL.createObjectURL(doc)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" w-65.75 border border-[#2EAA7B] text-[#191919] rounded-lg py-3 px-4 text-center hover:bg-[#2EAA7B] hover:text-white transition"
                                >
                                    {doc.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Описание */}
                <div className="mb-6">
                    <Heading level={3} text="Описание" className="text-[18px] mb-2" />
                    <div className="mt-3">
                        <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {showFullDescription
                                ? data.description
                                : data.description.slice(0, 300) + (data.description.length > 300 ? "..." : "")}
                        </Paragraph>

                        {data.description.length > 300 && (
                            <Button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-[#2EAA7B] mt-2 font-semibold hover:underline transition"
                            >
                                {showFullDescription ? "Скрыть" : "Читать дальше"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Финансы */}
                <div className="mb-6">
                    <Heading level={3} text="Информация и финансы" className="text-[18px] mb-2" />
                    <div className="mt-3 w-203.25 flex flex-wrap gap-x-3 gap-y-4">
                        <div className="flex w-65.75 gap-2 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <WalletIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячная выручка</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.average_monthly_revenue} сум</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <ReceiptIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячные расходы</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.average_monthly_expenses} сум</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <CalendarIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Дата основания</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.foundation_year} год</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <DollarCircleIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячная прибыль</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.average_monthly_profit} сум</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <MoneySendIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Окупаемость</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.payback_period} месяцев</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                            <PercentIcon className='w-10 h-10' />
                            <div className='flex flex-col'>
                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Доля к продаже</Paragraph>
                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{data.percentage_for_sale} %</Paragraph>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Локация */}
                <div>
                    <Heading level={3} text="Местоположение" className="text-[18px] mb-2" />
                    <Paragraph className="flex items-center text-[#667085] text-[14px]">
                        <FaLocationDot className="text-[#2EAA7B] mr-2" />
                        {data.city_name}, {data.address?.address}
                    </Paragraph>
                    {data.address?.latitude && data.address?.longitude ? (
                        <iframe
                            src={`https://maps.google.com/maps?q=${data.address.latitude},${data.address.longitude}&z=15&output=embed`}
                            width="100%"
                            height="350"
                            className="rounded-lg border border-[#2EAA7B]"
                            allowFullScreen
                            loading="eager"
                        />
                    ) : data.address?.address ? (
                        <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(data.address.address)}&z=15&output=embed`}
                            width="100%"
                            height="350"
                            className="rounded-lg border border-[#2EAA7B]"
                            allowFullScreen
                            loading="eager"
                        />
                    ) : (
                        <Paragraph className="text-gray-500">Адрес недоступен</Paragraph>
                    )}
                </div>
            </div>
        </div>
    );
};
