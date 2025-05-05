import { useEffect, useState } from "react";
import { Button, Paragraph, Footer, Header, Breadcrumbs } from "../../../components/index";
import { profileNavigate } from "../../../utils/categoryMap";
import ShopIcon from '../../../assets/shop.svg?react';
import InfoIcon from '../../../assets/info.svg?react';
import CategoryIcon from '../../../assets/category.svg?react';
import { InformationStep } from "./InformationStep";
import { PublicationStep } from "./PublicationStep";
import { ModerationStep } from "./ModerationStep";
import { OfferPayload } from "../../../Store/api/types";
import { getTemporaryOffer } from "../../../Store/tempStorage";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const steps = [
    { title: "Тип объявления", subtitle: "Выберите что вы хотите сделать" },
    { title: "Раздел объявления", subtitle: "Выберите категорию объявления" },
    { title: "Информация", subtitle: "Заполните детали объявления" },
    { title: "Публикация", subtitle: "Проверьте и подтвердите" },
    { title: "Готово", subtitle: "На модерации" }
];

const offerTypes = ["business", "franchise", "startup", "investments"] as const;
type OfferType = typeof offerTypes[number];
const offerTypeMap: Record<OfferType, string> = {
    business: "Бизнес",
    franchise: "Франшиза",
    startup: "Стартап",
    investments: "Инвестиции"
};
const listingTypeLabels: Record<"buy" | "sell", string> = {
    buy: "Купить",
    sell: "Продать",
};
const listingTypes: Array<"buy" | "sell"> = ["sell", "buy"];

const stepIcons = [
    <ShopIcon className="w-4 h-4" />,
    <CategoryIcon className="w-4 h-4" />,
    <InfoIcon className="w-4 h-4" />,
];
export const StepsAddingOffer = () => {
    const [step, setStep] = useState(0);
    const [listingType, setListingType] = useState<"buy" | "sell" | null>(null);
    const [offerType, setOfferType] = useState<OfferType | null>(null);
    const [savedData, setSavedData] = useState<OfferPayload | null>(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
        }
    };
    const isNextDisabled = () => {
        if (step === 0) return !listingType;
        if (step === 1) return !offerType;
        return false;
    };

    const handlePublish = () => {
        console.log("POST запрос отправлен", savedData);
        navigate("/announcements");
        setStep(4);
    };
    useEffect(() => {
        const data = getTemporaryOffer();
        setSavedData(data);
    }, [step]);
    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />

            <div className="px-[192px] py-12 ">
                <Breadcrumbs title="Добавить объявление" />
                <div className="flex mt-7 gap-12">
                    <div className="relative w-[250px] flex flex-col gap-2">
                        {steps.map((s, i) => {
                            const isActive = i === step;
                            const isCompleted = i < step;

                            return (
                                <div key={i} className="relative flex flex-col items-start gap-2">
                                    <Button
                                        onClick={() => i <= step && setStep(i)}
                                        className="flex items-center gap-3 text-left z-10"
                                        disabled={i > step}
                                    >
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition
              ${isActive || isCompleted ? "border-[#2EAA7B]" : "border-gray-300"}
            `}
                                        >
                                            <span className={isActive || isCompleted ? "text-[#2EAA7B]" : "text-gray-300"}>
                                                {stepIcons[i]}
                                            </span>
                                        </div>

                                        <div
                                            className={`text-base font-semibold ${isActive || isCompleted ? "text-[#2EAA7B]" : "text-[#667085]"}`}
                                        >
                                            {s.title}
                                        </div>
                                    </Button>

                                    {i < steps.length - 1 && (
                                        <div
                                            className={`ml-[15px] w-[2px] h-12.5 ${step > i ? "bg-[#2EAA7B]" : "bg-gray-300"}`} />
                                    )}
                                </div>
                            );
                        })}

                        {/* Умный помощник */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-[#1CA67A] to-[#24568E] rounded-[10px] flex items-start gap-2 text-white">
                            <img src="/images/assistant-icon.png" alt="assistant" className="w-6 h-6 mt-[2px]" />
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-sm">Умный помощник</span>
                                <span className="text-xs leading-tight mt-1">
                                    Здесь вы найдете инструкцию по размещению объявлений
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="flex-1">
                        {/* Step 0 — тип */}
                        {step === 0 && (
                            <div className="flex gap-6">
                                {listingTypes.map((type) => (
                                    <div
                                        key={type}
                                        className={`border rounded-lg px-6 py-4 cursor-pointer w-[180px] text-center ${listingType === type ? "border-[#2EAA7B] bg-[#F5FFFA]" : "border-gray-300"}`}
                                        onClick={() => setListingType(type as "buy" | "sell")}
                                    >
                                        <Paragraph className="font-semibold">{listingTypeLabels[type]}</Paragraph>
                                    </div>
                                ))}

                            </div>
                        )}

                        {/* Step 1 - категория */}
                        {step === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {offerTypes.map((type) => (
                                    <div
                                        key={type}
                                        className={`border rounded-lg px-6 py-4 cursor-pointer text-center ${offerType === type ? "border-[#2EAA7B] bg-[#F5FFFA]" : "border-gray-300"}`}
                                        onClick={() => setOfferType(type)}
                                    >
                                        <Paragraph className="font-semibold">{offerTypeMap[type]}</Paragraph>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Step-2 - информация */}
                        {step === 2 && offerType && listingType && (
                            <InformationStep offerType={offerType} onNext={handleNext} listingType={listingType} />
                        )}


                        {/* Step-3 - Публикация */}
                        {step === 3 && savedData && (
                            <PublicationStep onPublish={handlePublish} />
                        )}
                        {step < 2 && (
                            <div className="mt-10">
                                <Button
                                    onClick={handleNext}
                                    disabled={isNextDisabled()}
                                    className={`flex items-center gap-2 ${isNextDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#2EAA7B] text-white"
                                        } px-6 py-2 rounded-md`}
                                >
                                    Дальше <FiChevronRight />
                                </Button>
                            </div>
                        )}
                        {/* Step-4 - Готово */}
                        {step === 4 && (
                            <ModerationStep />
                        )}
                    </div>
                </div>

            </div>
            <Footer showSmallFooter={true} />
        </div >
    );
};
