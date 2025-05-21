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

export const PromotionPage = () => {
    const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
    const { data: filtersData, isLoading: isTariffsLoading } = useGetFiltersDataQuery();
    const { data: cardsData, isLoading: isCardsLoading } = useGetUserCardsQuery();
    const { data: userInfo } = useGetUserInfoQuery();

    const cards = cardsData?.cards || [];

    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const expireDate = `${expiryMonth}${expiryYear}`;
    const [cardType, setCardType] = useState<"UzCard" | "Humo" | null>(null);

    const [smsCode, setSmsCode] = useState("");
    const [isVerificationStep] = useState(false);
    const [newCardId, setNewCardId] = useState<number | null>(null);

    const [addCard] = useAddUserCardMutation();
    const [verifyCard] = useVerifyUserCardMutation();
    const [promoteOffer] = usePromoteOfferMutation();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showResultModal, setShowResultModal] = useState(false);
    const [maskedPhone, setMaskedPhone] = useState<string>("");
    const [codeInput, setCodeInput] = useState<string[]>(["", "", "", ""]);
    const code = codeInput.join("");
    const inputsRef = useRef<Array<HTMLInputElement | HTMLTextAreaElement | null>>([]);
    const [paymentSuccess, setPaymentSuccess] = useState<null | boolean>(null);

    const handleAddCardAndPay = async () => {
        if (!cardNumber || !expiryMonth || !expiryYear || !cardType) return;

        try {
            const response = await addCard({
                card_number: cardNumber.replace(/\s/g, ""),
                expire: expireDate,
                card_type: cardType,
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
                offer_id: 10,
                card_id: newCardId!,
                tariff_id: selectedTariff!,
            }).unwrap();

            setPaymentSuccess(true);
        } catch {
            setPaymentSuccess(false);
        }
    };

    const handleExistingCardPayment = async () => {
        try {
            await promoteOffer({
                offer_id: 10,
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
                        <Button className="mt-4" onClick={() => (window.location.href = "/announcements")}>Вернуться</Button>
                    </div>
                ) : paymentSuccess === false ? (
                    <div className="text-center mt-10">
                        <h2 className="text-2xl font-bold text-red-600">Что-то пошло не так</h2>
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
                    <div className="flex gap-56.75 mt-8">
                        <div>
                            {/* Тарифы */}
                            <div className="flex gap-8.25">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">1</Paragraph>
                                <Heading className="text-xl font-inter mb-4 w-100" text="Выберите количество дней для продвижения вашего объявления" level={3} />
                            </div>
                            <div className="flex gap-6.75 mt-5.5">
                                {isTariffsLoading ? <Paragraph>Загрузка тарифов...</Paragraph> : filtersData?.tariffs?.map((tariff) => (
                                    <Button key={tariff.id} className={`flex flex-col border items-start border-[#2EAA7B] px-6 py-4 rounded-lg ${selectedTariff === tariff.id ? "bg-[#2EAA7B] text-white" : "bg-white"}`} onClick={() => setSelectedTariff(tariff.id)}>
                                        <Paragraph className="font-inter font-semibold text-xl">{tariff.duration} дней</Paragraph>
                                        <Paragraph>{tariff.price.toLocaleString()} сум</Paragraph>
                                    </Button>
                                ))}
                            </div>

                            {/* Карты пользователя */}
                            {cards.length > 0 && (
                                <div className="mt-10">
                                    <Heading level={3} text="Выберите карту для оплаты" className="mb-4" />
                                    <div className="flex gap-6.75">
                                        {cards.map((card) => (
                                            <Button key={card.id} onClick={() => setSelectedCardId(card.id)} className={`flex flex-col border items-start border-[#2EAA7B] px-6 py-4 rounded-lg ${selectedCardId === card.id ? "bg-[#2EAA7B] text-white" : "bg-white"}`}>
                                                <Paragraph className="font-inter font-semibold text-xl">{card.masked_number}</Paragraph>
                                                <Paragraph>Срок: {card.expire}</Paragraph>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Новая карта */}
                            <div className="mt-10">
                                <Heading level={3} text="Введите данные новой карты" className="mb-4" />
                                <Input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} isError={false} className="w-80 mb-4" />
                                <div className="flex gap-4 mb-4">
                                    <Input placeholder="MM" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} isError={false} className="w-36" />
                                    <Input placeholder="YY" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} isError={false} className="w-36" />
                                </div>
                                <div className="flex gap-5.5 mt-4">
                                    <button
                                        onClick={() => setCardType("UzCard")}
                                        className={`transition-opacity duration-200 ${cardType === "Humo" ? "opacity-30" : "opacity-100"}`}
                                        type="button"
                                    >
                                        <UzcardIcon className="w-12 h-12" />
                                    </button>
                                    <button
                                        onClick={() => setCardType("Humo")}
                                        className={`transition-opacity duration-200 ${cardType === "UzCard" ? "opacity-30" : "opacity-100"}`}
                                        type="button"
                                    >
                                        <HumoIcon className="w-12 h-12" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-8.25 mt-9.25 w-170.5">
                                <Paragraph className="border py-3 px-5 w-12.5 h-12.5 items-center border-[#2EAA7B] rounded-full">3</Paragraph>
                                <Heading className="text-xl font-inter mb-4" level={3} text="После ввода данных, нажмите Оплатить и подтвердите через SMS" />
                            </div>
                        </div>

                        {/* Итог и оплата */}
                        <div className="mt-8 flex justify-end">
                            <div className="text-right">
                                <div className="flex flex-col items-center">
                                    <Paragraph className="mb-2 font-inter text-3xl">К оплате:</Paragraph>
                                    <Paragraph className="mb-15 text-3xl font-inter font-bold">
                                        {filtersData?.tariffs?.find((t) => t.id === selectedTariff)?.price.toLocaleString() || 0} сум
                                    </Paragraph>
                                </div>
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
                                            (!cardNumber || !expiryMonth || !expiryYear || !cardType)
                                        )
                                    } className="border border-[#2EAA7B] w-81.5 text-black font-inter font-semibold text-[25px] px-5 py-3 rounded-md hover:bg-[#2EAA7B] hover:text-white"
                                >
                                    Оплатить
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <ModalBase
                        title="Подтвердите карту"
                        message={`Введите код, отправленный на номер ${maskedPhone}`}
                        onClose={() => setStep(1)}
                        actions={<div className="w-full">
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
                                        className="..."
                                        type="text"
                                        isError={false}
                                    />
                                ))}
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
                                className="w-full bg-[#2EAA7B] text-white py-3 rounded-lg"
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
