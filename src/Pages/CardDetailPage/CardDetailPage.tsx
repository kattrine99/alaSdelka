import { useParams } from 'react-router-dom';
import { Breadcrumbs, Footer, Header, Heading, Paragraph } from '../../components/index';
import { useGetOfferByIdQuery } from "../../Store/api/Api";
import { FaLocationDot } from "react-icons/fa6";
import GpsIcon from '../../assets/gps.svg?react'
import CategoryIcon from '../../assets/frame.svg?react'

export const CardDetailPage = () => {
    const { id, category } = useParams();
    const offerId = Number(id);
    const { data, isLoading, isError } = useGetOfferByIdQuery(offerId);
    const card = data?.data;
    return (
        <div className="w-screen">
            <Header />
            {isLoading ? (<div className="flex justify-center items-center py-[30px]">
                <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
            </div>) : isError || !card ? (
                <p className="px-[192px] py-[30px] text-red-500">Ошибка загрузки данных</p>

            ) :
                (
                    <div className='px-[12rem] py-7.5'>
                        <Breadcrumbs category={category} title={card.title} />
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

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                {card.photos?.length > 0 ? (
                                    <div className="grid border border-[#2EAA7B] rounded-[0.63rem] grid-cols-1 md:grid-cols-2 gap-4">
                                        {card.photos.map((photoObj) => (
                                            <img
                                                key={photoObj.id}
                                                src={photoObj.photo}
                                                alt="Фото карточки"
                                                className="w-full h-[300px] object-cover rounded-md"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <img src='../../../images/business_abstract.jpg' alt="default_img" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div>
                                    <Heading text={'Удобства'} level={3} />
                                    {card.conveniences && card.conveniences.length > 0 && (
                                        <div className="mt-6">
                                            <div className="flex flex-wrap gap-4">
                                                {card.conveniences.map(item => (
                                                    <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                                                        ✅ <span>{item.name_ru}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Heading text={'Документация'} level={3} />
                                    {card.documents && card.documents.length > 0 && (
                                        <div className="mt-6">
                                            <div className="flex flex-wrap gap-3">
                                                {card.documents.map(doc => (
                                                    <a
                                                        key={doc.id}
                                                        href={doc.document}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-white border px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
                                                    >
                                                        Скачать документ
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-80 w-full p-4 border rounded-md shadow-sm">
                            <p className="text-lg mb-2 font-semibold text-gray-800 text-right">{card.price}</p>
                            <button className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 mb-2">
                                Контакты продавца
                            </button>
                            <button className="w-full bg-gray-100 text-green-700 font-medium py-2 rounded-md hover:bg-gray-200">
                                Ссылки
                            </button>
                        </div>
                    </div>
                )

            }
            <Footer showSmallFooter={true} />
        </div>
    );
};
