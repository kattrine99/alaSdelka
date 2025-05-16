import { useEffect, useState } from "react";
import {
  Cards,
  EmptyMessage,
  Footer,
  Header,
  Heading,
  Pagination
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetFavoritesQuery } from "../../Store/api/Api";
import { profileNavigate } from "../../utils/categoryMap";

export const FavoritePage = () => {
  const { data, isLoading, isError, refetch } = useGetFavoritesQuery();
  const offers = data?.data ?? [];

  const mappedFavorites: ICard[] = offers.map((offer) => ({
    id: offer.id,
    title: offer.title || "Название не указано",
    price: offer.price ?? 0,
    image: offer.photos?.[0]?.photo || "/images/business_abstract.jpg",
    address: {
      address: offer.address?.address || "Адрес не указан",
      city: {
        name_ru: offer.address?.city?.name_ru || "",
      },
    },
    area: offer.area ? Number(`${offer.area}`) : 0,
    offer_type: offer.offer_type,
    offer_status: offer.offer_status,
  }));

  const favoriteIds = mappedFavorites.map((card) => card.id);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mappedFavorites.length / itemsPerPage);

  const paginatedFavorites = mappedFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="w-screen">
      <Header navLinksData={profileNavigate} />
      <div className="px-48 py-9 h-screen">
        <Heading
          text="Избранное"
          level={2}
          className="font-inter text-xl font-bold leading-5 mb-10"
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-[30px]">
            <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError ? (
          <p className="text-red-500">Ошибка загрузки</p>
        ) : mappedFavorites.length === 0 ? (
          <EmptyMessage
            title="Нет избранных"
            subtitle="Здесь будут отображаться ваши избранные"
            hideButton
          />
        ) : (
          <div className="">
            <Cards
              cards={paginatedFavorites}
              initialFavorites={favoriteIds}
              onFavoritesChanged={refetch}
              containerClass='flex flex-col gap-7.5 rounded-xl w-317.75'
              cardIconClass='w-85 h-58'
              cardWrapperClass='shadow-[1px_1px_4.5px_0px] shadow-[#28B13D4D]'
              WhatchButtonClass='py-3 px-5 w-79.5 bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer'
            />
            {mappedFavorites.length > itemsPerPage && (
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
  );
};
