import { Paragraph } from "../Typography/Paragraph/Paragraph"
import FrameIcon from '../../assets/frame.svg?react'
import CopyIcon from '../../assets/copy-success.svg?react'
import WalletIcon from '../../assets/wallet-add.svg?react'
import { MdOutlineArrowDropDown } from "react-icons/md"
import { FaLocationDot } from "react-icons/fa6"
export const Filters = () => {
    return (
        <div className="w-full mt-5">
            {/*Категории*/}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FrameIcon className="text-[#2EAA7B]" />
                    <Paragraph>Категории</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                        <option value={""}>Все категории</option>
                        <option>Кафе</option>
                        <option>категория</option>
                        <option>категория</option>
                    </select>
                    <MdOutlineArrowDropDown
                        className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                    />
                </div>
            </div>
            {/*Город*/}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-[#2EAA7B]" />
                    <Paragraph>Город</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                        <option value={""}>Выбрать</option>
                        <option>Ташкент</option>
                        <option>Самарканд</option>
                        <option>Бухара</option>
                    </select>
                    <MdOutlineArrowDropDown
                        className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                    />
                </div>
            </div>
            {/*Стадия проекта*/}
            <div className="w-[286px] gap-y-2">
                <div className="flex items-center gap-2">
                    <CopyIcon className="text-[#2EAA7B]" />
                    <Paragraph>Стадия проекта</Paragraph>
                </div>
                <div className="relative mt-2 mb-4">
                    <select className="bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 text-black focus:outline-none appearance-none ">
                        <option value={""}>Выбрать</option>
                        <option>категория</option>
                        <option>категория</option>
                        <option>категория</option>
                    </select>
                    <MdOutlineArrowDropDown
                        className="absolute right-[25px] top-1/2 -translate-y-1/2 text-xl text-[#191919] pointer-events-none"
                    />
                </div>
            </div>
        </div>
    )
}