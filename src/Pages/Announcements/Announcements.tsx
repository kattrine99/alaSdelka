import { Applink, Button, EmptyMessage, Footer, Header, Heading, ModalBase, Pagination, Paragraph } from "../../components"
import { offerTypeToUrlMap, profileNavigate } from "../../utils/categoryMap"
import { useArchiveOfferMutation, useGetMyOffersQuery, useSellOfferMutation } from "../../Store/api/Api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import FireIcon from '../../assets/fire.svg?react';
import { FaLocationDot } from "react-icons/fa6";
import GpsIcon from '../../assets/gps.svg?react'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { getRefetchNotifications } from "../../utils/notificationRefetch";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import GalleryIcon from '../../assets/gallery.svg?react';
import { FiEdit } from "react-icons/fi";

export const AnnouncemntsPage = () => {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetMyOffersQuery({ page: 1, per_page: 1000 });
  const { t, lang } = useTranslation();

  const offers = data?.data || [];
  const sortedOffers = [...offers].sort((a, b) => {
    if (a.offer_status === "sold" && b.offer_status !== "sold") return 1;
    if (a.offer_status !== "sold" && b.offer_status === "sold") return -1;
    return 0;
  });
  const pageSize = 5;
  const paginatedOffers = sortedOffers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sortedOffers.length / pageSize);

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [sellOffer] = useSellOfferMutation();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveOffer] = useArchiveOfferMutation();
  const currencyMode = useSelector((state: RootState) => state.currency.mode);
  const currencyRate = useSelector((state: RootState) => state.currency.rate);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (location.state?.promotionSuccess || location.state?.newOffer) {
      refetch();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);


  const formatPrice = (price?: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (typeof numericPrice !== "number" || isNaN(numericPrice)) return "—";

    if (currencyMode === "USD") {
      if (!currencyRate || isNaN(currencyRate)) return "$ —";
      return `$ ${Math.round(numericPrice / currencyRate).toLocaleString()}`;
    }

    return `${numericPrice.toLocaleString()} сум`;
  };


  return (
    <div className="w-screen min-h-screen flex-col flex">
      {showModal && selectedOfferId !== null && (
        <ModalBase
          title={t("Вы уверены, что хотите отметить объявление как проданное?")}
          HeadingClassName="font-inter text-[35px] leading-[100%]"
          ModalClassName="w-150 p-9"
          message={
            <>
              {t("После подтверждения объявление будет исключено из общего каталога, и пользователи, добавившие его в избранное, получат уведомление о продаже.")}
            </>
          }
          onClose={() => setShowModal(false)}
          actions={
            <div className="flex gap-2 lg:gap-11">
              <Button
                className="border bg-[#2EAA7B] hover:bg-[#31B683] w-full text-white px-5 py-3 rounded-md"
                onClick={() => setShowModal(false)}
              >
                {t("Отменить")}
              </Button>
              <Button
                className="bg-orange-500 text-white w-full px-5 py-3 rounded-md"
                onClick={async () => {
                  if (selectedOfferId === null) return;
                  try {
                    await sellOffer(selectedOfferId).unwrap();
                    setShowModal(false);
                    setSuccessModal({
                      isOpen: true,
                      message: t("Объявление успешно отмечено как проданное!"),
                    });
                    const refetchNotifications = getRefetchNotifications();
                    refetchNotifications?.();

                    await refetch();
                  } catch (err) {
                    console.error("Ошибка при отправке запроса:", err);
                  }
                }}
              >
                {t("Продано")}
              </Button>
            </div>
          }
        />
      )}
      {showArchiveModal && selectedOfferId !== null && (
        <ModalBase
          title={t("Вы уверены, что хотите поместить объявление в архив?")}
          HeadingClassName="font-inter text-[35px] leading-[100%]"
          ModalClassName="w-150 p-9"
          message={
            <>{t("После подтверждения объявление будет перемещено в архив")}</>
          }
          onClose={() => setShowArchiveModal(false)}
          actions={
            <div className="flex gap-2 lg:gap-11">
              <Button
                className="border bg-[#2EAA7B] hover:bg-[#31B683] w-full text-white px-5 py-3 rounded-md"
                onClick={() => setShowArchiveModal(false)}
              >
                {t("Отменить")}
              </Button>
              <Button
                className="bg-orange-500 w-full text-white  px-5 py-3 rounded-md"
                onClick={async () => {
                  if (selectedOfferId === null) return;
                  try {
                    await archiveOffer(selectedOfferId).unwrap();
                    setShowArchiveModal(false);
                    setSuccessModal({
                      isOpen: true,
                      message: t("Объявление успешно перемещено в архив!"),
                    });
                    await refetch();
                  } catch (err) {
                    console.error("Ошибка при архивировании:", err);
                  }
                }}
              >
                {t("Архивировать")}
              </Button>
            </div>
          }
        />
      )}
      {successModal.isOpen && (
        <ModalBase
          title={t("Успешно!")}
          HeadingClassName="font-inter text-[35px] leading-[100%]"
          ModalClassName="w-120 p-9"
          message={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: "" })}
          actions={
            <Button
              className="bg-[#2EAA7B] hover:bg-[#31B683] text-white px-6 py-3 rounded-md w-full"
              onClick={() => setSuccessModal({ isOpen: false, message: "" })}
            >
              {t("Понятно")}
            </Button>
          }
        />
      )}
      <Header navLinksData={profileNavigate} />
      <div className="container mx-auto px-3 md:px-0 py-9 flex-1">
        <Heading text={t("Мои объявления")} level={2} className="font-inter text-xl font-bold leading-5 space-x-[-0.5%]" />

        {isLoading ? (
          <div className="h-[400px] flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 text-lg">{t("Ошибка загрузки объявлений")}</div>
        ) : offers.length === 0 ? (
          <EmptyMessage
            title={t("Нет объявлений")}
            subtitle={t("Здесь будут отображаться ваши объявления")}
            buttonLink="/add-offer"
          />) : (
          <div>
            <div className="flex md:justify-end mt-5 gap-3">
              <Button
                className="bg-[#2EAA7B] text-white rounded-md w-60.5 px-5 py-3"
                onClick={() => navigate(`/${lang}/add-offer`)}
              >
                {t("Создать объявление")}
              </Button>
              <Button
                className="bg-[#FF1D1D] text-white rounded-md px-5 py-3"
                onClick={() => navigate(`/${lang}/announcements/archived`)}
              >
                {t("Архив")}
              </Button>
            </div>
            <div className="flex gap-6 mt-8 w-full">
              <div className="flex flex-col gap-10.5 w-full">
                {paginatedOffers.map((offer) => (
                  <div key={offer.id} className="bg-white border border-[#E0E0E0] rounded-xl flex w-full">
                    <div className="relative grid grid-cols-1 md:grid-cols-3 w-full">
                      {/* КНОПКА РЕДАКТИРОВАНИЯ */}
                      {["draft", "in_moderation", "published", "denied"].includes(offer.offer_status) && (
                        <div className="absolute top-3 right-3 z-20 group">
                          <button
                            onClick={() => navigate(`/${lang}/edit/${offer.slug}`)}
                            className="p-2 bg-white border border-[#F8F8F8] rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
                          >
                            <FiEdit className="w-5 h-5 text-[#2EAA7B]" />
                          </button>
                          <div className="absolute top-full mt-2 -right-2.5 bg-[#F8F8F8] text-[#2EAA7B] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                            {t("Изменить")}
                          </div>
                        </div>
                      )}
                      {(offer.offer_status === "sold" || offer.is_paid === true) && (
                        <div className="absolute left-5 top-[-20px] z-10 flex gap-2">
                          {offer.offer_status === "sold" && (
                            <div className="w-[125px] font-openSans bg-white border border-[#301DFF] text-[#301DFF] py-1.25 px-1.5 rounded-md font-semibold shadow-sm text-center">
                              <Paragraph className="text-sm">{t("Продано")}</Paragraph>
                            </div>
                          )}
                          {offer.is_paid === true && (
                            <div className="font-openSans bg-white border border-[#FD6A0D] text-[#FD6A0D] py-1.25 px-1.5 rounded-md font-semibold shadow-sm flex items-center gap-1">
                              <FireIcon className="w-5 h-5 text-[#FD6A0D]" />
                              <Paragraph className="text-sm">{t("Популярное")}</Paragraph>
                            </div>
                          )}
                        </div>
                      )}
                      {(offer.offer_status === 'draft') && (
                        <div className="absolute left-5 top-[-20px] z-10 flex gap-2">
                          <div className="w-[125px] font-openSans bg-white border border-[#2EAA7B] text-[#2EAA7B] py-1.25 px-1.5 rounded-md font-semibold shadow-sm text-center">
                            <Paragraph className="text-sm">{t("Черновик")}</Paragraph>
                          </div>
                        </div>
                      )}
                      {(offer.offer_status === 'in_moderation') && (
                        <div className="absolute left-5 top-[-20px] z-10 flex gap-2">
                          <div className="w-[125px] font-openSans bg-white border border-[#FF8700] text-[#FF8700] py-1.25 px-1.5 rounded-md font-semibold shadow-sm text-center">
                            <Paragraph className="text-sm">{t("На модерации")}</Paragraph>
                          </div>
                        </div>
                      )}
                      {(offer.offer_status === 'published') && (
                        <div className="absolute left-5 top-[-20px] z-10 flex gap-2">
                          <div className="w-[125px] font-openSans bg-white border border-[#2EAA7B] text-[#2EAA7B] py-1.25 px-1.5 rounded-md font-semibold shadow-sm text-center">
                            <Paragraph className="text-sm">{t("Опубликовано")}</Paragraph>
                          </div>
                        </div>
                      )}
                      {(offer.offer_status === 'denied') && (
                        <div className="absolute left-5 top-[-20px] z-10 flex gap-2">
                          <div className="w-[125px] font-openSans bg-white border border-[#FF4D4D] text-[#FF4D4D] py-1.25 px-1.5 rounded-md font-semibold shadow-sm text-center">
                            <Paragraph className="text-sm">{t("Отклонено")}</Paragraph>
                          </div>
                        </div>
                      )}
                      <div className="relative col-span-1">
                        <Applink
                          to={`/${offerTypeToUrlMap[offer.offer_type || 'category']}/card/${offer.slug}`}
                          className="w-full flex justify-center h-full"
                        >
                          {offer.photos[0]?.photo ? (
                            <img
                              src={offer.photos[0].photo}
                              alt="cover"
                              className="w-full  rounded object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-full bg-[#F0F0F0] md:h-full h-49 flex flex-col items-center justify-center rounded">
                              <GalleryIcon className="w-8 h-8 text-[#B0B0B0]" />
                              <Paragraph className="text-[#999] text-sm mt-2">
                                {t("Изображение отсутствует")}
                              </Paragraph>
                            </div>
                          )}
                        </Applink>
                      </div>
                      <div className="flex flex-3/4 flex-col gap-1 py-9.5 px-7 md:col-span-2">
                        <div className="flex flex-col mb-11">
                          <Applink to={`/${offerTypeToUrlMap[offer.offer_type || 'category']}/card/${offer.slug}`} className="w-full hover:text-[#2EAA7B]">

                            <Paragraph className="text-[#232323] text-2xl font-inter font-bold mb-2">
                              {formatPrice(offer.price)}
                            </Paragraph>
                            <Paragraph className="text-[#232323] text-lg font-bold font-inter mb-3 ">{offer.title}</Paragraph>
                          </Applink>
                          <div className='flex gap-1.5'>
                            <FaLocationDot className="text-[#2EAA7B] w-4 h-4" />
                            <Paragraph className="font-inter font-bold text-sm"><span className="font-medium">{t("Адрес:")} </span>
                              {offer?.address?.address ?? `${t("Адрес не указан")}`},
                              {lang === "uz"
                                ? offer?.address?.city?.name_uz ?? ""
                                : offer?.address?.city?.name_ru ?? ""}
                            </Paragraph>
                          </div>
                          <div className='flex gap-1.5 items-center'>
                            <GpsIcon className='w-4 h-4' />
                            <Paragraph className="font-inter font-medium text-sm">{offer.area} {t("кв. м.")}</Paragraph>

                          </div>
                        </div>
                        <div className="flex w-full">
                          <div className="grid grid-cols-1 gap-y-3 gap-x-5 md:grid-cols-2 w-full">
                            {(offer.offer_status == 'published') && (
                              <div className="w-full">
                                {offer.is_paid == true ? (
                                  <div>
                                    <div className="bg-[#2EAA7B] w-full text-white px-5 py-1 rounded-md flex items-center gap-2 font-semibold">
                                      {t("Идет продвижение (осталось {{count}} дней)").replace("{{count}}", String(offer.paid_offer?.promotion_days_left ?? 0))}
                                      <FireIcon className="z-10 w-5 h-5 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    className="bg-[#2EAA7B] w-full text-white px-5 h-12 rounded-md cursor-pointer"
                                    onClick={() => navigate(`/promotion/${offer.slug}`)}
                                  >
                                    {t("Продвигать объявление")}
                                  </Button>
                                )}
                              </div>
                            )}
                            {(offer.offer_status === 'published') && (
                              <Button className={"text-white bg-[#FF8707] px-4 h-12 rounded-md" + " cursor-pointer"}
                                onClick={() => {
                                  setSelectedOfferId(offer.id);
                                  setShowModal(true);
                                }}>
                                {t("Продано")}
                              </Button>
                            )}
                            {(offer.offer_status === 'published') && (
                              <Button className=" text-[#2EAA7B] border border-[#2EAA7B] px-5 h-12 rounded-md cursor-pointer"
                                onClick={() => navigate(`/statistics/${offer.slug}`)}>
                                {t("Посмотреть статистику")}
                              </Button>
                            )}
                            {(offer.offer_status === 'draft') && (
                              <Button className="bg-[#2EAA7B] w-full text-white px-5 h-12 rounded-md cursor-pointer"
                                onClick={() => {navigate('/add-offer?offerSlug=' + offer.slug)}}>
                                {t("Опубликовать")}
                              </Button>
                            )}

                            <Button className="bg-[#FF1D1D] px-5 h-12 rounded-md text-white cursor-pointer"
                              onClick={() => {
                                setSelectedOfferId(offer.id);
                                setShowArchiveModal(true);
                              }}>
                              {t("Поместить в архив")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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