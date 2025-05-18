import { Button, EmptyMessage, Footer, Header, Heading, ModalBase, Pagination, Paragraph } from "../../components"
import { offerTypeToUrlMap, profileNavigate } from "../../utils/categoryMap"
import { useArchiveOfferMutation, useGetMyOffersQuery, useSellOfferMutation } from "../../Store/api/Api";
import { Link, useNavigate } from "react-router-dom";
import FireIcon from '../../assets/fire.svg?react';
import { FaLocationDot } from "react-icons/fa6";
import GpsIcon from '../../assets/gps.svg?react'
import { useEffect, useState } from "react";


export const AnnouncemntsPage = () => {


  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetMyOffersQuery({ page: currentPage, per_page: 5 });
  const offers = data?.data || [];
  const meta = data?.meta;
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [sellOffer] = useSellOfferMutation();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveOffer] = useArchiveOfferMutation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="w-screen">
      {showModal && selectedOfferId !== null && (
        <ModalBase
          title="Вы уверены, что хотите отметить объявление как проданное?"
          HeadingClassName="font-inter text-[35px] leading-[100%]"
          message={
            <>
              После подтверждения объявление будет исключено из общего каталога,
              и пользователи, добавившие его в избранное, получат уведомление о продаже.
            </>
          }
          onClose={() => setShowModal(false)}
          actions={
            <div className="flex gap-11 ">
              <Button
                className="border bg-[#2EAA7B] hover:bg-[#31B683] w-66.25 text-white px-5 py-3 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Отменить
              </Button>
              <Button
                className="bg-orange-500 text-white w-66.25 px-5 py-3 rounded-md"
                onClick={async () => {
                  if (selectedOfferId === null) return;
                  try {
                    await sellOffer(selectedOfferId).unwrap();
                    setShowModal(false);
                  } catch (err) {
                    console.error("Ошибка при отправке запроса:", err);
                  }
                }}
              >
                Продано
              </Button>
            </div>
          }
        />
      )}
      {showArchiveModal && selectedOfferId !== null && (
        <ModalBase
          title="Вы уверены, что хотите поместить объявление в архив?"
          HeadingClassName="font-inter text-[35px] leading-[100%]"
          message={
            <>После подтверждения объявление будет перемещено в архив</>
          }
          onClose={() => setShowArchiveModal(false)}
          actions={
            <div className="flex gap-11">
              <Button
                className="border bg-[#2EAA7B] hover:bg-[#31B683] w-66.25 text-white px-5 py-3 rounded-md"
                onClick={() => setShowArchiveModal(false)}
              >
                Отменить
              </Button>
              <Button
                className="bg-orange-500 text-white w-66.25 px-5 py-3 rounded-md"
                onClick={async () => {
                  if (selectedOfferId === null) return;
                  try {
                    await archiveOffer(selectedOfferId).unwrap();
                    setShowArchiveModal(false);
                    // можно обновить объявления, если хочешь:
                    // await refetch();
                  } catch (err) {
                    console.error("Ошибка при архивировании:", err);
                  }
                }}
              >
                Архивировать
              </Button>
            </div>
          }
        />
      )}

      <Header navLinksData={profileNavigate} />
      <div className="px-48 py-9">
        <Heading text={"Мои объявления"} level={2} className="font-inter text-xl font-bold leading-5 space-x-[-0.5%]" />

        {isLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 text-lg">Ошибка загрузки объявлений</div>
        ) : offers.length === 0 ? (
          <EmptyMessage
            title="Нет объявлений"
            subtitle="Здесь будут отображаться ваши объявления"
            buttonLink="/add-offer"
          />) : (
          <div>
            <div className="flex gap-6 mt-8">
              <div className="flex flex-col w-317 gap-10.5">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white border border-[#E0E0E0] rounded-xl flex ">

                    <div className="relative flex flex-1/4">
                      {offer.offer_status === "sold" && (
                        <div className="absolute w-[125px] left-5 top-[-20px] font-openSans bg-white border border-[#301DFF] text-[#301DFF] py-1.25 px-1.5 rounded-md font-semibold z-10 shadow-sm flex items-center gap-1">
                          <FireIcon className="w-5 h-5 text-[#301DFF]" />
                          <Paragraph className="text-sm">Продано</Paragraph>
                        </div>)}
                      <div className="relative w-101.5 ">
                        <Link to={`/${offerTypeToUrlMap[offer.offer_type || 'category']}/card/${offer.id}`} className="w-full">

                          <img
                            src={offer.photos[0]?.photo ?? "src/assets/gallery.svg"}
                            alt="cover"
                            className="absolute w-full h-full rounded object-cover bg-gray-100"
                          />
                        </Link>

                      </div>

                      <div className="flex flex-3/4 flex-col gap-1 py-9.5 px-7">
                        <div className="flex flex-col mb-11">
                          <Link to={`/${offerTypeToUrlMap[offer.offer_type || 'category']}/card/${offer.id}`} className="w-full hover:text-[#2EAA7B]">

                            <Paragraph className="text-[#232323] text-2xl font-inter font-bold mb-2">
                              {offer.price ? offer.price.toLocaleString() : "0"} сум
                            </Paragraph>
                            <Paragraph className="text-[#232323] text-lg font-bold font-inter mb-3 ">{offer.title}</Paragraph>
                          </Link>
                          <div className='flex gap-1.5'>
                            <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                            <Paragraph className="font-inter font-bold text-sm"><span className="font-medium">Адрес: </span>
                              {offer?.address?.address ?? "Адрес не указан"},
                              {offer?.address?.city?.name_ru ?? ""}
                            </Paragraph>
                          </div>
                          <div className='flex gap-1.5 items-center'>
                            <GpsIcon className='w-4 h-4' />
                            <Paragraph className="font-inter font-medium text-sm">{offer.area} кв. м.</Paragraph>

                          </div>
                        </div>
                        <div className="flex gap-23.75 w-full">
                          <div className="flex flex-col w-full gap-7">
                            <Button className="bg-[#2EAA7B] text-white px-5 h-12 rounded-md" onClick={() => navigate(`/statistics/${offer.id}`)}>Посмотреть статистику</Button>
                            <Button className="border border-[#2EAA7B] text-[#2EAA7B] px-5 h-12 rounded-md"
                              onClick={() => {
                                setSelectedOfferId(offer.id);
                                setShowArchiveModal(true);
                              }}>Поместить в архив</Button>
                          </div>
                          <div className="flex flex-col w-full gap-7">
                            {offer.promotion?.is_active ? (
                              <div className="bg-[#FF1D1D] text-white px-5 h-12 rounded-md flex items-center gap-2 font-semibold">
                                Идет продвижение (осталось {offer.promotion.days_left} дней)
                                <FireIcon className="z-10 w-5 h-5 text-[#FD6A0D]" />
                              </div>
                            ) : (
                              <Button
                                className="bg-orange-500 text-white px-5 h-12 rounded-md"
                                onClick={() => navigate(`/promotion/${offer.id}`)}
                              >
                                Продвигать объявление
                              </Button>
                            )}

                            <Button className="bg-orange-500 text-white px-4 h-12 rounded-md"
                              onClick={() => {
                                setSelectedOfferId(offer.id);
                                setShowModal(true);
                              }}>Продано</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4.75">
                <Button
                  className="bg-[#2EAA7B] text-white rounded-md w-60.5 px-5 py-3"
                  onClick={() => navigate('/add-offer')}
                >
                  {'Добавить объявление'}
                </Button>
              </div>

            </div>
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            )}
          </div>
        )}

      </div>
      <Footer showSmallFooter={true} />
    </div>
  )
}