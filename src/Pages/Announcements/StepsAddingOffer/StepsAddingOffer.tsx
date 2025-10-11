import { useEffect, useState } from "react";
import { Button, Paragraph, Footer, Header, Breadcrumbs, Heading, ModalBase } from "../../../components/index";
import { profileNavigate } from "../../../utils/categoryMap";
import ShopIcon from '../../../assets/shop.svg?react';
import InfoIcon from '../../../assets/info.svg?react';
import CategoryIcon from '../../../assets/category.svg?react';
import ShopSellIcon from '../../../assets/shop-sell.svg?react';
import HeadphonesIcon from '../../../assets/headphones.svg?react';
import { InformationStep } from "./InformationStep";
import { PublicationStep } from "./PublicationStep";
import { ModerationStep } from "./ModerationStep";
import { PaymentStep } from "./PaymentStep"
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { CardDetailPreview } from "../../../components/Cards/CardDetailPreview";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "../../../../public/Locales/context/TranslationContext";
import { useSearchParams } from "react-router-dom";


const steps = [
    { title: "Раздел объявления", subtitle: "Выберите категорию объявления" },
    { title: "Тип объявления", subtitle: "Выберите что вы хотите сделать" },
    { title: "Информация", subtitle: "Заполните детали объявления" },
    { title: "Оплата", subtitle: "Выберите способ оплаты" },
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
    const [offerSlug, setOfferSlug] = useState<string | null>(null);
    const savedData = useSelector((state: RootState) => state.tempOffer.offerData);
    const [showHelperModal, setShowHelperModal] = useState(false);
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    const getListingTypeLabel = (type: "buy" | "sell") => {
        if (offerType === "investments") {
            return type === "buy" ? t("Поиск инвестора") : t("Поиск инвестпроекта");
        }
        return type === "buy" ? "Купить" : "Продать";
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
        }
    };
    const handleBack = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
        }
    }
    const isNextDisabled = () => {
        if (step === 0) return !offerType;
        if (step === 1) return !listingType;
        return false;
    };
    const isBackDisabled = () => {
        return step === 0;
    }

    const handlePublish = (offerSlug: string) => {
        setOfferSlug(offerSlug);
        setStep(6);
    };

    useEffect(() => {
        const offerSlug = searchParams.get("offerSlug");
        if (offerSlug) {
            setOfferSlug(offerSlug);
            setStep(6);
        }
    }, [searchParams]);

    return (
        <div className="w-screen min-h-screen flex flex-col">
            <Header navLinksData={profileNavigate} />
            {showHelperModal && (
                <ModalBase
                    title=""
                    ModalClassName="w-198 h-4/5"
                    onClose={() => setShowHelperModal(false)}
                    message={
                        <>
                            <Heading level={2} text={t("Инструкция по размещению объявления")} className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="mb-4 text-sm leading-[150%] text-[#667085]">
                                 {t("Добро пожаловать! Вот как легко и быстро разместить свое объявление:")}
                            </Paragraph>
                            <Heading level={3} text= {t("Шаг 1. Раздел объявления")} className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="text-sm leading-[150%] text-[#667085] mb-2">
                                 {t("Выберите, что вы хотите разместить:")}
                                <ul>
                                    <li><b> {t("Бизнес")}</b> {t("— продажа или покупка готового бизнеса")}</li>
                                    <li><b>{t("Франшиза")}</b> {t("— покупка или продажа франшизы")}</li>
                                    <li><b>{t("Стартап")}</b> {t("— поиск инвестиций для стартапа")}</li>
                                    <li><b>{t("Инвестиции")}</b> {t("— проекты для привлечения инвестиций")}</li>
                                </ul>
                                {t("Нажмите «Дальше»")}
                            </Paragraph>
                            <Heading level={3} text= {t("Шаг 2. Тип объявления")} className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="text-sm leading-[150%] text-[#667085] mb-2">
                                {t("Выберите действие:")}
                                <ul>
                                    <li><b>{t("Продать")}</b></li>
                                    <li><b>{t("Купить")}</b></li>
                                </ul>
                                {t("Нажмите «Дальше»")}
                            </Paragraph>
                            <Heading level={3} text={t("Шаг 3. Информация")} className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="text-sm leading-[150%] text-[#667085] mb-2">
                                {t("Заполните поля:")}
                                <ul>
                                    <li><b>{t("Название бизнеса")}</b>{t("— кратко и понятно")} </li>
                                    <li><b>{t("Описание")}</b> {t("— опишите, что продаете или ищете")}</li>
                                    <li><b>{t("Категория объявления")} </b>{t("— выберите из списка")} </li>
                                    <li><b>{t("Ваше имя и телефон")}</b> {t("— для связи")}</li>
                                    <li><b>{t("Город")}</b> {t("— где находится бизнес или проект")}</li>
                                    <li><b>{t("Адрес")}</b> {t("— местоположение бизнеса или объекта")}</li>
                                    <li><b>{t("Площадь, кв.м.")}</b> {t("— укажите площадь помещения (если применимо).")}</li>
                                    <li><b>{t("Форма владения бизнесом")}</b> {t("— выберите из списка: ИП, ООО и т.д.")}</li>
                                    <li><b>{t("Форма владения помещением")}</b> {t("— собственность, аренда и др.")}</li>
                                    <li><b>{t("Документы и лицензии")}</b> {t("(формат PDF или Excel) — если есть.")}</li>
                                    <li><b>{t("Стоимость (Сумма, UZS)")}</b> {t("— в национальной валюте.")}</li>
                                </ul>
                                {t("Заполните все обязательные поля и жмите «Дальше».")}
                            </Paragraph>
                            <Heading level={3} text= {t("Шаг 4. Черновик")}  className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="text-sm leading-[150%] text-[#667085] mb-2">
                                {t("Проверьте все данные. Можете сохранить как черновик или сразу перейти к публикации.")}
                            </Paragraph>
                            <Heading level={3} text={t("Шаг 5. Публикация")}  className="text-[#4f4f4f]  mb-2" />
                            <Paragraph className="text-sm leading-[150%] text-[#667085] mb-2">
                                {t("Если все верно — нажмите ")} «<b>{t("Опубликовать")}</b>».{t("Ваше объявление станет видно потенциальным покупателям и инвесторам.")}
                            </Paragraph>
                        </>
                    }
                    HeadingClassName="text-[#4f4f4f]  text-[20px] font-bold"
                />
            )}

            <div className="container mx-auto px-4 xl:px-20 md:px-4 lg:px-10 py-12 flex-1">
                {step !== 5 ? (
                    <div className="max-lg:mx-6 items-center">
                        <Breadcrumbs title="Создать объявление" />
                        <div className="flex max-lg:flex-col mt-7 gap-12">
                            <div className="relative w-full lg:max-w-63 flex flex-col gap-2">
                                {steps.map((s, i) => {
                                    const isActive = i === step;
                                    const isCompleted = i < step;

                                    return (
                                        <div key={i} className="relative flex flex-col items-start gap-2">
                                            <Button
                                                onClick={() => i <= step && setStep(i)}
                                                className="flex items-center gap-3 text-left z-10"
                                                disabled={i > step || offerSlug != null}
                                            >
                                                <div
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition
              ${isActive || isCompleted ? "border-[#2EAA62]" : "border-gray-300"}
            `}
                                                >
                                                    <span className={isActive || isCompleted ? "text-[#2EAA62]" : "text-gray-300"}>
                                                        {stepIcons[i]}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`text-base font-semibold ${isActive || isCompleted ? "text-[#2EAA62]" : "text-[#667085]"}`}
                                                >
                                                    {t(s.title)}
                                                </div>
                                            </Button>

                                            {i < steps.length - 1 && (
                                                <div
                                                    className={`ml-[15px] w-[2px] h-12.5 ${step > i ? "bg-[#2EAA62]" : "bg-gray-300"}`} />
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Умный помощник */}
                                <div className="mt-6 p-4 w-full bg-gradient-to-r from-[#1CA67A] to-[#24568E] rounded-[10px] flex gap-2 text-white">
                                    <Button onClick={() => setShowHelperModal(true)} className="flex flex-col text-left max-md:w-full cursor-pointer">
                                        <Paragraph className="font-bold  text-sm flex justify-start items-center">
                                            {t("Умный помощник")}  <HeadphonesIcon className="w-8.75 h-9.75 ml-2" />
                                        </Paragraph>
                                        <span className="text-xs leading-tight mt-1">
                                            {t("Здесь вы найдете инструкцию по размещению объявлений")}
                                        </span>
                                    </Button>
                                </div>

                            </div>


                            <div className="flex-1 p-10 bg-[#F8F8F8] max-md:p-0 max-md:bg-white">
                                {/* Step 0 - категория */}
                                {step === 0 && (
                                    <div >
                                        <Heading text={t("Категория объявления")} level={2} className="font-inter font-semibold text-3xl text-[#4f4f4f]  mb-1.5" />
                                        <Paragraph className="font-inter text-[16px] text-[#667085] mb-6">{t("Выберите категорию объявления")} </Paragraph>

                                        <div className="grid grid-cols-2 xl:grid-cols-4 max-sm:flex max-sm:flex-col gap-3 text-center">

                                            {offerTypes.map((type) => (
                                                <div
                                                    key={type}
                                                    className={`border rounded-lg w-48.75 max-sm:w-full max-sm:h-33 h-43 cursor-pointer text-center 
          flex items-center justify-center text-[#4f4f4f] 
          ${offerType === type ? "border-[#2EAA62] bg-[#F5FFFA]" : "border-gray-300"}`}
                                                    onClick={() => {
                                                        setOfferType(type);
                                                        handleNext();
                                                    }}
                                                >
                                                    <Paragraph className="font-semibold"> {t(offerTypeMap[type])} </Paragraph>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 1 — тип */}
                                {step === 1 && (
                                    <div>
                                        <Heading text={t("Категория объявления")} level={2} className="font-inter font-semibold text-3xl text-[#4f4f4f]  mb-1.5" />
                                        <Paragraph className="font-inter text-[16px] text-[#667085] mb-6">{t("Выберите категорию объявления")}</Paragraph>
                                        <div className="flex max-sm:flex-col gap-6 text-center ">

                                            {listingTypes.map((type, index) => (
                                                <div
                                                    key={type}
                                                    className={`  border rounded-lg w-48.75 h-43 max-sm:w-full max-sm:h-33 cursor-pointer text-center text-[#4f4f4f] 
          flex flex-col items-center justify-center ${listingType === type ? "border-[#2EAA62] bg-[#F5FFFA]" : "border-gray-300"}`}
                                                    onClick={() => {
                                                        setListingType(type as "buy" | "sell");
                                                        handleNext();
                                                    }}
                                                >
                                                    <span className="text-[#2EAA62]">{ListingTypesIcons[index]} </span>
                                                    <Paragraph className="font-semibold"> {t(getListingTypeLabel(type))}</Paragraph>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                )}
                                {/* Step-2 - информация */}
                                {step === 2 && offerType && listingType && (
                                    <InformationStep offerType={offerType} onNext={handleNext} onBack={handleBack} listingType={listingType} />
                                )}


                                {/* Step-3 - Публикация */}
                                {step === 3 && savedData && (
                                    <PublicationStep onPublish={handlePublish} onPreview={() => setStep(5)} onBack={handleBack} />
                                )}
                                {step == 1 && (
                                    <div className="mt-10">
                                        <Button
                                            onClick={handleBack}
                                            disabled={isBackDisabled()}
                                            className={`flex items-center gap-2 ${isBackDisabled() ? "bg-gray-300 cursor-not-allowed" : "bg-[#2EAA62] text-white"} px-6 py-2 rounded-md`}
                                        >
                                            <FiChevronLeft /> {t("Назад")}
                                        </Button>
                                    </div>
                                )}
                                {/* Step-4 - Готово */}
                                {step === 4 && (
                                    <ModerationStep />
                                )}
                                {step === 6 && offerSlug != null && (
                                    <PaymentStep offerSlug={offerSlug} onPayment={() => { setStep(4) }} />
                                )}
                            </div>
                        </div></div>
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
