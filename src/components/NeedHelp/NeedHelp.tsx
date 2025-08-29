import { Paragraph } from "../index"
import { useTranslation } from "../../../public/Locales/context/TranslationContext"

export const NeedHelp = () => {
    const { t } = useTranslation()
    return (
        <div className="flex justify-center w-full transition-all duration-500 order-2 md:order-2 lg:order-1">
            <div className="text-center flex flex-col items-center">
                <img src="/images/ru.png" alt="Need_help" className="max-w-[650px] lg:max-w-[550px] md:max-w-[450px] sm:max-w-[320px] w-full transition-all duration-500" />
                <Paragraph className="max-w-[650px] lg:max-w-[550px] md:max-w-[450px] sm:max-w-[320px] mt-[clamp(14px,1.8vw,24px)] text-gray-700 text-[clamp(16px,2vw,24px)] transition-all duration-500">
                    {t("Напишите нам на почту")} <span className="font-bold text-[#28B13D]">info@invin.uz</span>
                </Paragraph>
            </div>
        </div>
    )
}