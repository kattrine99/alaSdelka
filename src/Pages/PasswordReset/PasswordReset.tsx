import {Button, Footer, Header, Heading, Input, ModalBase, Paragraph} from "../../components";
import {useState} from "react";
import {useTranslation} from "../../../public/Locales/context/TranslationContext.tsx";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {setAccessToken, setIsAuthenticated, setLogoutReason} from "../../Store/Slices/authSlice.ts";
import {useRequestResetPasswordMutation, useResetPasswordMutation} from "../../Store/api/Api.ts";
import {useNavigate} from "react-router-dom";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {Description} from "../RegisterPage/Description.tsx";

interface RequestPasswordResetProps {
    userphone: string;
}

interface PasswordResetProps {
    userphone: string;
    code: string;
    userpassword: string;
}

const requestResetPasswordFormSchema = yup.object({
    userphone: yup
        .string()
        .required("Введите номер телефона")
        .matches(/^\+998\d{9}$/, "Формат: +998xxxxxxxxx"),
});

const resetPasswordFormSchema = yup.object({
    userphone: yup
        .string()
        .required("Введите номер телефона")
        .matches(/^\+998\d{9}$/, "Формат: +998xxxxxxxxx"),
    userpassword: yup
        .string()
        .required("Обязательное поле")
        .min(8, "Минимум 8 символов"),
    code: yup.string().required("Обязательное поле")
        .length(4, "Должно быть 4 цифры")
});

export const PasswordReset = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {lang, t} = useTranslation();
    const navigate = useNavigate();
    const {
        control: requestControl,
        handleSubmit: handleRequestSubmit,
        formState: {errors: requestErrors, isValid: requestIsValid},
    } = useForm<RequestPasswordResetProps>({
        resolver: yupResolver(requestResetPasswordFormSchema),
        mode: "onChange",
        defaultValues: {userphone: ""},
    });
    const {
        control: resetControl,
        setValue: setResetValue,
        handleSubmit: handleResetSubmit,
        formState: {errors: resetErrors, isValid: resetIsValid},
    } = useForm<PasswordResetProps>({
        resolver: yupResolver(resetPasswordFormSchema),
        mode: "onChange",
        defaultValues: {userphone: "", userpassword: "", code: ""},
    });
    const [requestResetPassword] = useRequestResetPasswordMutation();
    const [resetPassword] = useResetPasswordMutation();
    const onRequestSubmit = async (data: RequestPasswordResetProps) => {
        try {
            await requestResetPassword({
                phone: data.userphone,
            }).unwrap();
            await setResetValue('userphone', data.userphone)
            setStep(2);

        } catch (error) {
            console.error("Ошибка при сбросе пароля:", error);
            setModalTitle("Упс!");
            setModalText("Не удалось сбросить пароль, попробуйте позже");
            setShowModal(true);
        }
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };
    const onResetSubmit = async (data: PasswordResetProps) => {
        try {
            await resetPassword({
                phone: data.userphone,
                password: data.userpassword,
                code: data.code
            }).unwrap();
            setModalText("Теперь войдте в систему с новым паролем");
            setModalTitle("Вы сбросили пароль!");
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false)
                navigate(`/${lang}/login`)
            }, 2000);

        } catch (error) {
            console.error("Ошибка при сбросе пароля:", error);
            setModalTitle("Упс!");
            setModalText("Не удалось сбросить пароль, попробуйте позже");
            setShowModal(true);
        }
    };
    return (
        <div
            className="min-w-screen flex flex-col min-h-screen sm:bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right">
            <div className='flex flex-col flex-0'>
                {showModal && <ModalBase
                    title={t(modalTitle)}
                    message={t(modalText)}
                    ModalClassName='w-115 p-10'
                    HeadingClassName="font-inter font-semibold text-[32px] leading-11 "
                    onClose={() => setShowModal(false)}
                    actions={<Button
                        className={"w-full text-center py-4 hover:border-1 hover:bg-white hover:text-[#2EAA7B] hover:border-[#2EAA7B] text-white bg-[#2EAA7B] rounded-[14px]"}
                        onClick={() => {
                            setShowModal(false);
                        }}>Подтвердить</Button>}/>}
            </div>
            <Header showNavLinks={false} showAuthButtons={false}/>
            <div className=" flex flex-1 items-center justify-center py-[62px] transition-all duration-300">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:px-36 transition-all duration-500">
                    <div
                        className="w-full p-[clamp(30px,4vw,70px)] flex flex-col items-start text-start transition-all duration-300">
                        <Heading className="text-[32px] mb-[32px] font-inter font-bold text-black"
                                 text={t('Сброс пароля')} level={1}/>
                        {(step == 1) && (
                            <form onSubmit={handleRequestSubmit(onRequestSubmit)}
                                  className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                                <Controller
                                    name="userphone"
                                    control={requestControl}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            isError={!!requestErrors.userphone}
                                            errorMessage={t(requestErrors.userphone?.message || "")}
                                            type="text"
                                            placeholder={t("Номер телефона")}
                                            className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${requestErrors.userphone ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                        />
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={!requestIsValid}
                                    className={`w-full h-[56px] text-white rounded-2xl font-bold transition-all duration-500 ${requestIsValid ? 'bg-[#2EAA7B]' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    {t("Продолжить")}
                                </Button>
                            </form>
                        )}
                        {(step == 2) && (
                            <>
                                <Paragraph>На ваш номер было отправлено SMS с кодом. Введите его ниже и установите новый
                                    пароль</Paragraph>
                                <form onSubmit={handleResetSubmit(onResetSubmit)}
                                      className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                                    <Controller
                                        name="userphone"
                                        control={resetControl}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                hidden={true}
                                                isError={!!resetErrors.userphone}
                                                errorMessage={t(resetErrors.userphone?.message || "")}
                                                type="text"
                                                placeholder={t("Номер телефона")}
                                                className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${resetErrors.userphone ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="code"
                                        control={resetControl}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                isError={!!resetErrors.code}
                                                errorMessage={t(resetErrors.code?.message || "")}
                                                type="text"
                                                placeholder={t("Код")}
                                                className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${resetErrors.code ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="userpassword"
                                        control={resetControl}
                                        render={({field}) => (
                                            <div className="relative w-full">
                                                <Input
                                                    {...field}
                                                    isError={!!resetErrors.userpassword}
                                                    errorMessage={t(resetErrors.userpassword?.message || "")}
                                                    type={isPasswordVisible ? "text" : "password"}
                                                    placeholder={t("Пароль")}
                                                    className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${resetErrors.userpassword ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute right-5 top-[clamp(12px,1.8vw,22px)] cursor-pointer text-[#28B13D] transition-all duration-300"
                                                >
                                                    {isPasswordVisible ? <FaRegEyeSlash/> : <FaRegEye/>}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!resetIsValid}
                                        className={`w-full h-[56px] text-white rounded-2xl font-bold transition-all duration-500 ${resetIsValid ? 'bg-[#2EAA7B]' : 'bg-gray-300 cursor-not-allowed'}`}
                                    >
                                        {t("Сбросить пароль")}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                    <div className='hidden md:block'>
                        <Description showCards={true} showLaptop={false}/>
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true}/>
        </div>
    );
}