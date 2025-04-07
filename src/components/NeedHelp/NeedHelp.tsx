import { Paragraph } from "../index"

export const NeedHelp = () => {
    return (
        <div className="flex justify-center w-full transition-all duration-500 order-2 md:order-2 lg:order-1">
            <div className="text-center flex flex-col items-center">
                <img src="/images/ru.png" alt="Need_help" className="max-w-[650px] lg:max-w-[550px] md:max-w-[450px] sm:max-w-[320px] w-full transition-all duration-500" />
                <Paragraph className="max-w-[650px] lg:max-w-[550px] md:max-w-[450px] sm:max-w-[320px] mt-[clamp(14px,1.8vw,24px)] text-gray-700 text-[clamp(16px,2vw,24px)] transition-all duration-500">
                    Обращайтесь по номеру <span className="font-bold text-[#28B13D]">+998 71 789 78 78</span> или
                    напишите нам на почту <span className="font-bold text-[#28B13D]">info@name-com.uz</span>
                </Paragraph>
            </div>
        </div>
    )
}