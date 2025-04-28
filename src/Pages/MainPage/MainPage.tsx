import { Header, Heading, Paragraph, NavLinks, CardSection, FilterBar, categories, Button, Footer } from "../../components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopIcon from '../../assets/shop.svg?react';
import InvestInIcon from '../../assets/investin_v15.svg?react';
import { useGetHomeOffersQuery } from "../../Store/api/Api";
import { useGetMainStatisticsQuery } from "../../Store/api/Api";

export const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции">("Бизнес")
        ;
    const navigate = useNavigate();
    const [listingTypes, setListingTypes] = useState<Record<"Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции", "buy" | "sell">>({
        Бизнес: "buy",
        Франшиза: "buy",
        Стартапы: "buy",
        Инвестиции: "buy",
    });

    const businessType = listingTypes["Бизнес"];
    const franchiseType = listingTypes["Франшиза"];
    const startupType = listingTypes["Стартапы"];

    const { data: mainStats } = useGetMainStatisticsQuery();
    const { data: businessOffers, isLoading: isLoadingBusiness, isError: isErrorBusiness } = useGetHomeOffersQuery(listingTypes["Бизнес"]);
    const { data: franchiseOffers, isLoading: isLoadingFranchise, isError: isErrorFranchise } = useGetHomeOffersQuery(listingTypes["Франшиза"]);
    const { data: startupOffers, isLoading: isLoadingStartup, isError: isErrorStartup } = useGetHomeOffersQuery(listingTypes["Стартапы"]);
    const { data: investmentOffers, isLoading: isLoadingInvestment, isError: isErrorInvestment } = useGetHomeOffersQuery(listingTypes["Инвестиции"]);
    const cityStats: Record<string, number> = {};
    mainStats?.cities_statistics.forEach((item) => {
        if (item.name_ru && item.offers_count > 0) {
            cityStats[item.name_ru] = item.offers_count;
        }
    });
    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <section className="relative overflow-hidden bg-gradient-to-tr from-[#16503A] to-[#31B683]">
                <div className="absolute right-[-80px] bottom-[-9rem] w-[850px] h-[850px] bg-[url('/images/Check.png')] bg-no-repeat bg-contain rotate-[12deg] pointer-events-none z-0"></div>
                <div className="relative container mx-auto py-[70px]">
                    {/* Текст */}
                    <div className="order-2 lg:order-1 flex flex-col gap-6 max-w-3xl w-full">
                        <Heading
                            level={1}
                            text="Купите, продайте или инвестируйте в бизнес"
                            className="text-[clamp(32px,4vw,60px)] font-bold leading-tight text-white"
                        />
                        <Paragraph className="text-white text-[clamp(16px,1.5vw,18px)] font-semibold leading-snug">
                            <span className="inline-flex items-baseline align-baseline relative top-2 mr-1">
                                <InvestInIcon className="w-[168.39px] h-auto" />
                            </span>
                            — первая в Узбекистане специализированная площадка для размещения объявлений
                            о продаже готового бизнеса, стартапов, франшиз и инвестиционных проектов.
                        </Paragraph>
                    </div>
                    {/* Поиск */}
                    <div className="mt-4 w-full flex flex-col relative">
                        {/* Категории */}
                        <div className="w-[566px] bg-white rounded-t-xl border-b border-[#E0E0E0]">
                            <NavLinks
                                links={categories}
                                variant="tabs"
                                activeLabel={selectedCategory}
                                onClick={(label) => {
                                    if (
                                        label === "Бизнес" ||
                                        label === "Франшиза" ||
                                        label === "Стартапы" ||
                                        label === "Инвестиции"
                                    ) {
                                        setSelectedCategory(label);
                                    }
                                }}
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
                        <Button onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "buy" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${businessType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка бизнеса
                        </Button>

                        <Button onClick={() => setListingTypes(prev => ({ ...prev, [selectedCategory]: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${businessType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа бизнеса
                        </Button>
                    </div>

                </div>
                {isLoadingBusiness ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorBusiness ? (
                    <p className="px-[192px] py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    (<CardSection title="Бизнес" cards={Object.values(businessOffers?.business || {})} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-y-10 gap-x-8 transition duration-600" ClassName={"container mx-auto py-[30px]"} />
                    )}
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
                        <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "buy" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${franchiseType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка франшизы
                        </Button>

                        <Button onClick={() => setListingTypes(prev => ({ ...prev, Франшиза: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${franchiseType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа франшизы
                        </Button>
                    </div>
                </div>
                {isLoadingFranchise ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorFranchise ? (
                    <p className="px-[192px] py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    (<CardSection title="Франшиза" cards={franchiseOffers?.franchise || []} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
                    )}

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
                        <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "buy" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${startupType === "buy" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Покупка стартапа
                        </Button>

                        <Button onClick={() => setListingTypes(prev => ({ ...prev, Стартапы: "sell" }))} className={`flex items-center justify-center gap-x-2 rounded-[8px] h-[52px] w-[364px] border border-[#2EAA7B] text-[#2EAA7B] text-[16px] hover:bg-[#2EAA7B] hover:text-white transition duration-500 font-inter leading-[150%] font-semibold
                        ${startupType === "sell" ? "bg-[#2EAA7B] text-white border-[#2EAA7B]"
                                : "border-[#2EAA7B] text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white"
                            }`}>
                            <ShopIcon className="w-5 h-5 hover:text-white" />
                            Продажа стартапа
                        </Button>
                    </div>
                </div>
                {isLoadingStartup ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorStartup ? (
                    <p className="px-[192px] py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    (<CardSection title="Стартапы" cards={startupOffers?.startup || []} maxVisible={8} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
                    )}

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
                {isLoadingInvestment ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isErrorInvestment ? (
                    <p className="px-[192px] py-[30px] text-red-500">Ошибка загрузки данных</p>
                ) :
                    (<CardSection title="Инвестиции" cards={investmentOffers?.investments || []} maxVisible={4} Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 transition duration-600" ClassName={"px-[192px] py-[30px]"} />
                    )}

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
                            onClick={(label) => {
                                if (
                                    label === "Бизнес" ||
                                    label === "Франшиза" ||
                                    label === "Стартапы" ||
                                    label === "Инвестиции"
                                ) {
                                    setSelectedCategory(label);
                                }
                            }}
                            className="flex gap-4 text-[24px] text-start font-openSans mb-[25px] font-bold"
                            activeClassName="w-[234px] px-6 py-4 bg-[#2EAA7B] text-white rounded-xl"
                            inactiveClassName="w-[234px] bg-white font-openSans text-[#232323] border border-[#2EAA7B] rounded-xl hover:bg-[#31B683]/10"
                        />

                        {/* ГОРОДА */}
                        <div className="flex flex-wrap gap-[20px]">
                            {cityStats &&
                                Object.entries(cityStats).map(([city, count], idx) => (
                                    <div key={idx} className="w-58.5 h-32.5 flex flex-col bg-[#1A1A1A] text-white py-4 px-6 rounded-[12px] gap-0.5">
                                        <span className="font-openSans font-bold text-2xl leading-[150%]">{city}</span>
                                        <span className="font-Urbanist font-bold text-[40px] leading-[150%]">{count.toLocaleString("ru-RU")}</span>
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
                                    {mainStats?.offers_count?.toLocaleString("ru-RU")}<span className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">объявлений</Paragraph>
                            </div>

                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    {mainStats?.deals_count?.toLocaleString("ru-RU")}<span className="text-[#2EAA7B]">+</span>
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">сделок</Paragraph>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    {mainStats?.partners_count?.toLocaleString("ru-RU")}
                                </Paragraph>
                                <Paragraph className="font-normal text-base mt-2">партнёров</Paragraph>
                            </div>

                            <div className="bg-white font-inter text-black w-[260px] flex flex-col items-center rounded-[30px] py-6 shadow-[0px_4px_21.2px_rgba(46,170,123,0.2)]">
                                <Paragraph className="text-[40px] text-center font-bold leading-none">
                                    {mainStats?.total_sold_amount
                                        ? `${(+mainStats.total_sold_amount / 1000000).toFixed(0)} млн `
                                        : "—"}<span className="text-[#2EAA7B]">$</span>
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
