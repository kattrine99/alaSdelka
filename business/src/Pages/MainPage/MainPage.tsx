import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar } from "../../components";
import { useState } from "react";
import { detailedBusinessCardsMock } from "./TempBusinessDb";
import { categories } from "./variables";

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("Бизнес");

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />

            <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
                <div className="py-[70px] px-4 sm:px-8 md:px-[96px] xl:px-[192px] bg-[url(/images/House.png)] bg-no-repeat bg-[length:924px] bg-[position:right_bottom_-20rem]">
                    {/* Текст */}
                    <div className="z-10 order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,60px)] font-bold leading-tight text-black"
                        />
                        <Paragraph className="text-[clamp(16px,1.5vw,18px)] text-gray-700">
                            <span className="text-[#28B13D] font-semibold">Invest In</span> — первая в Узбекистане специализированная площадка для размещения объявлений о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов.
                        </Paragraph>

                        <div className="flex gap-10 pt-2">
                            <div>
                                <Paragraph className="text-[#28B13D] text-[40px] font-bold">1000+</Paragraph>
                                <Paragraph className="text-[20px] font-bold">партнеров</Paragraph>
                            </div>
                            <div>
                                <Paragraph className="text-[#28B13D] text-[40px] font-bold">2000+</Paragraph>
                                <Paragraph className="text-[20px] font-bold">сделок</Paragraph>
                            </div>
                            <div>
                                <Paragraph className="text-[#28B13D] text-[40px] font-bold">10000</Paragraph>
                                <Paragraph className="text-[20px] font-bold">объявлений</Paragraph>
                            </div>
                        </div>

                        {/* Поиск */}
                        <div className="mt-4 w-full flex flex-col items-center max-w-6xl relative">
                            {/* Категории */}
                            <div className="w-full bg-white rounded-t-xl border-b border-[#E0E0E0]">
                                <NavLinks
                                    links={categories}
                                    variant="tabs"
                                    activeLabel={selectedCategory}
                                    onClick={setSelectedCategory}
                                    className="flex gap-8 px-4 sm:px-6 md:px-10 pt-4"
                                />
                            </div>

                            {/* Фильтр */}
                            <div className="w-full">
                                <FilterBar />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Карточки */}
            <section className="mt-[50px]">
                <CardSection title="Бизнес" description="Описание" cards={detailedBusinessCardsMock} to="/business" maxVisible={8} />
            </section>
            <section className="mt-[50px]">
                <CardSection title="Франшиза" description="Описание" cards={detailedBusinessCardsMock} to="/franchise" maxVisible={8} />
            </section>
            <section className="mt-[50px]">
                <CardSection title="Стартапы" description="Описание" cards={detailedBusinessCardsMock} to="/startups" maxVisible={8} />
            </section>
            <section className="mt-[50px]">
                <CardSection title="Инвестиции" description="Описание" cards={detailedBusinessCardsMock} to="/investments" maxVisible={4} />
            </section>
        </div>
    );
};
