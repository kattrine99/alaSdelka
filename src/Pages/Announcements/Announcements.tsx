import { Button, EmptyMessage, Footer, Header, Heading, Paragraph } from "../../components"
import { profileNavigate } from "../../utils/categoryMap"
import { useGetMyOffersQuery } from "../../Store/api/Api";
import { useNavigate } from "react-router-dom";

export const AnnouncemntsPage = () => {
  const { data, isLoading, isError } = useGetMyOffersQuery(5);
  const navigate = useNavigate();

  const offers = data?.offers?.data || [];

  return (
    <div className="w-screen">
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
          <div className="flex flex-col gap-6 mt-8">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white border border-[#E0E0E0] rounded-xl p-6 flex justify-between items-start">
                <div className="flex gap-6">
                  <img
                    src={offer.photos[0]?.photo ?? "/images/placeholder.jpg"}
                    alt="cover"
                    className="w-[130px] h-[130px] rounded object-cover bg-gray-100"
                  />
                  <div className="flex flex-col gap-1">
                    <Paragraph className="text-[#232323] text-lg font-bold">{offer.price.toLocaleString()} сум</Paragraph>
                    <Paragraph className="text-[#232323] text-sm font-semibold">{offer.title}</Paragraph>
                    <Paragraph className="text-[#667085] text-sm">Адрес: {offer.address?.address}</Paragraph>
                    <Paragraph className="text-[#667085] text-sm">{offer.area} кв. м.</Paragraph>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button className="bg-[#2EAA7B] text-white px-4 py-2 rounded-md" onClick={()=>navigate(`/statistics/${offer.id}`)}>Посмотреть статистику</Button>
                  <Button className="border border-[#2EAA7B] text-[#2EAA7B] px-4 py-2 rounded-md">Поместить в архив</Button>
                  <Button className="bg-orange-500 text-white px-4 py-2 rounded-md"
                    onClick={() => navigate(`/promotion/${offer.id}`)}
                  >Продвигать объявление</Button>
                  <Button className="bg-orange-500 text-white px-4 py-2 rounded-md">Продано</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer showSmallFooter={true} />
    </div>
  )
}