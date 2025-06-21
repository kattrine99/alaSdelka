import { useEffect, useMemo, useState } from "react";
import {
  Cards,
  EmptyMessage,
  Footer,
  Header,
  Heading,
  Pagination,
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetFavoritesQuery, useToggleFavoriteMutation } from "../../Store/api/Api";
import { profileNavigate } from "../../utils/categoryMap";
import { Offer } from "../../Store/api/types";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

export const FavoritePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetFavoritesQuery({ page: currentPage });

  const [toggleFavorite] = useToggleFavoriteMutation();
  const { t } = useTranslation()
  const offers = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta;

  const mappedFavorites: ICard[] = useMemo(
    () =>
      offers.map((offer: Offer) => ({
        id: offer.id,
        slug: offer.slug,
        title: offer.title || "Название не указано",
        price: offer.price ?? 0,
        photos: offer.photos ?? [],
        address: {
          address: offer.address?.address || "Адрес не указан",
          city: {
            name_ru: offer.address?.city?.name_ru || "",
          },
        },
        area: typeof offer.area === "number" ? offer.area : Number(offer.area ?? 0),
        offer_type: offer.offer_type,
        offer_status: offer.offer_status,
        is_favourite: offer.is_favourite === true,
      })),
    [offers]
  );


  const handleFavoritesChanged = async (id: number) => {
    try {
      await toggleFavorite({ id });
      await refetch();
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && !isError && offers.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [offers, isLoading, isError, currentPage]);

  return (
    <div className="w-screen ">
      <Header navLinksData={profileNavigate} />
      <div className="px-48 h-screen max-lg:px-20 max-md:px-3 py-9">
        <Heading
          text={t("Избранное")}
          level={2}
          className="font-inter text-xl font-bold leading-5 mb-10"
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-[30px]">
            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError ? (
          <p className="text-red-500">{t('Ошибка загрузки')}</p>
        ) : mappedFavorites.length === 0 ? (
          <EmptyMessage
            title="Нет избранных"
            subtitle="Здесь будут отображаться ваши избранные"
            hideButton
          />
        ) : (
          <div>
            <Cards
              cards={mappedFavorites}
              forceAllFavorite={true}
              onFavoritesChanged={handleFavoritesChanged}
              containerClass="flex flex-col gap-7.5 rounded-xl w-full"
              cardIconClass="w-85 max-xl:w-full m-3"
              cardWrapperClass="max-lg:flex max-lg:flex-col shadow-[1px_1px_4.5px_0px] shadow-[#28B13D4D] transition duration-500 ease-in-out"
              WhatchButtonClass="py-3 px-5 w-79.5 max-lg:w-full bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer"
            />

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
  );
};
