import { useState, useEffect } from "react";
import { Button, Input, Heading, Header, Footer, Paragraph, Applink } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    } = useForm({
        resolver: yupResolver(stepOneSchema),
        mode: "onChange",
    });

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
        <div className="w-screen font-openSans bg-[url('public/images/grid.png')] bg-contain bg-no-repeat bg-right">
            <Header />
            <div className="flex px-[192px] pt-20">
                <div className="w-full max-w-[518px]">

                    {step === 1 && (
                        <><Heading level={2} className="text-[32px] font-inter leading-[110%] mb-[28px] font-bold text-black" text={""}>
                            Зарегистрируйтесь сейчас,
                            чтобы присоединиться к InvestIn
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
                            </div></>
                    )}
                    {step === 2 && (
                        <div className="w-full">
                            <Heading level={2} className="text-[32px] font-inter leading-[110%] mb-[28px] font-bold text-black" text={""}>
                                Мы отправили вам код для подтверждения
                                вашего аккаунта на ваш номер
                            </Heading>
                            <button onClick={handleBack} className="flex items-center gap-2 text-[#28B13D] hover:underline">
                                <FaArrowLeft /> Назад
                            </button>

                            <Input
                                placeholder="Введите код из SMS"
                                value={code}
                                onChange={(e) => setCode(e.target.value)} isError={false} />

                            <Button onClick={() => setStep(3)} className={`w-full mt-6 h-[56px] rounded-2xl text-[16px] text-white bg-[#2EAA7B] font-inter font-medium leading-[130%] ${!isValid && "bg-[#AFAFAF] cursor-not-allowed"}`}>
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
                        <div className="w-full max-w-[410px]">
                            <button onClick={handleBack} className="flex items-center gap-2 text-[#28B13D] hover:underline mb-6">
                                <FaArrowLeft /> Назад
                            </button>

                            <Heading level={2} className="text-[28px] md:text-[32px] font-inter leading-[110%] mb-[28px] font-bold text-black" text={""}>
                                Выберите свою роль
                            </Heading>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        setSelectedRole("partner");
                                        setRoleError(false);
                                    }}
                                    className={`relative w-full text-left rounded-xl border p-5 pt-8 pb-5 pl-6 pr-5 transition-all duration-300 ${selectedRole === "partner"
                                        ? "border-[#2EAA7B] bg-white"
                                        : "border-[#C9CCCF] hover:border-[#2EAA7B]"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-4 left-4 w-[14px] h-[14px] rounded-full border-2 ${selectedRole === "partner"
                                            ? "border-[#2EAA7B] bg-[#2EAA7B]"
                                            : "border-[#C9CCCF] bg-white"
                                            }`}
                                    />

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
                                        : "border-[#C9CCCF] hover:border-[#2EAA7B]"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-4 left-4 w-[14px] h-[14px] rounded-full border-2 ${selectedRole === "buyer"
                                            ? "border-[#2EAA7B] bg-[#2EAA7B]"
                                            : "border-[#C9CCCF] bg-white"
                                            }`}
                                    />

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
                                className={`w-full mt-6 h-[56px] rounded-xl text-white font-semibold transition-all duration-300 ${selectedRole ? "bg-[#2EAA7B] hover:bg-[#239c6f]" : "bg-[#CFCFCF] cursor-not-allowed"
                                    }`}
                            >
                                Далee
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
                            <span className="absolute top-[350px] font-actay text-[160px] leading-[105%] opacity-[10%] font-bold text-[#252525] z-0">01</span>
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
                            <span className="absolute bottom-[350px] right-[33px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0">02</span>

                        </div>

                    </div>
                    {/* Card 03 */}
                    <div className="relative flex flex-col text-left">
                        <div className="mx-8.25 mb-7.75">
                            <img src="/images/benefits-img-3.png" className="w-[250px] h-auto mb-4 relative z-10" />
                        </div>
                        <h3 className="text-[#252525] text-inter text-[36px] font-semibold mb-[15px] relative z-10">Описание</h3>
                        <p className="text-[#252525] font-inter font-normal text-[16px] text-sm relative z-10">
                            Gain access to AAA-funded accounts with the capacity to hold up to 400k in funded accounts within 72 hours of successfully completing the evaluation stage.
                        </p>
                        <span className="absolute top-[397px] right-[9px] text-[160px] font-bold text-[#252525] leading-[105%] opacity-[10%] z-0">03</span>

                    </div>
                </div>

            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
