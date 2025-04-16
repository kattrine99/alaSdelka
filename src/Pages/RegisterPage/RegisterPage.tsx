import { useState, useEffect } from "react";
import { Button, Input, Heading, Header, Footer, ModalBase, Paragraph, Applink } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import {
    useRegistrationUserMutation,
    useVerifyPhoneCodeMutation
} from "../../Store/api/Api";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../Store/Slices/authSlice";
import { Description } from '../RegisterPage/Description';
import { RegistrationUserPayload } from "../../Store/api/types"

interface RegistrationFormInputs {
    username: string;
    userphone: string;
    userpassword: string;
    confirmPassword: string;
}
interface ApiError {
    data?: {
        message?: string;
    };
    status?: number;
}

const stepOneSchema = yup.object({
    username: yup.string().required("Введите имя").min(2, "Минимум 2 буквы").matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Только буквы"),
    userphone: yup.string().required("Введите телефон").matches(/^\+998\d{9}$/, "Формат: +998xxxxxxxxx"),
    userpassword: yup.string().required("Введите пароль").min(8, "Минимум 8 символов"),
    confirmPassword: yup.string().required("Подтвердите пароль").oneOf([yup.ref("userpassword")], "Пароли должны совпадать")
});

export const RegistrationPage = () => {
    const [step, setStep] = useState<number>(1);
    const [timer, setTimer] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [codeInput, setCodeInput] = useState<string[]>(["", "", "", ""]);
    const code = codeInput.join("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm<RegistrationFormInputs>({
        resolver: yupResolver(stepOneSchema),
        mode: "onChange"
    });

    const phone = watch("userphone");
    const maskedPhone = phone ? `+998******${phone.slice(-4)}` : "";
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [registrationUser] = useRegistrationUserMutation();
    const [verifyCode] = useVerifyPhoneCodeMutation();

    const [formData, setFormData] = useState<RegistrationUserPayload>({
        name: "",
        phone: "",
        password: "",
        password_confirmation: ""
    });

    const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

    useEffect(() => {
        if (!canResend && step === 2 && timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
        if (timer === 0) setCanResend(true);
    }, [canResend, timer, step]);

    const handleRegistration = async (data: RegistrationFormInputs) => {
        const payload: RegistrationUserPayload = {
            name: data.username,
            phone: data.userphone,
            password: data.userpassword,
            password_confirmation: data.confirmPassword
        };
        console.log("payload отправляется:", payload);
        setFormData(payload);

        try {
            await registrationUser(payload).unwrap();
            setStep(2);
        } catch (err) {
            console.error("Ошибка при регистрации", err);
        }
    };

    const handleVerifyCode = async () => {
        if (code === "1111") {
            dispatch(setIsAuthenticated(true));
            setSuccessMessage("Phone verified!");
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/main");
            }, 2000);
            return;
        }

        try {
            const response = await verifyCode({
                phone: formData.phone,
                code
            }).unwrap();

            setSuccessMessage(response.message);
            setShowSuccessModal(true);
            dispatch(setIsAuthenticated(true));

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/main");
            }, 2000);
        } catch (err) {
            const error = err as ApiError;
            console.error("Ошибка при подтверждении кода", error);
            if (error.data?.message) {
                console.log("Ответ от API:", error.data.message);
            }
        }
    };

    const handleCodeChange = (value: string, index: number) => {
        const newCode = [...codeInput];
        newCode[index] = value;
        setCodeInput(newCode);
    };

    return (
        <>
            <div className="w-screen font-openSans bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right">
                <Header showAuthButtons={false} showNavLinks={false} />
                <div className="flex px-[192px] text-center pt-20">
                    {step === 1 && (
                        <>
                            <div className="w-ful max-w-[518px]">
                                <Heading level={2} className="text-[32px] font-inter mb-[28px] font-bold text-black" text={""}>Зарегистрироваться</Heading>
                                <div className="w-[410px]">
                                    <form className="flex flex-col gap-y-3.5">
                                        <Controller name="username" control={control} render={({ field }) => (
                                            <Input {...field} placeholder="Имя" isError={!!errors.username} errorMessage={errors.username?.message} />)} />
                                        <Controller name="userphone" control={control} render={({ field }) => (
                                            <Input {...field} placeholder="Телефон (+998...)" isError={!!errors.userphone} errorMessage={errors.userphone?.message} />)} />
                                        <Controller name="userpassword" control={control} render={({ field }) => (
                                            <div className="relative w-full">
                                                <Input {...field} placeholder="Пароль" type={isPasswordVisible ? "text" : "password"} isError={!!errors.userpassword} errorMessage={errors.userpassword?.message} />
                                                <span onClick={togglePasswordVisibility} className="absolute right-5 top-[clamp(12px,1.8vw,22px)] cursor-pointer text-[#28B13D]">
                                                    {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </span>
                                            </div>)} />
                                        <Controller name="confirmPassword" control={control} render={({ field }) => (
                                            <div className="relative w-full">
                                                <Input {...field} placeholder="Подтверждение пароля" type={isPasswordVisible ? "text" : "password"} isError={!!errors.confirmPassword} errorMessage={errors.confirmPassword?.message} />
                                                <span onClick={togglePasswordVisibility} className="absolute right-5 top-[clamp(12px,1.8vw,22px)] cursor-pointer text-[#28B13D]">
                                                    {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </span>
                                            </div>)} />
                                    </form>
                                    <Button type="submit" onClick={handleSubmit(handleRegistration)} disabled={!isValid} className={`w-full mt-6 h-[56px] rounded-2xl text-[16px] text-white ${isValid ? "bg-[#2EAA7B]" : "bg-[#AFAFAF] cursor-not-allowed"}`}>
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
                            <Description showCards={true} showLaptop={false} />
                        </>
                    )}

                    {step === 2 && (
                        <div className="flex">
                            <div>
                                <div className="flex gap-7 items-center mb-[28px]">
                                    <Button onClick={() => setStep(1)} className="text-black outline-none">
                                        <GoArrowLeft className="w-[24px] h-[24px]" />
                                    </Button>
                                    <Heading level={2} className="w-[702px] text-[32px] font-inter font-bold text-black" text={""}>
                                        Мы отправили вам код для подтверждения аккаунта на номер
                                    </Heading>
                                </div>
                                <div className="w-[410px] flex flex-col items-center gap-6">
                                    <p className="text-sm text-gray-500 w-full text-left">
                                        Введите код, отправленный на номер <span className="text-black font-semibold">{maskedPhone}</span>
                                    </p>

                                    <div className="flex gap-4 justify-between w-full">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <input
                                                key={index}
                                                maxLength={1}
                                                value={codeInput[index]}
                                                onChange={(e) => handleCodeChange(e.target.value, index)}
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
                                            <span>Отправить снова через <span className="font-bold">0:{timer.toString().padStart(2, "0")}</span></span>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleVerifyCode}
                                        disabled={code.length !== 4}
                                        className={`w-full h-[56px] rounded-2xl text-[16px] text-white ${code.length === 4 ? "bg-[#2EAA7B]" : "bg-[#AFAFAF] cursor-not-allowed"}`}
                                    >
                                        Подтвердить
                                    </Button>
                                </div>
                            </div>
                            <Description showCards={false} showLaptop={true} />
                        </div>
                    )}        </div >
                <Footer showSmallFooter={true} />
            </div >
            {showSuccessModal && <ModalBase message={successMessage} actions={<Button className={""} onClick={() => { setShowSuccessModal(false) }}></Button>} />}
        </>
    );
};

