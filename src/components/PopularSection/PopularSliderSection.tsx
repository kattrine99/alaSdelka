import { ICard } from "../Cards/Interfaces";
import { Heading, Cards } from "../index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";


interface PopularSliderSectionProps {
  cards: ICard[];
  title?: string;
}

export const PopularSliderSection: React.FC<PopularSliderSectionProps> = ({
  cards,
  title = "Популярное",
}) => {
  const popularCards = cards.filter((card) => card.popular);

  if (popularCards.length === 0) return null;

  return (
    <div className="relative px-[192px] mt-[50px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={2} text={title} className="text-[30px] font-bold mb-1 text-black" />
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {popularCards.map((card) => (
          <SwiperSlide key={card.id}>
            <Cards
              cards={[card]}
              cardWrapperClass="rounded-xl my-[20px]"
              cardIconClass="rounded-xl overflow-hidden"
              containerClass="grid grid-cols-1"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="swiper-button-prev-custom absolute bottom-[180px] left-[174px] transform -translate-y-1/2 z-10 w-[40px] h-[40px] rounded-[10px] bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
        <span className="text-2xl text-[#4B5563]"><MdKeyboardArrowLeft />
        </span>
      </button>
      <button className="swiper-button-next-custom absolute bottom-[180px] right-[174px] transform -translate-y-1/2 z-10 w-[40px] h-[40px] rounded-[10px] bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
        <span className="text-2xl text-[#4B5563]"><MdKeyboardArrowRight />
        </span>
      </button>
    </div>
  );
};
