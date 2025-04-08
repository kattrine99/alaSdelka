import { useState, useEffect } from "react";
import { Button, Input, Heading, Header, Footer, Paragraph, Applink } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Description } from "./Description";
import { code } from "framer-motion/client";

const stepOneSchema = yup.object({
    username: yup
        .string()
        .required("Введите имя")
        .min(2, "Минимум 2 буквы")
        .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Только буквы"),
    userphone: yup
        .string()
        .required("Введите телефон")
        .matches(/^\+998\d{9}$/, "Формат: +998xxxxxxxxx"),
    userpassword: yup
        .string()
        .required("Введите пароль")
        .min(8, "Минимум 8 символов"),
    confirmPassword: yup
        .string()
        .required("Подтвердите пароль")
        .oneOf([yup.ref("userpassword")], "Пароли должны совпадать"),
});

export const RegistrationPage = () => {
    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"buyer" | "partner" | null>(null);
    const [roleError, setRoleError] = useState(false);
    const codeIsValid = code.length === 4;


    const {
        control,
        handleSubmit,
        watch, // <-- вот это нужный watch
        formState: { errors, isValid }
    } = useForm({
        resolver: yupResolver(stepOneSchema),
        mode: "onChange",
    });

    const phone = watch("userphone");
    const maskedPhone = phone ? `+998******${phone.slice(-4)}` : "";
    const navigate = useNavigate();

    useEffect(() => {
        if (!canResend && step === 2 && timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
        if (timer === 0) setCanResend(true);
    }, [canResend, timer, step]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const onSubmit = () => {
        return (
            navigate('/main')
        )
    };

    return (
        <>
            <div className="w-screen font-openSans bg-[url('public/images/grid.png')] bg-contain bg-no-repeat bg-right">
                <Header showAuthButtons={false} showNavLinks={false} />
                <div className="flex px-[192px] text-center pt-20">
                    {step === 1 && (
                        <>
                            <div className="w-ful max-w-[518px]">
                                <Heading level={2} className="text-[32px]  font-inter leading-[110%] mb-[28px] font-bold text-black" text={""}>
                                    Зарегистрироваться
                                </Heading>
                                <div className="w-[410px]">
                                    <form className="flex flex-col gap-y-3.5">
                                        <Controller
                                            name="username"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Имя" isError={!!errors.username} errorMessage={errors.username?.message} />
                                            )} />
                                        <Controller
                                            name="userphone"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Телефон (+998...)" isError={!!errors.userphone} errorMessage={errors.userphone?.message} />
                                            )} />
                                        <Controller
                                            name="userpassword"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Пароль" type="password" isError={!!errors.userpassword} errorMessage={errors.userpassword?.message} />
                                            )} />
                                        <Controller
                                            name="confirmPassword"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Подтверждение пароля" type="password" isError={!!errors.confirmPassword} errorMessage={errors.confirmPassword?.message} />
                                            )} />
                                    </form>
                                    <Button type="submit" onClick={handleSubmit(handleNext)} disabled={!isValid} className={`w-full mt-6 h-[56px] rounded-2xl text-[16px] text-white bg-[#2EAA7B] font-inter font-medium leading-[130%] ${!isValid && "bg-[#AFAFAF] cursor-not-allowed"}`}>
                                        Зарегистрироваться
                                    </Button>
                                    <div className='w-full max-w-[518px] flex flex-col items-center'>
                                        <div className='w-[237px] border border-[#DFDFDF] mt-[38px]'></div>
                                        <div className="mt-[30px] justify-center">
                                            <Button className="w-[378px] h-[56px] flex items-center gap-x-3 justify-center bg-white border border-[#C9CCCF] rounded-2xl text-[#232323] font-semibold  font-inter leading-[24px] transition-all duration-500 hover:bg-gray-100 hover:shadow-lg">
                                                <img src="/images/google_icon.png" alt="Google" className="w-[24px] h-[24px]" />
                                                Зарегистрироваться через Google
                                            </Button>
                                        </div>
                                        <Paragraph className="text-[16px] font-inter text-[#232323] leading-[130%] mt-10 transition-all duration-300">
                                            У вас уже есть аккаунт?
                                            <Applink to='/login' className="text-[#2EAA7B] hover:underline ml-1 font-semibold transition duration-500">Авторизоваться</Applink>
                                        </Paragraph>
                                    </div>

                                </div>
                            </div>
                            <Description showCards={true} showLaptop={false} showContact={false} />
                        </>
                    )}

                    {step === 2 && (
                        <div className="flex">
                            <div >
                                <div className="flex gap-7 items-center mb-[28px]">
                                    <Button onClick={handleBack} className="text-black outline-none">
                                        <GoArrowLeft className="w-[24px] h-[24px]" />
                                    </Button>
                                    <Heading level={2} className=" w-[702px] text-[32px] font-inter leading-[110%] font-bold text-black" text={""}>
                                        Мы отправили вам код для подтверждения
                                        вашего аккаунта на ваш номер
                                    </Heading>
                                </div>
                                <div className="w-[410px] flex flex-col items-center gap-6">
                                    <p className="text-sm text-gray-500 w-full text-left">
                                        Введите код отправленный на номер <span className="text-black font-semibold">{maskedPhone}</span>
                                    </p>

                                    <div className="flex gap-4 justify-between w-full">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <input
                                                key={index}
                                                maxLength={1}
                                                className="w-[60px] h-[72px] text-center text-[32px] rounded-[10px] border border-[#D9D9D9] focus:outline-none focus:border-[#2EAA7B] font-semibold text-black"
                                                type="text"
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center text-[14px] text-[#28B13D] font-semibold">
                                        {canResend ? (
                                            <button onClick={() => { setTimer(60); setCanResend(false); }} className="hover:underline">
                                                Отправить снова
                                            </button>
                                        ) : (
                                            <span>Отправить снова <span className="font-bold">{`0:${timer.toString().padStart(2, "0")}`}</span></span>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setStep(3)}
                                        disabled={codeIsValid}
                                        className={`w-full h-[56px] rounded-2xl text-[16px] text-white ${codeIsValid ? "bg-[#2EAA7B]" : "bg-[#AFAFAF] cursor-not-allowed"
                                            } font-inter font-medium leading-[130%]`}
                                    >
                                        Подтвердить
                                    </Button>
                                </div>
                            </div>
                            <Description showCards={false} showLaptop={true} showContact={false} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex gap-x-[424px]">
                            <div className="w-full max-w-[410px]">
                                <div className="flex gap-7 items-center mb-[28px]">
                                    <button onClick={handleBack} className="text-black outline-none">
                                        <GoArrowLeft className="w-[24px] h-[24px]" />
                                    </button>
                                    <Heading level={2} className="text-[28px] md:text-[32px] font-inter leading-[110%] font-bold text-black" text={""}>
                                        Выберите свою роль
                                    </Heading>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedRole("partner");
                                            setRoleError(false);
                                        }}
                                        className={`relative w-full text-left rounded-xl border p-5 pt-8 pb-5 pl-6 pr-5 transition-all duration-300 ${selectedRole === "partner"
                                            ? "border-[#2EAA7B] bg-white"
                                            : "border-[#C9CCCF] hover:border-[#2EAA7B]"}`}
                                    >
                                        <span
                                            className={`absolute top-4 left-4 w-[14px] h-[14px] rounded-full border-2 ${selectedRole === "partner"
                                                ? "border-[#2EAA7B] bg-[#2EAA7B]"
                                                : "border-[#C9CCCF] bg-white"}`} />

                                        <div className="ml-4">
                                            <p className="font-bold text-[#232323] mb-1">Продавец</p>
                                            <p className="text-[#6B6B6B] text-sm">Продать свой бизнес, разместить объявление о продаже</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedRole("buyer");
                                            setRoleError(false);
                                        }}
                                        className={`relative w-full text-left rounded-xl border p-5 pt-8 pb-5 pl-6 pr-5 transition-all duration-300 ${selectedRole === "buyer"
                                            ? "border-[#2EAA7B] bg-white"
                                            : "border-[#C9CCCF] hover:border-[#2EAA7B]"}`}
                                    >
                                        <span
                                            className={`absolute top-4 left-4 w-[14px] h-[14px] rounded-full border-2 ${selectedRole === "buyer"
                                                ? "border-[#2EAA7B] bg-[#2EAA7B]"
                                                : "border-[#C9CCCF] bg-white"}`} />

                                        <div className="ml-4">
                                            <p className="font-bold text-[#232323] mb-1">Покупатель</p>
                                            <p className="text-[#6B6B6B] text-sm">Купить бизнес, посмотреть предложения</p>
                                        </div>
                                    </button>
                                </div>
                                {roleError && <p className="text-red-500 text-sm mt-2">Пожалуйста, выберите роль</p>}

                                <Button
                                    onClick={() => {
                                        if (!selectedRole) setRoleError(true);
                                        else onSubmit();
                                    }}
                                    disabled={!selectedRole}
                                    className={`w-full mt-6 h-[56px] rounded-xl text-white font-semibold transition-all duration-300 ${selectedRole ? "bg-[#2EAA7B] hover:bg-[#239c6f]" : "bg-[#CFCFCF] cursor-not-allowed"}`}
                                >
                                    Далee
                                </Button>
                            </div>
                            <Description showCards={false} showLaptop={false} showContact={true} />
                        </div>
                    )}

                </div>
                <Footer showSmallFooter={true} />

            </div>
        </>
    );
};


