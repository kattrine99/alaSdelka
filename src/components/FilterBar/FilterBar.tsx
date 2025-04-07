import { useState } from "react";
import { FaLocationDot, FaClock, FaDollarSign } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { categories } from "../../utils/variables";
import { Button, Input } from "../index";
import { MdOutlineArrowDropDown } from "react-icons/md";


export const FilterBar = () => {
    const [selectedCategory] = useState("Бизнес");
    const navigate = useNavigate();

    return (
        <div className="w-[1536px] flex items-center  gap-3 pl-[28px] py-[13px] bg-white rounded-[24px] rounded-tl-[0px]">
            <div className="flex w-[819px] items-center rounded-xl rounded-r-2xl border border-[#EAEBF0] bg-white">
                {/* Город */}
                <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[#2EAA7B] text-lg w-[16px] h-[16px]">
                        <FaLocationDot />
                    </span>
                    <div className="relative ">
                        <select className="w-[100px] text-[15px] text-black focus:outline-none bg-transparent appearance-none">
                            <option>Город</option>
                            <option>Ташкент</option>
                            <option>Самарканд</option>
                        </select>
                        <MdOutlineArrowDropDown
                            className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                        />
                    </div>
                </div>

                {/* Разделитель */}
                <div className="h-7.5 mx-3 border-l border-[#D9D9D9]" />

                {/* Окупаемость */}
                <div className="relative flex w-[176px] items-center gap-2 px-4 py-2">
                    <span className="text-[#2EAA7B] text-lg">
                        <FaClock />
                    </span>
                    <select className="text-[15px] w-[163px] text-black focus:outline-none bg-transparent appearance-none">
                        <option>Окупаемость</option>
                        <option>1 года</option>
                        <option>1-2 года</option>
                        <option>2 лет</option>
                    </select>
                    <MdOutlineArrowDropDown
                        className="absolute right-[5px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                    />
                </div>

                {/* Разделитель */}
                <div className="h-7.5 mx-3 border-l border-[#D9D9D9]" />

                {/* Цена */}
                <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-[#2EAA7B] text-lg">
                        <FaDollarSign />
                    </span>
                    <span className="text-[15px] text-black">Цена</span>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">от</span>
                            <input
                                type="text"
                                placeholder="100 000"
                                className="w-[80px] text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                            />
                            <span className="text-[16px] text-black">сум</span>
                        </div>

                        <div className="flex items-center gap-1 px-4 py-[14px] bg-[#F0F1F2] rounded-[14px]">
                            <span className="text-[16px] text-black">до</span>
                            <input
                                type="text"
                                placeholder="100 000"
                                className="w-[80px] text-[16px] font-semibold text-[#3C3C3C] bg-transparent outline-none placeholder:text-[#787878]"
                            />
                            <span className="text-[16px] text-black">сум</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Поиск */}
            <div className="flex gap-2.5 h-[54px]">
                <div className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 w-[450px] bg-white overflow-hidden">
                    <div className="flex items-center justify-center text-[#2EAA7B]">
                        <FiSearch className="w-[24px] h-[24px]" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Поиск по названию или ID"
                        isError={false}
                        className="flex-1 w-full text-4 px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
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
                    className="text-[#2EAA7B] w-[210px] h-[54px] border border-[#2EAA7B] rounded-xl font-semibold hover:bg-[#2EAA7B] hover:text-white transition text-[15px]">
                    Перейти к категории
                </Button>
            </div>
        </div>

    );
};
