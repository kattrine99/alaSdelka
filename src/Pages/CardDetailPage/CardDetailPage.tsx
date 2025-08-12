import { useParams } from 'react-router-dom';
import { Breadcrumbs, Button, Footer, Header, Heading, Paragraph, PhotosSwiper } from '../../components/index';
import { useGetOfferBySlugQuery, useDownloadOfferDocumentsQuery } from "../../Store/api/Api";
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
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useTranslation } from '../../../public/Locales/context/TranslationContext';
import { translationService } from '../../utils/googleTranslate';
import { MetaTags } from '../../components/MetaTags';
export const CardDetailPage = () => {
    const { lang, t } = useTranslation()
    const { slug, section } = useParams();
    const offerSlug = String(slug);
    const { data, isLoading, isError } = useGetOfferBySlugQuery(offerSlug);
    const card = data?.data;
    const metaTitle = `${card?.title} - ${card?.price} UZS | Invest In`;
    const metaDescription = card?.description?.substring(0, 160) ||
        `${card?.title} в ${card?.address?.city?.name_ru}. Цена: ${card?.price} UZS`;
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [translatedTitle, setTranslatedTitle] = useState(card?.title)
    const [translatedDescription, setTranslaedDescription] = useState(card?.description)
    if (card) {
        translationService.translateText(card.title, lang).then(function (value) {
            if (value) {
                setTranslatedTitle(value);
            }
        });
        translationService.translateText(card.description, lang).then(function (value) {
            if (value) {
                setTranslaedDescription(value);
            }
        })
    }
    const { mode: currencyMode, rate } = useSelector((state: RootState) => state.currency);
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

    function formatMonthsToYears(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let result = '';
        if (years > 0) {
            result += `${years} ${getPlural(years, t('год'), t('года'), t('лет'))}`;
        }
        if (remainingMonths > 0 || result === '') {
            if (result) result += ' ';
            result += `${remainingMonths} ${getPlural(remainingMonths, t('месяц'), t('месяца'), t('месяцев'))}`;
        }

        return result;
    }

    function getPlural(number, one, few, many) {
        const mod10 = number % 10;
        const mod100 = number % 100;

        if (mod10 === 1 && mod100 !== 11) return one;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
        return many;
    }
    const formatCurrency = (price?: number) => {
        if (typeof price !== 'number') return "—";

        if (currencyMode === "USD") {
            const converted = Math.round(price / (rate || 1));
            return `${converted.toLocaleString()} $`;
        }
        return `${price.toLocaleString()} ${t("сум")}`;
    };
    return (
        <>
            <MetaTags
                title={metaTitle}
                description={metaDescription}
                keywords={`${card?.title}, ${card?.category?.title_ru}, ${card?.address?.city?.name_ru}`}
                ogTitle={card?.title}
                ogDescription={metaDescription}
                ogImage={card?.photos?.[0]?.photo}
            />
            <div className="w-screen">
                <Header />
                {isLoading ? (<div className="flex justify-center items-center py-[30px]">
                    <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                </div>) : isError || !card ? (
                    <p className="px-48 py-7.5 text-red-500">{t("Ошибка загрузки данных")}</p>

                ) :
                    (<div className='container mx-auto pt-10 max-md:p-5'>
                        {translatedTitle != null ? (<Breadcrumbs category={section} title={translatedTitle} />) : (<Breadcrumbs category={section} title={card.title} />)}
                        <div className='flex flex-wrap xl:flex-nowrap'>
                            <div className='flex flex-col w-full lg:w-3/4 justify-center'>
                                {translatedTitle != null ? (<Heading className="text-[24px] md:text-4xl font-inter leading-10 font-bold mt-6 mb-3.5" text={translatedTitle} level={2} />) : (<Heading className="text-[24px] md:text-4xl font-inter leading-10 font-bold mt-6 mb-3.5" text={card.title} level={2} />)}

                                <div className='flex flex-col gap-2 mb-[15px]'>
                                    <Paragraph className='font-inter font-bold text-[#363636] text-[16px]'>ID {card.id}</Paragraph>
                                    <div className='flex gap-1.5 items-center'>
                                        <GpsIcon className='w-4 h-4' />
                                        <Paragraph>{card.area} {t("кв. м.")}</Paragraph>
                                    </div>
                                    <div className='flex gap-1.5 items-center'>
                                        <CategoryIcon className='w-4 h-4 text-[#2EAA7B]' />
                                        <Paragraph className="">{lang === "uz" ? card?.category?.title_uz : card?.category?.title_ru ?? ""}</Paragraph>
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
                                            <Heading text={t('Удобства')} level={3} className='font-inter font-semibold text-xl text-[#3A3A3A]' />
                                            <div className="mt-3">
                                                <div className="flex md:flex-row flex-col max-w-full flex-wrap gap-x-12.5 gap-y-4">
                                                    {card.conveniences.map(item => (
                                                        <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                                                            {conveniencesIcons[item.name_ru] || <span className="w-5 h-5" />}
                                                            <div className="flex flex-col">
                                                                <span>{lang === "uz" ? item.name_uz : item.name_ru}</span>
                                                                <span className='font-inter font-bold text-xl text-[#2EAA7B]'>{t("Есть")}</span>
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
                                        <Heading text={t('Документация')} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
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
                                            {t("Скачать все документы")}
                                        </Button>
                                    </div>

                                }

                                {translatedDescription && (
                                    <div>
                                        <Heading text={t('Описание')} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                        <div className="mt-3">
                                            <Paragraph className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {showFullDescription
                                                    ? translatedDescription
                                                    : translatedDescription.slice(0, 300) + (translatedDescription.length > 300 ? "..." : "")}
                                            </Paragraph>

                                            {translatedDescription.length > 300 && (
                                                <Button
                                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                                    className="text-[#2EAA7B] mt-2 font-semibold hover:underline transition"
                                                >
                                                    {showFullDescription ? t("Скрыть") : t("Читать дальше")}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <Heading text={t('Информация и финансы')} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-4">
                                        <div className="flex w-full gap-2 border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <WalletIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Среднемесячная выручка")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{formatCurrency(card.average_monthly_revenue)}</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <ReceiptIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Среднемесячные расходы")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{formatCurrency(card.average_monthly_expenses)}</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <CalendarIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Дата основания")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.foundation_year} {t("год")}</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <DollarCircleIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Среднемесячная прибыль")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{formatCurrency(card.average_monthly_profit)}</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <MoneySendIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Окупаемость")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{formatMonthsToYears(card.payback_period)}</Paragraph>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full border border-[#2EAA7B] items-center rounded-[10px] py-3 px-4.25">
                                            <PercentIcon className='w-10 h-10' />
                                            <div className='flex flex-col'>
                                                <Paragraph className="font-inter text-[13px] leading-5 text-[#7D7D7D]">{t("Доля к продаже")}</Paragraph>
                                                <Paragraph className="font-inter text-xl font-bold text-[#2EAA7B]">{card.percentage_for_sale}%</Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <Heading text={t('Местоположение')} level={3} className='font-inter font-semibold text-xl mt-7.5 text-[#3A3A3A]' />
                                    <div className='flex gap-1.5'>
                                        <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                                        <Paragraph className="">
                                            {card?.address !== null ? card?.address?.address + ',' : t("Адрес не указан")}
                                            {lang === "uz" ? card?.address?.city?.name_uz : card?.address?.city?.name_ru ?? ""}
                                        </Paragraph>
                                    </div>
                                    {card.address?.latitude && card.address?.longitude ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${card.address.latitude},${card.address.longitude}&z=15&output=embed`}
                                            width="100%"
                                            height="350"
                                            className="rounded-lg border mb-5 border-[#2EAA7B]"
                                            allowFullScreen
                                            loading="eager"
                                        />
                                    ) : card.address?.address ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(card.address.address)}&z=15&output=embed`}
                                            width="100%"
                                            height="350"
                                            className="rounded-lg border mb-5 border-[#2EAA7B]"
                                            allowFullScreen
                                            loading="eager"
                                        />
                                    ) : (
                                        <Paragraph className="text-gray-500">{t("Адрес недоступен")}</Paragraph>
                                    )}

                                </div>
                            </div>
                            <div className="xl:mt-0 mt-6 w-full xl:w-4/12">
                                <SellerInfoCard card={data.data} userId={card.user_id} offer_type={card.offer_type} />
                            </div>
                        </div>
                    </div>
                    )

                }
                <Footer showSmallFooter={true} />
            </div >
        </>
    );
};
