import {Footer, Header, Heading, Input, Paragraph, Applink, Button, ModalBase} from '../../components/index';
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useState} from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {Description} from '../RegisterPage/Description';
import {useLoginUserMutation} from '../../Store/api/Api';
import {useDispatch} from 'react-redux';
import {setAccessToken, setIsAuthenticated, setLogoutReason} from '../../Store/Slices/authSlice';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useTranslation} from '../../../public/Locales/context/TranslationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './LoginPage.css';

interface LoginFormInputs {
    userphone: string;
    userpassword: string;
}

const loginFormschema = yup.object({
    userphone: yup
        .string()
        .required("Введите номер телефона")
        .min(10, "Введите корректный номер телефона"),
    userpassword: yup
        .string()
        .required("Обязательное поле")
        .min(8, "Минимум 8 символов"),
});

export const LoginPage = () => {
    const {lang, t} = useTranslation()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [searchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginUser] = useLoginUserMutation();

    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginFormschema),
        mode: "onChange",
        defaultValues: {userphone: "", userpassword: ""},
    });

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await loginUser({
                phone: `+${data.userphone}`,
                password: data.userpassword,
            }).unwrap();

            const expiresAt = Date.now() + response.expires_in * 1000;

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("expires_in", expiresAt.toString());

            dispatch(setLogoutReason(null));
            dispatch(setAccessToken(response.access_token));
            dispatch(setIsAuthenticated(true));

            setModalText("Вы успешно вошли в аккаунт");
            setModalTitle("Добро пожаловать!");
            setShowModal(true);

            const nextStepParam = searchParams.get('next-step')
            if (nextStepParam) {
                setTimeout(() => {
                    setShowModal(false);
                    navigate(`/${lang}${nextStepParam}`);
                }, 2000)
            } else {
                setTimeout(() => {
                    setShowModal(false);
                    navigate(`/${lang}/announcements`);
                }, 2000);
            }
        } catch (error) {
            console.error("Ошибка при логине:", error);
            setModalTitle("Упс!");
            setModalText("Неверный номер или пароль");
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
                        className={"w-full text-center py-4 hover:border-1 hover:bg-white hover:text-[#2EAA62] hover:border-[#2EAA62] text-white bg-[#2EAA62] rounded-[14px]"}
                        onClick={() => {
                            setShowModal(false);
                        }}>Подтвердить</Button>}/>}
            </div>
            <Header showNavLinks={false} showAuthButtons={false}/>
            <div className=" flex flex-1 items-center justify-center py-[62px] transition-all duration-300  px-7 py-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 container mx-auto px-4 xl:px-20 lg:px-10 md:px-4 transition-all duration-500">
                    <div
                        className="w-full flex flex-col items-start text-start transition-all duration-300">
                        <Heading className="text-[32px] mb-[32px] font-inter font-bold text-[#4f4f4f] "
                                 text={t('Вход в личный кабинет')} level={1}/>
                        <form onSubmit={handleSubmit(onSubmit)}
                              className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                            <Controller
                                name="userphone"
                                control={control}
                                render={({field}) => (
                                    <div className="w-full">
                                        <PhoneInput
                                            country={'uz'}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            onBlur={field.onBlur}
                                            inputProps={{
                                                name: field.name,
                                                required: true,
                                                autoFocus: false,
                                            }}
                                            containerClass={`flex-1 flex-col ${errors.userphone ? 'error' : field.value ? 'success' : ''}`}
                                            inputClass="w-full"
                                            buttonClass="phone-input-button"
                                            dropdownClass="phone-input-dropdown"
                                            placeholder={t("Номер телефона")}
                                            countryCodeEditable={false}
                                            specialLabel=""
                                        />
                                        {errors.userphone && (
                                            <Paragraph className="text-sm text-red-500 mt-1">
                                                {t(errors.userphone?.message || "")}
                                            </Paragraph>
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="userpassword"
                                control={control}
                                render={({field}) => (
                                    <div className="relative w-full">
                                        <Input
                                            {...field}
                                            isError={!!errors.userpassword}
                                            errorMessage={t(errors.userpassword?.message || "")}
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder={t("Пароль")}
                                            className={`w-full px-[18px] py-[17px] bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${errors.userpassword ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA62]'}`}
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
                                disabled={!isValid}
                                className={`w-full h-[56px] text-white rounded-2xl font-bold transition-all duration-500 ${isValid ? 'bg-[#2EAA62]' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                {t("Войти")}
                            </Button>
                        </form>
                        <div className='w-full flex flex-col items-center'>
                            <div className='w-[237px] border border-[#DFDFDF] mt-[38px]'></div>
                            {/*<div className="mt-[30px] w-full">*/}
                            {/*    <Button className="w-[378px] h-[56px] flex items-center gap-x-3 justify-center bg-white border border-[#C9CCCF] rounded-2xl text-[#4f4f4f]  font-semibold  font-inter leading-[24px] transition-all duration-500 hover:bg-gray-100 hover:shadow-lg active:">*/}
                            {/*        <img src="/images/google_icon.png" alt="Google" className="w-[24px] h-[24px]" />*/}
                            {/*        Войти с помощью Google*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                            <Paragraph
                                className="w-full text-center text-[16px] font-inter text-[#4f4f4f]  leading-[130%] mt-10 transition-all duration-300">
                                {t("Еще нет аккаунта?")}
                                <Applink to='/register'
                                         className="text-[#2EAA62] hover:underline ml-1 font-semibold transition duration-500">{t("Зарегистрироваться")}</Applink>
                            </Paragraph>
                            <Paragraph
                                className="w-full text-center text-[16px] font-inter text-[#4f4f4f]  leading-[130%] mt-4 transition-all duration-300">
                                {t("Забыли пароль?")}
                                <Applink to='/password-reset'
                                         className="text-[#2EAA62] hover:underline ml-1 font-semibold transition duration-500">{t("Восстановить")}</Applink>
                            </Paragraph>
                        </div>
                    </div>
                    <div className='hidden md:block'>
                        <Description showCards={true} showLaptop={false}/>
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true}/>
        </div>
    );
};
