import { useRef, useState } from "react";
import {
    Breadcrumbs,
    Button,
    Footer,
    Header,
    Heading,
    Input,
    ModalBase,
    Paragraph,
} from "../../components";
import { profileNavigate } from "../../utils/categoryMap";
import {
    useGetFiltersDataQuery,
    useGetUserCardsQuery,
    usePromoteOfferMutation,
    useAddUserCardMutation,
    useVerifyUserCardMutation,
    useGetUserInfoQuery,
} from "../../Store/api/Api";
import UzcardIcon from "../../assets/uzcard.svg?react";
import HumoIcon from "../../assets/humo.svg?react";
import { useNavigate, useParams } from "react-router-dom";

export const PromotionPage = () => {
    const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
    const { data: filtersData, isLoading: isTariffsLoading } = useGetFiltersDataQuery();
    const { data: cardsData, } = useGetUserCardsQuery();
    const { data: userInfo } = useGetUserInfoQuery();
    const navigate = useNavigate();

    const cards = cardsData?.cards || [];
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const expireDate = `${expiryMonth}${expiryYear}`;

    const [smsCode, setSmsCode] = useState("");
    const [isVerificationStep] = useState(false);
    const [newCardId, setNewCardId] = useState<number | null>(null);

    const [addCard] = useAddUserCardMutation();
    const [verifyCard] = useVerifyUserCardMutation();
    const [promoteOffer] = usePromoteOfferMutation();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [timer, setTimer] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);

    const [, setShowResultModal] = useState(false);
    const [maskedPhone, setMaskedPhone] = useState<string>("");
    const [codeInput, setCodeInput] = useState<string[]>(["", "", "", ""]);
    const code = codeInput.join("");
    const inputsRef = useRef<Array<HTMLInputElement | HTMLTextAreaElement | null>>([]);
    const [paymentSuccess, setPaymentSuccess] = useState<null | boolean>(null);
    const { id } = useParams();
    const offerId = Number(id);
    const handleAddCardAndPay = async () => {
        if (!cardNumber || !expiryMonth || !expiryYear) return;

        try {
            const response = await addCard({
                card_number: cardNumber.replace(/\s/g, ""),
                expire: expireDate,
                is_default: true,
            }).unwrap();

            if (userInfo?.phone) {
                setMaskedPhone(userInfo.phone.replace(/^(\+998\d{2})\d{5}(\d{2})$/, "$1*****$2"));
            }
            setStep(2);
            setNewCardId(response.card.id);
        } catch (e) {
            console.error(e);
            setPaymentSuccess(false);
        }
    };
    const handleVerifyAndPay = async () => {
        try {
            await verifyCard({
                card_id: newCardId!,
                code: smsCode,
            }).unwrap();

            await promoteOffer({
                offer_id: offerId,
                card_id: selectedCardId!,
                tariff_id: selectedTariff!,
            }).unwrap();

            setPaymentSuccess(true);
        } catch {
            setPaymentSuccess(false);
        }
    };
    if (!offerId || isNaN(offerId)) {
        return <Paragraph className="text-red-500 px-30 py-7.5">Ошибка: некорректный ID объявления</Paragraph>;
    }
    const handleExistingCardPayment = async () => {
        try {
            await promoteOffer({
                offer_id: offerId,
                card_id: selectedCardId!,
                tariff_id: selectedTariff!,
            }).unwrap();
            setPaymentSuccess(true);
        } catch {
            setPaymentSuccess(false);
        }
    };
    const handleCodeChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...codeInput];
        newCode[index] = value;
        setCodeInput(newCode);

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        if (e.key === "Backspace" && !codeInput[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };
    const handleCardSelect = (card: {
        id: number;
        masked_number: string;
        expire: string;
    }) => {
        setSelectedCardId(card.id);

        setCardNumber(card.masked_number);
        const mm = card.expire.slice(0, 2);
        const yy = card.expire.slice(2, 4);
        setExpiryMonth(mm || "");
        setExpiryYear(yy || "");
    };

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />
            <div className="container mx-auto py-7.5 px-4 sm:px-6 lg:px-8">
                <Breadcrumbs
                    links={[
                        { label: "Мои объявления", href: "/announcements" },
                        { label: "Продвигать объявление" },
                    ]}
                />
                {paymentSuccess === true ? (
                    <div className="flex max-xl:flex-wrap gap-10 mt-10 justify-between bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right duration-300 ease-in-out">
                        <div className="flex max-w-150 flex-col  items-start text-start">
                            <Heading className="font-inter text-4xl max-lg:text-2xl transition duration-300 ease-in-out" text={""} level={2}>Поздравляем,<span className="font-bold">оплата прошла успешно!</span>Вы можете снова перейти к вашим объявлениям</Heading>
                            <Button
                                className="mt-16 w-full max-w-83 px-5 py-3 bg-[#2EAA7B] shadow-[0px_1px_2px] shadow-[#1018280A] rounded-lg text-white font-inter font-semibold text-2xl max-md:text-xl duration-300 ease-in-out"
                                onClick={() => navigate("/announcements", { state: { promotionSuccess: true } })}
                            >
                                Вернуться к объявлениям
                            </Button>
                        </div>
                        <div className="max-w-90 max-md:hidden">
                            <img src="/images/done.png" />
                        </div>
                    </div>
                ) : paymentSuccess === false ? (
                    <div className="flex max-xl:flex-wrap gap-10 mt-10 justify-between bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right ">
                        <div className="flex max-w-150 flex-col  items-start text-start">
                            <Heading className="font-inter text-4xl max-lg:text-2xl duration-300 ease-in-out" text={""} level={2}><span className="font-bold">Что-то пошло не так.</span>Попробуйте оплатить ещё раз.</Heading>
                            <Button className="mt-16 w-full max-w-83 px-5 py-3 bg-[#2EAA7B] shadow-[0px_1px_2px] shadow-[#1018280A] rounded-lg text-white font-inter font-semibold text-2xl max-md:text-xl duration-300 ease-in-out" onClick={() => navigate("/announcements")}
                            >Вернуться</Button>
                        </div>
                        <div className="max-w-90 max-md:hidden duration-300 ease-in-out">
                            <img src="/images/wrong.png" />
                        </div>
                    </div>
                ) : isVerificationStep ? (
                    <div className="mt-10">
                        <Heading level={3} text="Введите код из SMS для подтверждения карты" className="mb-4" />
                        <Input
                            placeholder="Код из SMS"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            isError={false}
                            className="w-60"
                        />
                        <Button className="mt-4" onClick={handleVerifyAndPay}>Подтвердить и оплатить</Button>
                    </div>
                ) : (
                    <div className="flex max-xl:flex-col">
                        <div className="w-full mt-8 px-4 max-sm:px-0">
                            {/* Тарифы */}
                            <div className="flex gap-8.25 items-center mb-5">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 flex items-center justify-center text-base border-[#2EAA7B] rounded-full">
                                    1
                                </Paragraph>
                                <Heading className="text-xl font-inter w-full" text="Выберите количество дней для продвижения вашего объявления" level={3} />
                            </div>
                            <div className="flex flex-wrap gap-6.75 mt-5.5 w-full max-md:flex-col">
                                {isTariffsLoading ? <Paragraph>Загрузка тарифов...</Paragraph> : filtersData?.tariffs?.map((tariff) => (
                                    <Button key={tariff.id} className={`flex flex-col border items-start border-[#2EAA7B] px-6 py-4 rounded-lg ${selectedTariff === tariff.id ? "bg-[#2EAA7B] text-white" : "bg-white"}`} onClick={() => setSelectedTariff(tariff.id)}>
                                        <Paragraph className="font-inter font-semibold text-xl">{tariff.duration} дней</Paragraph>
                                        <Paragraph>{tariff.price.toLocaleString()} сум</Paragraph>
                                    </Button>
                                ))}
                            </div>

                            {/* Карты пользователя */}
                            {cards.length > 0 && (
                                <div className="mt-10 px-4 sm:px-0 ">
                                    <div className="flex flex-wrap max-md:flex-col gap-4">
                                        <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">2</Paragraph>
                                        <Heading level={3} text="Выберите карту для оплаты" className="mb-4" />
                                    </div>
                                    <div className="flex flex-wrap max-md:flex-col gap-6.75">
                                        {cards.map((card) => (
                                            <Button key={card.id} onClick={() => handleCardSelect(card)} className={`flex flex-col border items-start border-[#2EAA7B] px-6 py-4 rounded-lg ${selectedCardId === card.id ? "bg-[#2EAA7B] text-white" : "bg-white"}`}>
                                                <Paragraph className="font-inter font-semibold text-xl">{card.masked_number}</Paragraph>
                                                <Paragraph>Срок: {card.expire.slice(0, 2)}/{card.expire.slice(2, 4)}</Paragraph>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Новая карта */}
                            <div className="mt-10 px-4 sm:px-0">
                                <Heading level={3} text="Или введите данные новой карты" className="mb-4" />
                                <div className="bg-[#F8F8F8] w-full rounded-[20px] md:rounded-[40px] py-8 px-6 md:px-12.5 shadow-md">
                                    <Input placeholder="0000 0000 0000 0000" LabelText="Номер карты" LabelClassName="font-inter text-[25px] max-sm:text-[18px] mb-[19px]" value={cardNumber} onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, "").slice(0, 16);
                                        const formatted = rawValue.replace(/(.{4})/g, "$1 ").trim();
                                        setCardNumber(formatted);
                                    }} isError={false} className="w-full mb-12 flex flex-col outline-none py-3.5 px-4.5 bg-[#F0F1F280] border border-[#DEE0E333] rounded-2xl text-3xl max-sm:text-[16px] text-[#686A70]" />
                                    <div className="flex justify-between flex-col md:flex-row gap-6 md:gap-0">
                                        <div className="flex flex-col w-full gap-4">
                                            <Paragraph className="font-inter text-2xl max-sm:text-[18px] mb-4.5">Срок действия</Paragraph>
                                            <div className="flex gap-2 w-full">
                                                <Input placeholder="MM" value={expiryMonth} onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                                                    setExpiryMonth(value);
                                                }}
                                                    isError={false} className="bg-[#F0F1F280] rounded-xl outline-none py-3.5 px-4.5 max-w-33 max-sm:w-full text-center text-xl max-sm:text-[16px] text-[#686A70]" />
                                                <Input placeholder="YY" value={expiryYear} onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                                                    setExpiryYear(value);
                                                }} isError={false} className="bg-[#F0F1F280] rounded-xl outline-none py-3.5 px-4.5 max-w-33 max-sm:w-full text-center text-xl max-sm:text-[16px] text-[#686A70]" />
                                            </div>
                                        </div>
                                        <div className="flex gap-6 mt-4 items-end">

                                            <UzcardIcon className="w-24 max-sm:w-18" />
                                            <HumoIcon className="w-24 max-sm:w-18" />

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="flex gap-8.25 items-center text-center mb-5 mt-9.25">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">3</Paragraph>
                                <Heading className=" w-full text-xl font-inter" level={3} text="После ввода данных, нажмите Оплатить и подтвердите через SMS" />
                            </div>
                        </div>

                        {/* Итог и оплата */}
                        <div className="mt-10 mb-20 w-full flex justify-center px-4 sm:px-0">
                            <div className="w-full max-w-[400px] text-center">
                                <Paragraph className="mb-2 font-inter text-xl md:text-3xl">К оплате:</Paragraph>
                                <Paragraph className="mb-8 text-xl md:text-3xl font-bold">
                                    {filtersData?.tariffs?.find((t) => t.id === selectedTariff)?.price.toLocaleString() || 0} сум
                                </Paragraph>
                                <Button
                                    onClick={async () => {
                                        if (selectedCardId) {
                                            await handleExistingCardPayment();
                                        } else {
                                            await handleAddCardAndPay();
                                        }

                                    }}
                                    disabled={
                                        !selectedTariff ||
                                        (
                                            !selectedCardId &&
                                            (!cardNumber || !expiryMonth || !expiryYear)
                                        )
                                    } className="w-full text-[18px] md:text-[25px] px-5 py-3 rounded-lg bg-[#2EAA7B] text-white"
                                >
                                    Оплатить
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <ModalBase
                        title=""
                        message={`Введите код, отправленный на номер ${maskedPhone}`}
                        ModalClassName="w-full max-w-[450px] mx-auto px-4 sm:px-10 py-8 text-center"
                        onClose={() => setStep(1)}
                        actions={<div className="">
                            <div className="flex justify-between gap-2 mb-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Input
                                        key={index}
                                        maxLength={1}
                                        ref={(el) => {
                                            inputsRef.current[index] = el;
                                        }}
                                        value={codeInput[index]}
                                        onChange={(e) => handleCodeChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="rounded-2xl border border-[#2EAA7B] w-20 h-20 text-center font-inter font-semibold text-3xl"
                                        type="text"
                                        isError={false}
                                    />
                                ))}
                            </div>
                            <div className="text-center text-[14px] text-[#28B13D] font-semibold">
                                {canResend ? (
                                    <button onClick={() => { setTimer(60); setCanResend(false); }} className="hover:underline">
                                        Отправить снова
                                    </button>
                                ) : (
                                    <span>Отправить снова через <span className="font-bold">0:{timer.toString().padStart(2, "0")}</span></span>
                                )}
                            </div>
                            <Button
                                disabled={code.length !== 4}
                                onClick={async () => {
                                    try {
                                        await verifyCard({ card_id: newCardId!, code }).unwrap();
                                        await promoteOffer({ offer_id: 10, card_id: newCardId!, tariff_id: selectedTariff! }).unwrap();
                                        setPaymentSuccess(true);
                                        setStep(3);
                                        setShowResultModal(true);
                                    } catch {
                                        setPaymentSuccess(false);
                                        setStep(3);
                                        setShowResultModal(true);
                                    }
                                }}
                                className="w-full bg-[#2EAA7B] text-white py-6 rounded-lg "
                            >
                                Подтвердить
                            </Button>
                        </div>} HeadingClassName={""} />
                )}

            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
