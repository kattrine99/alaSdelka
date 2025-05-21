import { useParams } from 'react-router-dom';
import { Breadcrumbs, Button, Footer, Header, Heading, Paragraph, PhotosSwiper } from '../../components/index';
import { useGetOfferByIdQuery, useDownloadOfferDocumentsQuery } from "../../Store/api/Api";
import { FaLocationDot } from "react-icons/fa6";
import { FaParking, FaUsers, FaShoppingBasket, FaTools, FaGlobeAmericas, FaBuilding, FaCopyright, FaGlobe, FaUniversity } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { BiSolidArchiveIn } from "react-icons/bi";
import CalendarIcon from "../../assets/calendar.svg?react"
import DollarCircleIcon from "../../assets/dollar-circle.svg?react"
import MoneySendIcon from "../../assets/money-send.svg?react"
import PercentIcon from "../../assets/percentage-square.svg?react"
import ReceiptIcon from "../../assets/receipt-item.svg?react"
import WalletIcon from "../../assets/wallet-add.svg?react"
import GpsIcon from '../../assets/gps.svg?react'
import CategoryIcon from '../../assets/frame.svg?react'
import { JSX, useState } from 'react';
import { SellerInfoCard } from './SellerInfoCard/SellerInfoCard';

export const CardDetailPage = () => {
    const { id, category } = useParams();
    const offerId = Number(id);
    const { data, isLoading, isError } = useGetOfferByIdQuery(offerId);
    const card = data?.data;
    const [showFullDescription, setShowFullDescription] = useState(false);

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
    const { refetch } = useDownloadOfferDocumentsQuery(card?.id ?? 0, {
        skip: !card?.id,
    });

    const handleDownloadAllDocuments = async () => {
        if (!card?.id) return;

        try {
            const result = await refetch();
            const blob = result.data;

            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `documents_offer_${card.id}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Ошибка при скачивании архива:", error);
        }
    };

    return (
        <div className="w-screen">
            <Header />
            {isLoading ? (<div className="flex justify-center items-center py-[30px]">
                <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
            </div>) : isError || !card ? (
                <p className="px-48 py-7.5 text-red-500">Ошибка загрузки данных</p>

            ) :
                (
                    <div className=' px-48 py-7.5 '>
                        <Breadcrumbs category={category} title={card.title} />
                        <div className='flex'>
                            <div className='flex flex-col w-full '>
                                <Heading className="text-4xl font-inter leading-10 font-bold mt-6 mb-3.5" text={card.title} level={2} />
                                <div className='flex flex-col gap-2 mb-[15px]'>
                                    <Paragraph className="font-inter font-bold text-[1rem] text-[#363636]">ID {card.id}</Paragraph>
                                    <div className='flex gap-1.5'>
                                        <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                                        <Paragraph className="">
                                            {card?.address?.address ?? "Адрес не указан"},
                                            {card?.address?.city?.name_ru ?? ""}
                                        </Paragraph>
                                    </div>
                                    <div className='flex gap-1.5 items-center'>
                                        <GpsIcon className='w-4 h-4' />
                                        <Paragraph>{card.area} кв. м.</Paragraph>

                                    </div>
                                    <div className='flex gap-1.5 items-center'>
                                        <CategoryIcon className='w-4 h-4 text-[#2EAA7B]' />
                                        <Paragraph className="">{card?.category?.title_ru ?? ""}</Paragraph>

                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex-1">
                                        {card.photos?.length > 0 && (
                                            <PhotosSwiper photos={card.photos} />
                                        )}
                                    </div>
                                    {card.conveniences && card.conveniences.length > 0 && (
                                        <div className='w-[49.63rem]'>
                                            <Heading text={'Удобства'} level={3} className='font-inter font-semibold text-xl text-[#3A3A3A]' />
                                            <div className="mt-3">
                                                <div className="flex flex-wrap gap-x-12.5 gap-y-4">
                                                    {card.conveniences.map(item => (
                                                        <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                                                            {conveniencesIcons[item.name_ru] || <span className="w-5 h-5" />}
                                                            <div className="flex flex-col">
                                                                <span>{item.name_ru}</span>
                                                                <span className='font-inter font-bold text-xl text-[#2EAA7B]'>Есть</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </div>
                                {card.documents && card.documents.length > 0 &&
                                    <div>
                                        <Heading text={'Документация'} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                        <div className="flex flex-wrap gap-4 mt-3">
                                            {card.documents.map((doc, index) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.document}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className=" w-65.75 border border-[#2EAA7B] text-[#191919] rounded-lg py-3 px-4 text-center hover:bg-[#2EAA7B] hover:text-white transition"
                                                >
                                                    {`document ${index + 1}`}
                                                </a>
                                            ))}
                                        </div>
                                        <Button
                                            disabled={!card?.documents?.length}
                                            onClick={handleDownloadAllDocuments}
                                            className={`w-65.75 rounded-lg px-4.25 py-3 my-4.25 font-semibold flex gap-2 items-center transition ${card?.documents?.length ? 'bg-[#2EAA7B] text-white hover:bg-[#31B683]' : 'bg-gray-400 text-white cursor-not-allowed'
                                                }`}
                                        >
                                            <BiSolidArchiveIn />
                                            Скачать все документы
                                        </Button>
                                    </div>

                                }

                                {card.description && (
                                    <div>
                                        <Heading text={'Описание'} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                        <div className="mt-3">
                                            <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {showFullDescription
                                                    ? card.description
                                                    : card.description.slice(0, 300) + (card.description.length > 300 ? "..." : "")}
                                            </Paragraph>

                                            {card.description.length > 300 && (
                                                <Button
                                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                                    className="text-[#2EAA7B] mt-2 font-semibold hover:underline transition"
                                                >
                                                    {showFullDescription ? "Скрыть" : "Читать дальше"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <Heading text={'Информация и финансы'} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                    <div className="mt-3 w-203.25 flex flex-wrap gap-x-3 gap-y-4">
                                        <div className="flex w-65.75 gap-2 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <WalletIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячная выручка</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.average_monthly_revenue} сум</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <ReceiptIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячные расходы</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.average_monthly_expenses} сум</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <CalendarIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Дата основания</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.foundation_year} год</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <DollarCircleIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Среднемесячная прибыль</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.average_monthly_profit} сум</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <MoneySendIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Окупаемость</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.payback_period} месяцев</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-65.75 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <PercentIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">Доля к продаже</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.percentage_for_sale}%</Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <Heading text={'Местоположение'} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                    <div className='flex gap-1.5'>
                                        <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                                        <Paragraph className="">
                                            {card?.address?.address ?? "Адрес не указан"},
                                            {card?.address?.city?.name_ru ?? ""}
                                        </Paragraph>
                                    </div>
                                    {card.address?.latitude && card.address?.longitude ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${card.address.latitude},${card.address.longitude}&z=15&output=embed`}
                                            width="100%"
                                            height="350"
                                            className="rounded-lg border border-[#2EAA7B]"
                                            allowFullScreen
                                            loading="eager"
                                        />
                                    ) : card.address?.address ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(card.address.address)}&z=15&output=embed`}
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
                            <SellerInfoCard card={data.data} userId={card.user_id} offer_type={card.offer_type} />
                        </div>
                    </div>
                )

            }
            <Footer showSmallFooter={true} />
        </div >
    );
};
