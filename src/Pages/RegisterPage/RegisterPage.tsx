import { useState, useEffect, useRef } from "react";
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
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
interface RegistrationFormInputs {
    username: string;
    userphone: string;
    userpassword: string;
    confirmPassword: string;
}

interface ApiError {
    data?: {
        message?: string;
        errors?: {
            phone?: string[];
        }
    };
    status?: number;

}

const stepOneSchema = yup.object({
    username: yup.string().required("Введите имя").min(2, "Минимум 2 буквы").matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Только буквы"),
    userphone: yup.string().required("Введите телефон"),
    userpassword: yup.string().required("Введите пароль").min(8, "Минимум 8 символов"),
    confirmPassword: yup.string().required("Подтвердите пароль").oneOf([yup.ref("userpassword")], "Пароли должны совпадать")
});

export const RegistrationPage = () => {
    const [step, setStep] = useState<number>(1);
    const [timer, setTimer] = useState<number>(60);
    const [codeError, setCodeError] = useState(false);

    const { lang } = useTranslation();

    const [canResend, setCanResend] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const inputsRef = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
    const [codeInput, setCodeInput] = useState<string[]>(["", "", "", ""]);
    const code = codeInput.join("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation()
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        setError,
    } = useForm<RegistrationFormInputs>({
        resolver: yupResolver(stepOneSchema),
        mode: "onChange"
    });

    const phone = watch("userphone");
    const maskedPhone = phone ? `+998******${phone.slice(-4)}` : "";
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [registrationUser] = useRegistrationUserMutation();
    const [verifyCode] = useVerifyPhoneCodeMutation();

    const [formData, setFormData] = useState<RegistrationUserPayload>({
        name: "",
        phone: "",
        password: "",
        password_confirmation: ""
    });

    const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(prev => !prev);

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
        setFormData(payload);

        try {
            await registrationUser(payload).unwrap();
            setStep(2);
        } catch (err) {
            const error = err as ApiError;
            console.log(error);
            
            const phoneErrors = error?.data?.errors?.phone;
            if (Array.isArray(phoneErrors) && phoneErrors.includes("The phone has already been taken.")) {
                setError("userphone", {
                    type: "manual",
                    message: t("Этот номер уже зарегистрирован"),
                });
            }
        }
    };

    const handleVerifyCode = async () => {
        if (code.length !== 4) return;

        try {
            const response = await verifyCode({
                phone: formData.phone,
                code
            }).unwrap();

            const expiresAt = Date.now() + response.expires_in * 1000;

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("expires_in", expiresAt.toString());

            dispatch(setIsAuthenticated(true));

            setSuccessMessage(response.message);
            setShowSuccessModal(true);


            setTimeout(() => {
                setShowSuccessModal(false);
                navigate(`/${lang}/`);
            }, 2000);
        } catch (err) {
            const error = err as ApiError;
            console.error("Ошибка при подтверждении кода", error);

            setCodeError(true);

            // Очистка полей кода
            setCodeInput(["", "", "", ""]);

            setTimeout(() => {
                setCodeError(false);
                inputsRef.current[0]?.focus();
            }, 500);
        }
    };

    const handleCodeChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newCode = [...codeInput];
        newCode[index] = value;
        setCodeInput(newCode);

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        if (e.key === "Backspace" && !codeInput[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };


    return (
        <>
            <div className="min-w-screen font-openSans bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right">
                <Header showAuthButtons={false} showNavLinks={false} />
                {step === 1 && (
                    <>
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 container mx-auto ppx-4 xl:px-20 lg:px-10 md:px-4 lg:py-15 transition-all duration-500">
                            <div
                                className="w-full flex max-xl:mt-8 flex-col items-start text-start transition-all duration-300">
                                <Heading level={2} className="text-[32px] max-xl:text-3xl max-sm:text-2xl font-inter mb-7 font-bold text-[#4f4f4f] "
                                    text={""}>{t("Зарегистрироваться")}</Heading>
                                <div className="w-full ">
                                    <form className="flex flex-col gap-y-3.5">
                                        <Controller name="username" control={control} render={({ field }) => (
                                            <Input {...field} placeholder={t("Имя Фамилия")} isError={!!errors.username}
                                                errorMessage={t(errors.username?.message || "")}
                                                className="py-3.5 w-full px-4.5 bg-[#EEEEEE80] outline-none rounded-[14px]" />)} />
                                        <Controller name="userphone" control={control} render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder={t("Телефон (+998...)")}
                                                isError={!!errors.userphone}
                                                errorMessage={t(errors.userphone?.message || "")}
                                                className="py-3.5 w-full px-4.5 bg-[#EEEEEE80] outline-none rounded-[14px]"
                                            />
                                        )} />
                                        <Controller name="userpassword" control={control} render={({ field }) => (
                                            <div className="relative w-full">
                                                <Input {...field} placeholder={t("Пароль")}
                                                    type={isPasswordVisible ? "text" : "password"}
                                                    isError={!!errors.userpassword}
                                                    errorMessage={t(errors.userpassword?.message || "")}
                                                    className="py-3.5 w-full px-4.5 bg-[#EEEEEE80] outline-none rounded-[14px]" />
                                                <span onClick={togglePasswordVisibility}
                                                    className="absolute right-5 top-[clamp(12px,1.8vw,20px)] cursor-pointer text-[#28B13D]">
                                                    {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </span>
                                            </div>)} />
                                        <Controller name="confirmPassword" control={control} render={({ field }) => (
                                            <div className="relative w-full">
                                                <Input {...field} placeholder={t("Подтверждение пароля")}
                                                    type={isConfirmPasswordVisible ? "text" : "password"}
                                                    isError={!!errors.confirmPassword}
                                                    errorMessage={t(errors.confirmPassword?.message || "")}
                                                    className="py-3.5 w-full px-4.5 bg-[#EEEEEE80] outline-none rounded-[14px]" />
                                                <span onClick={toggleConfirmPasswordVisibility}
                                                    className="absolute right-5 top-[clamp(12px,1.8vw,20px)] cursor-pointer text-[#28B13D]">
                                                    {isConfirmPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </span>
                                            </div>)} />
                                    </form>
                                    <Button type="submit" onClick={handleSubmit(handleRegistration)} disabled={!isValid}
                                        className={`w-full mt-6 h-[56px] rounded-2xl text-[16px] text-white ${isValid ? "bg-[#2EAA62]" : "bg-[#AFAFAF] cursor-not-allowed"}`}>
                                        {t("Зарегистрироваться")}
                                    </Button>
                                    <div className='w-full flex flex-col text-center items-center mb-10'>
                                        <div className='w-[237px] border border-[#DFDFDF] mt-[38px]'></div>
                                        {/*<div className="mt-[30px] justify-center">*/}
                                        {/*    <Button className="w-94.5 h-[56px] flex items-center gap-x-3 justify-center bg-white border border-[#C9CCCF] rounded-2xl text-[#4f4f4f]  font-semibold  font-inter leading-[24px] transition-all duration-500 hover:bg-gray-100 hover:shadow-lg">*/}
                                        {/*        <img src="/images/google_icon.png" alt="Google" className="w-6 h-6" />*/}
                                        {/*        Зарегистрироваться через Google*/}
                                        {/*    </Button>*/}
                                        {/*</div>*/}
                                        <Paragraph
                                            className="text-[16px] font-inter text-[#4f4f4f]  leading-[130%] mt-10 transition-all duration-300">
                                            {t("У вас уже есть аккаунт?")}
                                            <Applink to='/login'
                                                className="text-[#2EAA62] hover:underline ml-1 font-semibold transition duration-500">{t("Авторизоваться")}</Applink>
                                        </Paragraph>
                                    </div>

                                </div>
                            </div>
                            <div className="hidden md:block">
                                <Description showCards={true} showLaptop={false} />
                            </div>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 text-center lg:pt-20 w-full">
                        <div className="w-full p-[clamp(30px,4vw,70px)] flex flex-col items-start text-start transition-all duration-300">
                            <div className="flex gap-7 items-center mb-[28px]">
                                <Button onClick={() => setStep(1)} className="hidden md:block text-[#4f4f4f]  outline-none">
                                    <GoArrowLeft className="w-6 h-6" />
                                </Button>
                                <Heading level={2} className="md:text-3xl text-2xl text-center font-inter font-bold text-[#4f4f4f] "
                                    text={""}>
                                    {t("Мы отправили вам код для подтверждения аккаунта на номер")}
                                </Heading>
                            </div>
                            <div className="mx-auto flex flex-col items-center gap-6">
                                <p className="text-sm text-gray-500 w-full text-left">
                                    {t("Введите код, отправленный на номер")} <span
                                        className="text-[#4f4f4f]  font-semibold">{maskedPhone}</span>
                                </p>

                                <div className="flex gap-4 justify-between w-full">
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
                                            autoFocus={index === 0}
                                            className={`w-15 h-18 text-center text-[32px] rounded-[10px] border ${codeError ? "border-red-500" : "border-[#D9D9D9]"
                                                } focus:outline-none focus:border-[#2EAA62] font-semibold text-[#4f4f4f] `}
                                            type="text"
                                            isError={false}
                                        />
                                    ))}
                                </div>

                                <div className="text-center text-[14px] text-[#28B13D] font-semibold">
                                    {canResend ? (
                                        <button onClick={() => {
                                            setTimer(60);
                                            setCanResend(false);
                                        }} className="hover:underline">
                                            {t("Отправить снова")}
                                        </button>
                                    ) : (
                                        <span>{t("Отправить снова через")} <span
                                            className="font-bold">0:{timer.toString().padStart(2, "0")}</span></span>
                                    )}
                                </div>

                                <Button
                                    onClick={handleVerifyCode}
                                    disabled={code.length !== 4}
                                    className={`w-full h-14 rounded-2xl text-[16px] text-white ${code.length === 4 ? "bg-[#2EAA62]" : "bg-[#AFAFAF] cursor-not-allowed"}`}
                                >
                                    {t("Подтвердить")}
                                </Button>
                                <Button onClick={() => setStep(1)} className="block md:hidden text-[#4f4f4f]  outline-none w-full h-14 rounded-2xl text-[16px] ">
                                    {t("Назад")}
                                </Button>
                            </div>
                        </div>
                        <div className="hidden md:block mx-auto">
                            <Description showCards={false} showLaptop={true} />
                        </div>
                    </div>
                )}
                <Footer showSmallFooter={true} />
            </div>
            {showSuccessModal && (
                <ModalBase
                    title={t("Успешно!")}
                    message={successMessage}
                    onClose={() => setShowSuccessModal(false)}
                    actions={<Button
                        className="w-full text-center py-4 hover:border hover:bg-white hover:text-[#2EAA62] hover:border-[#2EAA62] text-white bg-[#2EAA62] rounded-[14px]"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        {t("Подтвердить")}
                    </Button>}
                    HeadingClassName={"font-bold text-[#4f4f4f] font-inter text-xl"}
                    ModalClassName="w-115" />
            )}
        </>
    );
};

