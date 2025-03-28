import { useState, useRef, useEffect } from "react";
import { FaLocationDot, FaClock, FaDollarSign } from "react-icons/fa6";

export const FilterBar = () => {
    const [price, setPrice] = useState<number>(20);
    const sliderRef = useRef<HTMLInputElement>(null);
    const [labelPosition, setLabelPosition] = useState("0px");

    // вычисляем позицию метки при изменении price
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const percent = (price - Number(slider.min)) / (Number(slider.max) - Number(slider.min));
            const sliderWidth = slider.offsetWidth;
            const offset = percent * sliderWidth;
            setLabelPosition(`${offset}px`);
        }
    }, [price]);

    return (
        <div className="flex w-[1008px] flex-wrap items-center gap-4 border-[#28B13D] rounded-xl rounded-l-[0px] px-4 py-3 bg-white">
            <div className="flex items-center rounded-xl border border-[#28B13D]">
                {/* Город */}
                <div className="flex items-center gap-2 p-[12px]">
                    <span className="text-[#28B13D] text-lg w-[16px] h-[16px]">
                        <FaLocationDot />
                    </span>
                    <select className="text-sm text-black focus:outline-none bg-transparent">
                        <option>Город</option>
                        <option>Ташкент</option>
                        <option>Самарканд</option>
                    </select>
                </div>

                {/* Разделитель */}
                <div className="h-6 w-px border-2 border-[#D9D9D9]" />

                {/* Окупаемость */}
                <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[#28B13D] text-lg">
                        <FaClock />
                    </span>
                    <select className="text-sm text-black focus:outline-none bg-transparent">
                        <option>Окупаемость</option>
                        <option>1 года</option>
                        <option>1-2 года</option>
                        <option>2 лет</option>
                    </select>
                </div>

                {/* Разделитель */}
                <div className="h-6 w-px border-2 border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[#28B13D] text-lg">
                        <FaDollarSign />
                    </span>
                    <span className="text-sm text-black">Цена</span>
                    <div className="relative w-[180px] pr-[55px]">
                        {/* Цена над бегунком */}
                        <span
                            className="absolute -top-4.5 text-sm font-medium text-black transition-all"
                            style={{ left: labelPosition, transform: "translateX(-50%)" }}
                        >
                            {price} млн
                        </span>

                        {/* Слайдер */}
                        <input
                            ref={sliderRef}
                            type="range"
                            min="0"
                            max="100"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className="w-full h-2 appearance-auto rounded-full bg-gray-200 accent-[#28B13D]
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:bg-[#28B13D] [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-[#28B13D] [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                {/* Кнопка поиска */}
                <button className="bg-[#28B13D] text-white text-sm font-semibold px-8 py-6 h-full w-full hover:bg-green-600 transition rounded-r-xl cursor-pointer">
                    Поиск
                </button>
            </div>

            {/* Кнопка "Перейти к категории" */}
            <button className="text-[#28B13D] border border-[#28B13D] p-6 rounded-md font-semibold hover:bg-[#28B13D] hover:text-white transition text-sm">
                Перейти к категории
            </button>
        </div >
    );
};
