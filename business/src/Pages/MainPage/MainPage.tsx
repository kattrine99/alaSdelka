import { Header, Heading, Paragraph, NavLinks, Cards } from "../../components";
import { useState } from "react";
import { detailedBusinessCardsMock } from "./TempBusinessDb"

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const categories = ["Бизнес", "Франшиза", "Стартап", "Инвестиции"];

    return (
        <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-[#F8FFF5] to-[#FAFFF9]">
            <Header />

            <section className="relative pt-[96px] w-full overflow-hidden">
                <div className="relative max-w-[1920px] mx-auto min-h-[calc(100vh-96px)] px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center z-10">

                    {/* Левая часть */}
                    <div className="z-10 order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-black"
                        />
                        <Paragraph className="text-[clamp(16px,1.5vw,18px)] text-gray-700">
                            <span className="text-[#28B13D] font-semibold">Invest In</span> — первая в Узбекистане специализированная площадка для размещения объявлений о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов.
                        </Paragraph>

                        <div className="flex gap-10 pt-2">
                            <div>
                                <Paragraph className="text-green-600 text-xl font-bold">1000+</Paragraph>
                                <Paragraph className="text-sm">партнеров</Paragraph>
                            </div>
                            <div>
                                <Paragraph className="text-green-600 text-xl font-bold">2000+</Paragraph>
                                <Paragraph className="text-sm">сделок</Paragraph>
                            </div>
                            <div>
                                <Paragraph className="text-green-600 text-xl font-bold">10000</Paragraph>
                                <Paragraph className="text-sm">объявлений</Paragraph>
                            </div>
                        </div>

                        {/* Навигация по категориям */}
                        <div className="hidden sm:flex bg-white rounded-xl shadow-md px-6 py-2 items-center gap-6 w-full max-w-2xl">
                            <NavLinks
                                links={categories.map(c => ({ label: c, to: "#" }))}
                                className="flex-wrap"
                                linkClassName="text-sm font-medium text-gray-600 hover:text-[#28B13D] border-b-2 border-transparent hover:border-[#28B13D] transition-all pb-1"
                            />
                        </div>

                        {/* Поиск */}
                        <div className="mt-4 w-full bg-white rounded-xl shadow-md px-4 py-3 flex flex-col sm:flex-row gap-4 items-center max-w-2xl relative">

                            {/* Выпадающее меню категорий на мобилке */}
                            <div className="sm:hidden w-full flex justify-between">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#28B13D]"
                                >
                                    <option value="">Категория</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Поле поиска + кнопка */}
                            <div className="flex w-full sm:flex-grow sm:gap-3 items-center">
                                <input
                                    type="text"
                                    placeholder="Поиск по фильтрам..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28B13D] text-sm"
                                />
                                <button className="ml-2 whitespace-nowrap bg-[#28B13D] text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600 transition text-sm">
                                    Поиск
                                </button>
                            </div>

                            {/* Скрывается на мобилке */}
                            <button className="hidden sm:block text-[#28B13D] border border-[#28B13D] px-6 py-2 rounded-md font-semibold hover:bg-[#28B13D]/10 transition text-sm whitespace-nowrap">
                                Перейти к категории
                            </button>
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
            <section>
                <Heading text={"Бизнес"} level={2} />
                <Cards cards={detailedBusinessCardsMock} />
            </section>
        </div>
    );
};
