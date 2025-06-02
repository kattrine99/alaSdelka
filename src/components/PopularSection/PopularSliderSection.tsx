import { useGetHomeOffersQuery } from "../../Store/api/Api";
import { Cards, Heading } from "../index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export const PopularSliderSection = () => {
  const { data: sellData, isLoading: isSellLoading } = useGetHomeOffersQuery("sell");
  const { data: buyData, isLoading: isBuyLoading } = useGetHomeOffersQuery("buy");

  if (isSellLoading || isBuyLoading) return null;

  const allSell = [
    ...(sellData?.business || []),
    ...(sellData?.franchise || []),
    ...(sellData?.startup || []),
    ...(sellData?.investments || []),
  ];
  const allBuy = [
    ...(buyData?.business || []),
    ...(buyData?.franchise || []),
    ...(buyData?.startup || []),
    ...(buyData?.investments || []),
  ];

  const popularCards = [...allSell, ...allBuy].filter((card) => card.is_paid);

  if (popularCards.length === 0) return null;

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-16 lg:px-24 xl:px-[192px] py-12 bg-white">
      <div className="mb-6">
        <Heading
          level={2}
          text="Популярное"
          className="text-[30px] font-bold text-black"
        />
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop={popularCards.length > 4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1532: { slidesPerView: 4 },
          }}
        >
          {popularCards.map((card) => (
            <SwiperSlide key={card.id}>
              <Cards
                cards={[card]}
                cardIconClass="rounded-t-xl overflow-hidden"
                cardWrapperClass="rounded-xl flex-col justify-between min-h-120 my-10 shadow-lg"
                WhatchButtonClass="py-3 px-5 w-full bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="swiper-button-prev-custom absolute -left-6 max-md:-left-1 top-1/2 transform -translate-y-1/2 z-10 w-[40px] h-[40px] rounded-[10px] bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <MdKeyboardArrowLeft className="text-2xl text-[#4B5563]" />
        </button>
        <button className="swiper-button-next-custom absolute -right-6 max-md:-right-1 top-1/2 transform -translate-y-1/2 z-10 w-[40px] h-[40px] rounded-[10px] bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <MdKeyboardArrowRight className="text-2xl text-[#4B5563]" />
        </button>
      </div>
    </section>
  );
};
