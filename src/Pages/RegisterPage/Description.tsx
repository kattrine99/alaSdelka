interface Descriptionprops {
    showCards: boolean,
    showLaptop: boolean,
}
export const Description: React.FC<Descriptionprops> = ({
    showCards,
    showLaptop }) => {
    return (
        <div>
            {showCards && (<div className="grid grid-cols-3 pb-[123px] pl-[37px] w-full relative">
                {/* Card 01 */}
                <div className="relative flex flex-col text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-1.png" className="w-[250px] h-auto relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-[#252525] font-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                        </p>
                        <span className="absolute top-[387px] text-[160px] leading-[105%] opacity-[10%] font-bold text-[#252525] z-0" style={{ fontFamily: "Actay Wide Bd" }}>01</span>
                    </div>

                </div>
                {/* Card 02 */}
                <div className="relative flex flex-col mt-[154px] text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-2.png" className="w-[250px] h-auto mb-4 relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-[#252525] text-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                        </p>
                        <span className="absolute bottom-[340px] right-[33px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0" style={{ fontFamily: "Actay Wide Bd" }}>02</span>

                    </div>

                </div>
                {/* Card 03 */}
                <div className="relative flex flex-col text-left">
                    <div className="mx-8.25 mb-7.75">
                        <img src="/images/benefits-img-3.png" className="w-[250px] h-auto mb-4 relative z-10" />
                    </div>
                    <h3 className="text-[#252525] text-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                    <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                        Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                    </p>
                    <span className="absolute top-[397px] right-[9px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0" style={{ fontFamily: "Actay Wide Bd" }}>03</span>

                </div>
            </div>)}
            {showLaptop && (<div className="mb-18.5">
                <img src="/images/Laptop.png" />
            </div>)}
        </div>

    )
}