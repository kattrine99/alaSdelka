import { useState } from "react";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { categories } from "../../utils/variables";
import { Button, Input } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi2";


export const FilterBar = () => {
    const [selectedCategory] = useState("Бизнес");
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 px-4 py-[13px] bg-white rounded-[24px] rounded-tl-[0px]">
            <div className=" w-full flex items-center rounded-xl rounded-r-2xl border border-[#EAEBF0] bg-white">
                {/* Город */}
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg h-[16px]">
                        <FaLocationDot />
                    </span>
                    <div className="relative ">
                        <select className="text-[15px] text-black focus:outline-none bg-transparent appearance-none">
                            <option>Город</option>
                            <option>Ташкент</option>
                            <option>Самарканд</option>
                        </select>
                    </div>
                    <MdOutlineArrowDropDown
                        className=" text-xl text-[#191919] pointer-events-none"
                    />
                </div>

                {/* Разделитель */}
                <div className="h-7.5 border-l border-[#D9D9D9]" />

                {/* Окупаемость */}
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-lg">
                        <FaClock />
                    </span>
                    <select className="text-[15px] text-black focus:outline-none bg-transparent appearance-none">
                        <option>Окупаемость</option>
                        <option>1 года</option>
                        <option>1-2 года</option>
                        <option>2 лет</option>
                    </select>
                    <MdOutlineArrowDropDown
                        className="text-xl text-[#191919] pointer-events-none"
                    />
                </div>

                {/* Разделитель */}
                <div className="h-7.5  border-l border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-[#2EAA7B] text-2xl">
                        <HiCurrencyDollar />
                    </span>
                    <span className="text-[15px] text-black">Цена</span>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-x-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">от</span>
                            <Input
                                type="text"
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[16px] text-black">сум</span>
                        </div>

                        <div className="flex items-center gap-1 px-4 py-1.5 w-44 bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">до</span>
                            <Input
                                type="text"
                                placeholder="100 000"
                                className="text-[16px] w-full font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]" isError={false} />
                            <span className="text-[16px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Поиск */}
            <div className="w-full flex gap-2.5 h-[54px] justify-end">
                <div className="flex w-full items-center border border-[#2EAA7B] rounded-xl pl-5 bg-white overflow-hidden">
                    <div className="flex items-center justify-center text-[#2EAA7B]">
                        <FiSearch className="h-[24px]" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Поиск по названию или ID"
                        isError={false}
                        className="w-full text-4 px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
                    />
                    <Button className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-green-600 transition rounded-none">
                        Поиск
                    </Button>
                </div>

                <Button
                    onClick={() => {
                        const current = categories.find((cat) => cat.label === selectedCategory);
                        if (current) navigate(current.to);
                    }}
                    className="text-[#2EAA7B] py-1 px-5 border border-[#2EAA7B] rounded-xl font-semibold hover:bg-[#2EAA7B] hover:text-white transition text-[15px]">
                    Перейти к категории
                </Button>
            </div>
        </div>

    );
};
