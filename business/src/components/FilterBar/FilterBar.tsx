import { useState, useRef, useEffect } from "react";
import { FaLocationDot, FaClock, FaDollarSign } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { categories } from "../../utils/variables";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";


export const FilterBar = () => {
    const [price, setPrice] = useState<number>(20);
    const sliderRef = useRef<HTMLInputElement>(null);
    const [labelPosition, setLabelPosition] = useState("0px");
    const [selectedCategory] = useState("Бизнес");
    const navigate = useNavigate();

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
        <div className="flex w-[1008px] items-center gap-4 border-[#28B13D] rounded-xl rounded-l-[0px] px-4 py-3 bg-white">
            <div className="w-[737px] flex items-center rounded-xl rounded-r-2xl border border-[#28B13D]">
                {/* Город */}
                <div className="flex items-center gap-2 px-4 py-2">
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
                <div className="h-7.5 border-2 border-[#D9D9D9]" />

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
                <div className="h-7.5 border-2 border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[#28B13D] text-lg">
                        <FaDollarSign />
                    </span>
                    <span className="text-sm text-black">Цена</span>
                    <div className="relative w-[180px] pr-[55px]">
                        {/* Цена над бегунком */}
                        <span
                            className="absolute -top-4 text-sm font-medium text-black transition-all duration-100"
                            style={{ left: labelPosition, transform: "translateX(-50%)" }}
                        >
                            {price} млн
                        </span>

                        {/* Слайдер */}
                        <Input
                            isError={false}
                            ref={sliderRef}
                            type="range"
                            min="0"
                            max="100"
                            value={price.toString()}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className="w-full h-2 rounded-full appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-[#28B13D] [&::-webkit-slider-thumb]:rounded-full"
                            style={{
                                background: `linear-gradient(to right, #28B13D ${price}%, #e0e0e0 ${price}%)`,
                            }}
                        />
                    </div>
                </div>

                {/* Кнопка поиска */}
                <Button className="bg-[#28B13D] text-white text-sm font-semibold h-[54px] w-full hover:bg-green-600 transition rounded-r-xl overflow-hidden cursor-pointer">
                    Поиск
                </Button>
            </div>

            {/* Кнопка "Перейти к категории" */}
            <Button
                onClick={() => {
                    const current = categories.find((cat) => cat.label === selectedCategory);
                    if (current) navigate(current.to);
                }}
                className="text-[#28B13D] w-[200px] h-[54px] border border-[#28B13D] rounded-xl font-semibold hover:bg-[#28B13D] hover:text-white transition text-[15px]">
                Перейти к категории
            </Button>
        </div >
    );
};
