import { ICard } from "../Cards/Cards";
import { Heading, Paragraph, Cards } from "../index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";


interface PopularSliderSectionProps {
  cards: ICard[];
  title?: string;
  description?: string;
}

export const PopularSliderSection: React.FC<PopularSliderSectionProps> = ({
  cards,
  title = "Популярное",
  description = "Самые просматриваемые предложения",
}) => {
  const popularCards = cards.filter((card) => card.popular);

  if (popularCards.length === 0) return null;

  return (
    <div className="px-[192px] mt-[50px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={2} text={title} className="text-[30px] font-bold mb-1 text-black" />
          <Paragraph className="text-[16px] text-gray-500">{description}</Paragraph>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {popularCards.map((card) => (
          <SwiperSlide key={card.id}>
            <Cards cards={cards}  />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
