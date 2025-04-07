import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar, categories, Button, Footer } from "../../components";
import { useState } from "react";
import { TempBusinessCardsMock } from "../../utils/TempBusinessCardsMock";
import { ICard } from "../../components/Cards/Cards";
import { titleToTypeMap } from "../../utils/categoryMap";
import { useNavigate } from "react-router-dom";
import ShopIcon from '../../assets/shop.svg?react';

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("Бизнес");
    const navigate = useNavigate();

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
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
            <section className="mt-[50px] mb-[35px]">
                <div className="px-[192px] flex justify-start gap-[272px]" >
                    <div>
                        <Button onClick={() => {
                            navigate("/business")
                        }} className={""}>
                            <Heading level={2} text="Бизнес" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                        </Button>
                        <Paragraph className="text-[16px] mt-1.5 text-[#787878]">Описание</Paragraph>
                    </div>
                    <div className="flex gap-[42px] text-center">
                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка бизнеса
                        </Button>

                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа бизнеса
                        </Button>
                    </div>

                </div>
                <CardSection title="Бизнес" cards={TempBusinessCardsMock as ICard[]} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
            </section>
            <section className="mt-[50px] mb-[35px]">
                <div className="px-[192px] flex justify-start gap-[272px]">
                    <div>
                        <Button onClick={() => {
                            navigate("/franchise")
                        }} className={""}>
                            <Heading level={2} text="Франшиза" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                        </Button>
                        <Paragraph className="text-[16px] mt-1.5 text-[#787878]">Описание</Paragraph>
                    </div>
                    <div className="flex gap-[42px] text-center">
                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white transition duration-500 text-[16px] font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка франшизы
                        </Button>

                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white transition duration-500 text-[16px] font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа франшизы
                        </Button>
                    </div>
                </div>
                <CardSection title="Франшиза" cards={TempBusinessCardsMock as ICard[]} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
            </section>
            <section className="mt-[50px] mb-[35px]">
                <div className="px-[192px] flex justify-start gap-[272px]">
                    <div>
                        <Button onClick={() => {
                            navigate("/startups")
                        }} className={""}>
                            <Heading level={2} text="Стартапы" className="font-openSans font-bold hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 text-3xl cursor-pointer" />
                        </Button>
                        <Paragraph className="text-[16px] mt-1.5 text-[#787878]">Описание</Paragraph>
                    </div>
                    <div className="flex gap-[42px] text-center">
                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white transition duration-500 text-[16px] font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка стартапа
                        </Button>

                        <Button className="flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white transition duration-500 text-[16px] font-inter leading-[150%] font-semibold">
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа стартапа
                        </Button>
                    </div>
                </div>
                <CardSection title="Стартапы" cards={TempBusinessCardsMock as ICard[]} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
            </section>
            <section className="my-[50px] mb-[35px]">
                <div className="px-[192px]">
                    <Button onClick={() => {
                        navigate('/investments')
                    }} className={""}>
                        <Heading level={2} text="Инвестиции" className="font-openSans font-bold text-3xl hover:text-[#2EAA7B] hover:underline hover:decoration-1 transition duration-500 cursor-pointer" />
                    </Button>
                    <Paragraph className="text-[16px] mt-1.5 text-[#787878]">Описание</Paragraph>
                </div>
                <CardSection title="Инвестиции" cards={TempBusinessCardsMock as ICard[]} maxVisible={4} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
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
                            activeClassName="w-[234px] px-6 py-4 bg-[#2EAA7B] text-white rounded-xl"
                            inactiveClassName="w-[234px] bg-white font-openSans text-[#232323] border border-[#2EAA7B] rounded-xl hover:bg-[#31B683]/10"
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
                                    className="bg-black font-openSans text-white w-[234px] rounded-xl px-6 py-4 flex flex-col items-start">
                                    <span className="text-2xl leading-[150%] font-bold">{city}</span>
                                    <span className="font-bold leading-[150%] font-Urbanist text-[40px] ">{count.toLocaleString("ru-RU")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/*Почему Invest In*/}
            <section className="relative overflow-hidden  w-full h-[907px] bg-[url('/images/Mask.png')] bg-repeat">
                <div className="absolute right-[197px] top-[61px] w-[702px] h-full bg-[url('/images/WhyInvestIn.png')] bg-no-repeat bg-contain px-[192px]" ></div>
                <div className="relative py-[70px] px-4 sm:px-8 md:px-[96px] xl:px-[192px] overflow-hidden">
                    <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-2xl w-full">
                        <Heading
                            level={1}
                            className="text-[clamp(32px,4vw,45px)] font-bold leading-tight text-black" text={""}>
                            Почему <span className="text-[#31B683]">Invest In — лучший инструмент</span><br />
                            для продажи бизнеса?
                        </Heading>

                        <Paragraph className="w-[893px] mt-[35px] text-[#232323] font-inter font-normal leading-[125%] text-3xl">
                            С Invest In благодаря поддержке на всех этапах сделки вы сможете продать свой бизнес на условиях, которые будут выгодны и удобны для вас. На нашем сайте уже:
                        </Paragraph>
                    </div>
                    {/*Цифры*/}
                    <div className="flex justify-start gap-5 mt-[58px]">
                        <div className="flex flex-col gap-[20px]">
                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    1900<span className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">объявлений</Paragraph>
                            </div>

                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    1200<span className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">сделок</Paragraph>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    120
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">партнёров</Paragraph>
                            </div>

                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    2 млн <span className="text-[#2EAA7B]">$</span>
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">продано бизнесов</Paragraph>
                            </div>
                        </div>
                    </div>


                </div>
            </section >
            <Footer showSmallFooter={true} />
        </div >
    );
};
