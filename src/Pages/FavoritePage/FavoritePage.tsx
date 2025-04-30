import { Cards, EmptyMessage, Footer, Header, Heading } from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { useGetFavoritesQuery } from "../../Store/api/Api";
import { profileNavigate } from "../../utils/categoryMap";

export const FavoritePage = () => {
  const { data: favorites = [], isLoading, isError, refetch } = useGetFavoritesQuery();

  const mappedFavorites: ICard[] = favorites.map((offer) => ({
    id: offer.data.id,
    price: offer.data.price
      ? `${offer.data.price.toLocaleString("ru-RU")} сум`
      : "Цена не указана",
    title: offer.data.title || "Название не указано",
    image: offer.data.photos?.[0]?.photo || "/images/business_abstract.jpg",
    address: {
      address: offer.data.address?.address || "Адрес не указан",
      city: {
        name_ru: offer.data.address?.city?.name_ru || "",
      },
    },
    area: offer.data.area ? String(offer.data.area) : "Площадь не указана",
    offer_type: offer.data.offer_type,
  }));

  const favoriteIds = mappedFavorites.map((card) => card.id);

  return (
    <div className="w-screen">
      <Header navLinksData={profileNavigate} />
      <div className="px-48 py-9">
        <Heading
          text="Избранное"
          level={2}
          className="font-inter text-xl font-bold leading-5"
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
          <Cards
            cards={mappedFavorites}
            initialFavorites={favoriteIds}
            onFavoritesChanged={refetch}
          />
        )}
      </div>
      <Footer showSmallFooter={true} />
    </div>
  );
};
