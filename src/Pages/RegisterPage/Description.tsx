import { useTranslation } from "../../../public/Locales/context/TranslationContext"

interface Descriptionprops {
    showCards: boolean,
    showLaptop: boolean,
}
export const Description: React.FC<Descriptionprops> = ({
    showCards,
    showLaptop }) => {
    const { t } = useTranslation()
    return (
        <div>
            {showCards && (<div className="grid grid-cols-3 max-xl:px-8 pb-[123px] w-full relative">
                {/* Card 01 */}
                <div className="relative flex flex-col text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-1.png" className="w-62 h-auto relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-[#252525] font-inter text-[24px] font-semibold mb-[15px] relative z-10">{t("Начни свой бизнес легко!")}</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            {t("Выберите готовый бизнес, франшизу или инвестиционный проект. Простая регистрация, удобный поиск, множество актуальных предложений от собственников и инвесторов")}                        </p>
                        <span className="absolute top-[387px] text-[160px] leading-[105%] opacity-[10%] font-bold text-[#252525] z-0" style={{ fontFamily: "Actay Wide Bd" }}>01</span>
                    </div>

                </div>
                {/* Card 02 */}
                <div className="relative flex flex-col mt-[154px] text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-2.png" className="w-[250px] h-auto mb-4 relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-[#252525] text-inter text-[24px] font-semibold mb-[15px] relative z-10">{t("Развивайся вместе с нами!")}</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            {t("У нас вы найдете надежных партнеров, инвесторов и готовые решения для роста вашего бизнеса. Инвестируйте или привлекайте капитал легко и быстро через нашу платформу.")}                        </p>
                        <span className="absolute bottom-[340px] right-[33px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0" style={{ fontFamily: "Actay Wide Bd" }}>02</span>

                    </div>

                </div>
                {/* Card 03 */}
                <div className="relative flex flex-col text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-3.png" className="w-[250px] h-auto mb-4 relative z-10" />
                    </div>
                    <h3 className="text-[#252525] text-inter text-[24px] font-semibold mb-[15px] relative z-10">{t("Инвестируй с умом!")}</h3>
                    <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                        {("Платформа объединяет предпринимателей и инвесторов. Здесь каждый может найти выгодный проект, купить готовый бизнес или вложиться в перспективную франшизу.")}                    </p>
                    <span className="absolute top-[397px] right-[9px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0" style={{ fontFamily: "Actay Wide Bd" }}>03</span>

                </div>
            </div>)}
            {showLaptop && (<div className="mb-18.5">
                <img src="/images/Laptop.png" />
            </div>)}
        </div>

    )
}