import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

export const PhotosSwiper = ({ photos }: { photos: { photo: string }[] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    useEffect(() => {
        return () => thumbsSwiper?.destroy(true, true);
    }, [thumbsSwiper]);

    return (
        <div className=" w-full max-w-260 bg-[#F8F8F8]">
            {/* Основной свайпер */}
            <Swiper
                spaceBetween={5}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="border border-[#2EAA7B] max-md:border-0 rounded-xl">
                {photos.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={item.photo}
                            alt={`photo-${index}`}
                            className="object-contain m-15 max-md:my-2 w-full max-h-100 rounded-lg mx-auto"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Мини-слайдер */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={Math.min(photos.length, 8)}
                watchSlidesProgress
                className="mt-4"
            >
                {photos.map((item, index) => (
                    <SwiperSlide key={index} className="!w-[60px] !h-[60px]">
                        <img
                            src={item.photo}
                            alt={`thumb-${index}`}
                            className="w-full h-full object-cover rounded-md border-2 border-transparent hover:border-[#2EAA7B] cursor-pointer"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
