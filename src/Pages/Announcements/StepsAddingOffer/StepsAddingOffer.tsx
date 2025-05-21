import { useState } from "react";
import { Button, Paragraph, Footer, Header, Breadcrumbs, Heading } from "../../../components/index";
import { profileNavigate } from "../../../utils/categoryMap";
import ShopIcon from '../../../assets/shop.svg?react';
import InfoIcon from '../../../assets/info.svg?react';
import CategoryIcon from '../../../assets/category.svg?react';
import ShopSellIcon from '../../../assets/shop-sell.svg?react';
import { InformationStep } from "./InformationStep";
import { PublicationStep } from "./PublicationStep";
import { ModerationStep } from "./ModerationStep";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { FiChevronRight } from "react-icons/fi";
import { CardDetailPreview } from "../../../components/Cards/CardDetailPreview";
import { FaCheckCircle } from "react-icons/fa";


const steps = [
    { title: "Раздел объявления", subtitle: "Выберите категорию объявления" },
    { title: "Тип объявления", subtitle: "Выберите что вы хотите сделать" },
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

const listingTypes: Array<"buy" | "sell"> = ["sell", "buy"];


const stepIcons = [
    <ShopIcon className="w-4 h-4" />,
    <CategoryIcon className="w-4 h-4" />,
    <InfoIcon className="w-4 h-4" />,
    <FaCheckCircle className="w-4 h-4" />
];
const ListingTypesIcons = [
    <ShopIcon className="w-6 h-6" />,
    <ShopSellIcon className="w-6 h-6" />
]
export const StepsAddingOffer = () => {
    const [step, setStep] = useState(0);
    const [listingType, setListingType] = useState<"buy" | "sell" | null>(null);
    const [offerType, setOfferType] = useState<OfferType | null>(null);
    const savedData = useSelector((state: RootState) => state.tempOffer.offerData);

    const getListingTypeLabel = (type: "buy" | "sell") => {
        if (offerType === "investments") {
            return type === "buy" ? "Найти инвестиции" : "Инвестировать";
        }
        return type === "buy" ? "Купить" : "Продать";
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
        }
    };
    const isNextDisabled = () => {
        if (step === 0) return !offerType;
        if (step === 1) return !listingType;
        return false;
    };

    const handlePublish = () => {
        setStep(4);
    };


    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />

            <div className="px-[192px] py-12 ">
                {step !== 5 ? (
                    <><Breadcrumbs title="Добавить объявление" /><div className="flex mt-7 gap-12">
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


                        <div className="flex-1 p-10 bg-[#F8F8F8]">
                            {/* Step 0 - категория */}
                            {step === 0 && (
                                <div>
                                    <Heading text={"Категория объявления"} level={2} className="font-inter font-semibold text-3xl text-[#101828] mb-1.5" />
                                    <Paragraph className="font-inter text-[16px] text-[#667085] mb-6">Выберите категорию объявления</Paragraph>

                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 text-center">

                                        {offerTypes.map((type) => (
                                            <div
                                                key={type}
                                                className={`border rounded-lg w-48.75 h-43 cursor-pointer text-center 
          flex items-center justify-center
          ${offerType === type ? "border-[#2EAA7B] bg-[#F5FFFA]" : "border-gray-300"}`}
                                                onClick={() => setOfferType(type)}
                                            >
                                                <Paragraph className="font-semibold">{offerTypeMap[type]}</Paragraph>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 1 — тип */}
                            {step === 1 && (
                                <div>
                                    <Heading text={"Категория объявления"} level={2} className="font-inter font-semibold text-3xl text-[#101828] mb-1.5" />
                                    <Paragraph className="font-inter text-[16px] text-[#667085] mb-6">Выберите категорию объявления</Paragraph>
                                    <div className="flex gap-6 text-center ">

                                        {listingTypes.map((type, index) => (
                                            <div
                                                key={type}
                                                className={`  border rounded-lg w-48.75 h-43 cursor-pointer text-center 
          flex flex-col items-center justify-center ${listingType === type ? "border-[#2EAA7B] bg-[#F5FFFA]" : "border-gray-300"}`}
                                                onClick={() => setListingType(type as "buy" | "sell")}
                                            >
                                                <span className="text-[#2EAA7B]">{ListingTypesIcons[index]}</span>
                                                <Paragraph className="font-semibold">{getListingTypeLabel(type)}</Paragraph>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            )}
                            {/* Step-2 - информация */}
                            {step === 2 && offerType && listingType && (
                                <InformationStep offerType={offerType} onNext={handleNext} listingType={listingType} />
                            )}


                            {/* Step-3 - Публикация */}
                            {step === 3 && savedData && (
                                <PublicationStep onPublish={handlePublish} onPreview={() => setStep(5)} />
                            )}

                            {step < 2 && (
                                <div className="mt-10">
                                    <Button
                                        onClick={handleNext}
                                        disabled={isNextDisabled()}
                                        className={`flex items-center gap-2 ${isNextDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#2EAA7B] text-white"} px-6 py-2 rounded-md`}
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
                    </div></>
                ) : (
                    <div>
                        {step === 5 && <CardDetailPreview onBack={() => setStep(3)} />}

                    </div>
                )}

            </div>
            <Footer showSmallFooter={true} />
        </div >
    );
};
