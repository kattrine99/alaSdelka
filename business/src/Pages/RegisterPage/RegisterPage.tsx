import { useState, useEffect } from "react";
import { Button, Input, Heading, Header, Footer } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaArrowLeft } from "react-icons/fa";

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
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"buyer" | "partner" | null>(null);
    const [roleError, setRoleError] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm({
        resolver: yupResolver(stepOneSchema),
        mode: "onChange",
    });

    const formData = watch();

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
        console.log("Регистрация завершена", { ...formData, role: selectedRole });
    };

    return (
        <div className="w-screen font-openSans">
            <Header />
            <div className="flex px-[192px] pt-20">
                <div className="w-full max-w-md">
                    <Heading level={1} className="text-3xl font-bold text-center text-[#28B13D]" text={""}>
                        Регистрация
                    </Heading>

                    {step === 1 && (
                        <div>
                            <form onSubmit={handleSubmit(handleNext)} className="">
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
                                <Button type="submit" disabled={!isValid} className={`w-full ${!isValid && "opacity-50 cursor-not-allowed"}`}>
                                    Зарегистрироваться
                                </Button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="">
                            <button onClick={handleBack} className="flex items-center gap-2 text-[#28B13D] hover:underline">
                                <FaArrowLeft /> Назад
                            </button>

                            <Input
                                placeholder="Введите код из SMS"
                                value={code}
                                onChange={(e) => setCode(e.target.value)} isError={false} />

                            <Button onClick={() => setStep(3)} className="w-full">
                                Подтвердить
                            </Button>

                            <button
                                disabled={!canResend}
                                onClick={() => {
                                    setTimer(60);
                                    setCanResend(false);
                                }}
                                className={`text-sm ${canResend ? "text-[#28B13D] hover:underline" : "text-gray-400 cursor-not-allowed"}`}
                            >
                                {canResend ? "Отправить код повторно" : `Повтор через ${timer} сек`}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="">
                            <button onClick={handleBack} className="flex items-center gap-2 text-[#28B13D] hover:underline">
                                <FaArrowLeft /> Назад
                            </button>

                            <p className="text-center font-semibold">Выберите вашу роль:</p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => {
                                        setSelectedRole("buyer");
                                        setRoleError(false);
                                    }}
                                    className={`w-full ${selectedRole === "buyer" ? "bg-green-100 border border-[#28B13D] text-[#28B13D]" : "border"}`}
                                >
                                    Покупатель
                                </Button>
                                <Button
                                    onClick={() => {
                                        setSelectedRole("partner");
                                        setRoleError(false);
                                    }}
                                    className={`w-full ${selectedRole === "partner" ? "bg-green-100 border border-[#28B13D] text-[#28B13D]" : "border"}`}
                                >
                                    Партнёр
                                </Button>
                            </div>
                            {roleError && <p className="text-red-500 text-sm">Пожалуйста, выберите роль</p>}
                            <Button
                                onClick={() => {
                                    if (!selectedRole) setRoleError(true);
                                    else onSubmit();
                                }}
                                className="w-full"
                            >
                                Завершить регистрацию
                            </Button>
                        </div>
                    )}
                </div>

                {/*Описание*/}
                <div className="grid grid-cols-3 pb-[123px] pl-[37px] w-full relative">
                    {/* Card 01 */}
                    <div className="relative flex flex-col text-left">
                        <div className="mx-8.25 mb-7.75">
                            <img src="/images/benefits-img-1.png" className="w-[250px] h-auto relative z-10" />
                        </div>
                        <div>
                            <h3 className="text-[#252525] font-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                            <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                                Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                            </p>
                            <span className="absolute top-[350px] font-actay text-[160px] leading-[105%] opacity-[10%] text-[#252525] z-0">01</span>
                        </div>

                    </div>
                    {/* Card 02 */}
                    <div className="relative flex flex-col mt-[154px] text-left">
                        <div className="mx-8.25 mb-7.75">
                            <img src="/images/benefits-img-2.png" className="w-[250px] h-auto mb-4 relative z-10" />
                        </div>
                        <div>
                            <h3 className="text-[#252525] text-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                            <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                                Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                            </p>
                            <span className="absolute bottom-[340px] right-[33px] text-[clamp(64px,12vw,130px)] font-bold text-gray-200 z-0">02</span>

                        </div>

                    </div>
                    {/* Card 03 */}
                    <div className="relative flex flex-col text-left">
                        {/* <span className="absolute top-[397px] right-[9px] text-[clamp(64px,12vw,130px)] font-bold text-gray-200 z-0">03</span> */}
                        <div className="mx-8.25 mb-7.75">
                            <img src="/images/benefits-img-3.png" className="w-[250px] h-auto mb-4 relative z-10" />
                        </div>
                        <h3 className="text-[#252525] text-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                        </p>
                    </div>
                </div>

            </div>
            <Footer showSmallFooter={false} />
        </div>
    );
};
