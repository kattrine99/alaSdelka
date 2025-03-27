import { Header, Heading, Paragraph, NavLinks, CardSection } from "../../components";
import { useState } from "react";
import { detailedBusinessCardsMock } from "./TempBusinessDb"
import { categories } from './variables'

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <div className="font-[Open_Sans] w-screen">
            <Header />
            <section className="relative pt-[96px] min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
                <div className="relative max-w-[1920px] mx-auto min-h-[calc(100vh-96px)] px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center z-10">

                    {/* Левая часть */}
                    <div className="z-10 order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,60px)]  font-bold leading-tight text-black"
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
                        <div className="mt-4 w-full bg-white rounded-xl shadow-md px-4 py-3 flex flex-col gap-4 items-center max-w-6xl relative">

                            {/* Категории (NavLinks) — только для десктопа */}
                            <div className="hidden sm:flex w-full flex-wrap gap-6 border-b-gray-500 pb-2">
                                <NavLinks
                                    links={categories}
                                    className="gap-6"
                                    linkClassName="text-[18px] font-semibold text-[#787878] pb-1 border-b-2 transition-all hover:text-[#28B13D] hover:border-[#28B13D]"
                                />
                            </div>

                            {/* Выпадающее меню категорий — только для мобилок */}
                            <div className="sm:hidden w-full">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28B13D]"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.label} value={cat.label}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Поле поиска и кнопки */}
                            <div className="flex w-full flex-wrap sm:flex-nowrap sm:items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Поиск по фильтрам..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28B13D] text-sm"
                                />

                                <button className="bg-[#28B13D] text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600 transition text-sm whitespace-nowrap">
                                    Поиск
                                </button>

                                {/* Только на десктопе */}
                                <button className="hidden sm:block text-[#28B13D] border border-[#28B13D] px-6 py-2 rounded-md font-semibold hover:bg-[#28B13D]/10 transition text-sm whitespace-nowrap">
                                    Перейти к категории
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть — фон с домом */}
                    <div className="order-1 lg:order-2 relative w-full h-[300px] lg:h-full z-0">
                        <img
                            src="/images/House.png"
                            alt="Дом"
                            className="absolute right-0 top-0 w-full h-full object-contain lg:object-cover lg:w-[130%] xl:w-[140%] transition-all duration-500"
                        />
                    </div>
                </div>
            </section>
            <section className="max-w-[1920px] mt-[50px]">
                <CardSection title={"Бизнес"} description="Описание" cards={detailedBusinessCardsMock} to={"/business"} />
            </section>
            <section className="max-w-[1920px] mt-[50px] ">
                <CardSection title={"Франшиза"} description="Описание" cards={detailedBusinessCardsMock} to={"/franchise"} />
            </section>
            <section className="max-w-[1920px] mt-[50px]">
                <CardSection title={"Стартапы"} description="Описание" cards={detailedBusinessCardsMock} to={"/startups"} />
            </section>
            <section className="max-w-[1920px] mt-[50px]">
                <CardSection title={"Инвестиции"} description="Описание" cards={detailedBusinessCardsMock} to={"/investments"} maxVisible={4} />
            </section>
        </div>
    );
};
