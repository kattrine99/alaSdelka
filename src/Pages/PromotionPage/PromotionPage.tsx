import { useState } from "react";
import { Breadcrumbs, Button, Footer, Header, Heading, Input, Paragraph } from "../../components";
import { profileNavigate } from "../../utils/categoryMap";
import { useGetFiltersDataQuery, usePromoteOfferMutation } from "../../Store/api/Api";
import UzcardIcon from "../../assets/uzcard.svg?react"
import HumoIcon from "../../assets/humo.svg?react"


export const PromotionPage = () => {
    const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
    const { data: filtersData, isLoading: isTariffsLoading } = useGetFiltersDataQuery();
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [promoteOffer] = usePromoteOfferMutation();
    const [paymentSuccess, setPaymentSuccess] = useState<null | boolean>(null);

    const handlePayment = async () => {
        try {
            const response = await promoteOffer({
                tariff_id: selectedTariff!,
                offer_id: 10,
                card_id: 5,
            }).unwrap();
            console.log(response);
            setPaymentSuccess(true);
        } catch {
            setPaymentSuccess(false);
        }
    };

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />
            <div className="py-7.5 px-48">
                <Breadcrumbs
                    links={[
                        { label: "Мои объявления", href: "/announcements" },
                        { label: "Продвигать объявление" },
                    ]}
                />

                {paymentSuccess === true ? (
                    <div className="text-center mt-10">
                        <h2 className="text-2xl font-bold text-green-600">Оплата прошла успешно!</h2>
                        <Button className="mt-4" onClick={() => (window.location.href = "/announcements")}>
                            Вернуться
                        </Button>
                    </div>
                ) : paymentSuccess === false ? (
                    <div className="text-center mt-10">
                        <h2 className="text-2xl font-bold text-red-600">Что-то пошло не так</h2>
                        <Button className="mt-4" onClick={handlePayment}>
                            Попробовать ещё раз
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-56.75 mt-8">
                        {/* Блок выбора тарифа */}
                        <div>
                            <div className="flex gap-8.25">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">1</Paragraph>
                                <Heading className="text-xl font-inter mb-4 w-100" text={"Выберите количество дней для продвижения вашего объявления"} level={3} />
                            </div>
                            <div className="flex gap-6.75 mt-5.5">
                                {isTariffsLoading ? (
                                    <Paragraph>Загрузка тарифов...</Paragraph>
                                ) : (
                                    filtersData?.tariffs?.map((tariff) => (
                                        <Button
                                            key={tariff.id}
                                            className={`flex flex-col border items-start border-[#2EAA7B] px-6 py-4 rounded-lg ${selectedTariff === tariff.id ? "bg-[#2EAA7B] text-white" : "bg-white"}`}
                                            onClick={() => setSelectedTariff(tariff.id)}
                                        >
                                            <Paragraph className="font-inter font-semibold text-xl">{tariff.duration} дней</Paragraph>
                                            <Paragraph>{tariff.price.toLocaleString()} сум</Paragraph>
                                        </Button>
                                    ))
                                )}
                            </div>
                            {/* Блок ввода карты */}
                            <div>
                                <div className="flex gap-8.25 mt-9.25">
                                    <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">2</Paragraph>
                                    <Heading className="text-xl font-inter mb-4" text={"Заполните данные карты"} level={3}></Heading>
                                </div>
                                <div className="mt-7 py-12 px-12.5 bg-[#F8F8F8] shadow-md rounded-[41px] ">
                                    <Input
                                        type="text"
                                        LabelText="Номер карты"
                                        LabelClassName="font-inter text-[25px] mb-5"
                                        placeholder="Введите"
                                        className="bg-[#F0F1F280] w-102.5 border border-[#DEE0E333] outline-none py-3.5 px-4.5 rounded-[14px]"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)} isError={false} />
                                    <div className="gap-2 mt-2">
                                        <Paragraph className="font-inter text-[25px] mb-5">Срок действия</Paragraph>

                                        <div className="flex gap-39.5">
                                            <div className="flex gap-2.25">
                                                <Input
                                                    placeholder="Введите"
                                                    className="bg-[#F0F1F280] border border-[#DEE0E333] outline-none py-3.5 px-4.5 rounded-[14px] w-33.25"
                                                    value={expiryMonth}
                                                    onChange={(e) => setExpiryMonth(e.target.value)} isError={false} />
                                                <Input
                                                    placeholder="Введите"
                                                    className="bg-[#F0F1F280] border border-[#DEE0E333] outline-none py-3.5 px-4.5 rounded-[14px] w-33.25"
                                                    value={expiryYear}
                                                    onChange={(e) => setExpiryYear(e.target.value)} isError={false} />

                                            </div>
                                            <div className="flex gap-5.5">
                                                <UzcardIcon />
                                                <HumoIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex gap-8.25 mt-9.25 w-170.5">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">3</Paragraph>
                                <Heading className="text-xl font-inter mb-4" text={""} level={3}>После ввода данных, нажмите <span className="font-bold">Оплатить</span>, после этого, введите код из смс, которое вы получите от своего банка</Heading>
                            </div>
                        </div>
                        {/* К оплате и кнопка */}
                        {paymentSuccess === null && (
                            <div className="mt-8 flex justify-end">
                                <div className="text-right">
                                    <div className="flex flex-col items-center">
                                        <Paragraph className="mb-2 font-inter text-3xl">К оплате:</Paragraph>
                                        <Paragraph className="mb-15  text-3xl font-inter font-bold">
                                            {filtersData?.tariffs?.find((t) => t.id === selectedTariff)?.price.toLocaleString() || 0} сум
                                        </Paragraph>
                                    </div>
                                    <Button
                                        onClick={handlePayment}
                                        className=" border border-[#2EAA7B] w-81.5 text-black font-inter font-semibold text-[25px] px-5 py-3 rounded-md hover:bg-[#2EAA7B] hover:text-white"
                                        disabled={!selectedTariff || !cardNumber}
                                    >
                                        Оплатить
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
