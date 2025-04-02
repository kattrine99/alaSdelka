import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar, categories } from "../../components";
import { useState } from "react";
import { TempBusinessCardsMock } from "../../utils/TempBusinessCardsMock";
import { ICard } from "../../components/Cards/Cards";
import { Footer } from "../../components/Footer/Footer";
import { titleToTypeMap } from "../../utils/categoryMap";

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("Бизнес");

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header showLogo={false} />
            <section className="relative overflow-hidden bg-gradient-to-tr from-[#16503A] to-[#31B683]">
                <div className="absolute right-[-80px] bottom-[-9rem] w-[850px] h-[850px] bg-[url('/images/Check.png')] bg-no-repeat bg-contain rotate-[12deg] pointer-events-none z-0"></div>
                <div className="relative py-[70px] px-4 sm:px-8 md:px-[96px] xl:px-[192px] overflow-hidden">
                    {/* Текст */}
                    <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,60px)] font-bold leading-tight text-white"
                        />
                        <Paragraph className="text-[clamp(16px,1.5vw,18px)] text-white font-semibold text-xl">
                            <span className="text-[40px] font-bold">Invest In</span> — первая в Узбекистане специализированная площадка для размещения объявлений о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов.
                        </Paragraph>

                        {/* Поиск */}
                        <div className="mt-4 w-full flex flex-col max-w-6xl relative">
                            {/* Категории */}
                            <div className="w-[566px] bg-white rounded-t-xl border-b border-[#E0E0E0]">
                                <NavLinks
                                    links={categories}
                                    variant="tabs"
                                    activeLabel={selectedCategory}
                                    onClick={setSelectedCategory}
                                    className="flex text-[18px] font-openSans font-semibold"
                                    activeClassName="text-[#2EAA7B] w-[136px] py-[14px] px-[17px]  border-b"
                                    inactiveClassName="text-[#787878] w-[136px] py-[14px] px-[17px] hover:text-[#2EAA7B] "
                                    underlineColor="bg-[#2EAA7B]"
                                />
                            </div>

                            {/* Фильтр Поиск*/}
                            <FilterBar />
                        </div>
                    </div>
                </div>
            </section>

            {/* Карточки */}
            <section className="mt-[50px]">
                <CardSection title="Бизнес" description="Описание" cards={TempBusinessCardsMock as ICard[]} to="/business" maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" />
            </section>
            <section className="mt-[50px]">
                <CardSection title="Франшиза" description="Описание" cards={TempBusinessCardsMock as ICard[]} to="/franchise" maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" />
            </section>
            <section className="mt-[50px]">
                <CardSection title="Стартапы" description="Описание" cards={TempBusinessCardsMock as ICard[]} to="/startups" maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" />
            </section>
            <section className="my-[50px] ">
                <CardSection title="Инвестиции" description="Описание" cards={TempBusinessCardsMock as ICard[]} to="/investments" maxVisible={4} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" />
            </section>
            {/* Города */}
            <section className="relative min-h-[610px] w-screen overflow-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
                <div className="min-h-[610px] bg-[url(./images/Streets.png)] bg-center-bottom bg-no-repeat bg-cover">
                    <div className="py-[70px] px-4 sm:px-8 md:px-[96px] xl:px-[192px]">
                        <Heading
                            text={"Города"}
                            level={2}
                            className="font-openSans font-bold text-3xl leading-[100%] mb-[25px]"
                        />

                        {/* КАТЕГОРИИ */}
                        <NavLinks
                            links={categories}
                            variant="tabs"
                            activeLabel={selectedCategory}
                            onClick={setSelectedCategory}
                            className="flex gap-4 text-[24px] text-start font-openSans mb-[25px] font-bold"
                            activeClassName="w-[234px] px-6 py-4 bg-[#28B13D] text-white rounded-xl"
                            inactiveClassName="w-[234px] bg-white font-openSans text-[#232323] border border-[#28B13D] rounded-xl hover:bg-[#28B13D]/10"
                        />

                        {/* ГОРОДА */}
                        <div className="flex flex-wrap gap-[20px]">
                            {Object.entries(
                                TempBusinessCardsMock

                                    .filter((card) => card.type === titleToTypeMap[selectedCategory])
                                    .reduce((acc: Record<string, number>, card) => {
                                        acc[card.city] = (acc[card.city] || 0) + 1;
                                        return acc;
                                    }, {})
                            ).map(([city, count], idx) => (
                                <div
                                    key={idx}
                                    className="bg-black font-openSans text-white w-[234px] rounded-xl px-6 py-4 flex flex-col items-start"
                                >
                                    <span className="text-2xl leading-[150%] font-bold">{city}</span>
                                    <span className="font-bold leading-[150%] font-Urbanist text-[40px] ">{count.toLocaleString("ru-RU")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative min-h-[783px] w-screen overflow-hidden bg-white">
                <div className="py-[70px] px-[192px]">
                    <Heading text={"Описание о нас"} level={2} className="font-openSans font-bold text-3xl leading-[100%]" />
                </div>
                <div className="text-center items-center pb-[50px]">
                    <Paragraph className="font-bold uppercase text-7xl"> Soon...</Paragraph>
                </div>
            </section>
            <Footer />
        </div>
    );
};
