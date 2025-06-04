import { Footer, Header, Heading, Input, Paragraph, Applink, Button, ModalBase } from '../../components/index';
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import './LoginPage.css';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Description } from '../RegisterPage/Description';
import { useLoginUserMutation } from '../../Store/api/Api';
import { useDispatch } from 'react-redux';
import { setAccessToken, setIsAuthenticated, setLogoutReason } from '../../Store/Slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
    userphone: string;
    userpassword: string;
}

const loginFormschema = yup.object({
    userphone: yup
        .string()
        .required("Введите номер телефона")
        .matches(/^\+998\d{9}$/, "Формат: +998xxxxxxxxx"),
    userpassword: yup
        .string()
        .required("Обязательное поле")
        .min(8, "Минимум 8 символов"),
});

export const LoginPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginUser] = useLoginUserMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginFormschema),
        mode: "onChange",
        defaultValues: { userphone: "", userpassword: "" },
    });

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await loginUser({
                phone: data.userphone,
                password: data.userpassword,
            }).unwrap();

            const expiresAt = Date.now() + response.expires_in * 1000;

            localStorage.setItem("accessToken", response.access_token);
            localStorage.setItem("expiresAt", expiresAt.toString());

            dispatch(setLogoutReason(null));
            dispatch(setAccessToken(response.access_token));
            dispatch(setIsAuthenticated(true));

            setModalText("Вы успешно вошли в аккаунт");
            setModalTitle("Добро пожаловать!");
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
                navigate("/main");
            }, 2000);
        } catch (error) {
            console.error("Ошибка при логине:", error);
            setModalTitle("Упс!");
            setModalText("Неверный номер или пароль");
            setShowModal(true);
        }
    };


    return (

        <div className="min-w-screen sm:bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right">
            <div className='flex flex-col'>
                {showModal && <ModalBase
                    title={modalTitle}
                    message={modalText}
                    ModalClassName='w-115 p-10'
                    HeadingClassName="font-inter font-semibold text-[32px] leading-11 "
                    onClose={() => setShowModal(false)}
                    actions={<Button className={"w-full text-center py-4 hover:border-1 hover:bg-white hover:text-[#2EAA7B] hover:border-[#2EAA7B] text-white bg-[#2EAA7B] rounded-[14px]"} onClick={() => { setShowModal(false); }}>Подтвердить</Button>} />}
            </div>
            <Header showNavLinks={false} showAuthButtons={false} />
            <div className=" flex items-center justify-center py-[62px] transition-all duration-300">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:px-36 transition-all duration-500">
                    <div className="w-full p-[clamp(30px,4vw,70px)] flex flex-col items-start text-start transition-all duration-300">
                        <Heading className="text-[32px] mb-[32px] font-inter font-bold text-black" text={'Вход в личный кабинет'} level={1} />
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                            <Controller
                                name="userphone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        isError={!!errors.userphone}
                                        errorMessage={errors.userphone?.message}
                                        type="text"
                                        placeholder="Номер телефона"
                                        className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${errors.userphone ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                    />
                                )}
                            />
                            <Controller
                                name="userpassword"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative w-full">
                                        <Input
                                            {...field}
                                            isError={!!errors.userpassword}
                                            errorMessage={errors.userpassword?.message}
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Пароль"
                                            className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${errors.userpassword ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
                                        />
                                        <span
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-5 top-[clamp(12px,1.8vw,22px)] cursor-pointer text-[#28B13D] transition-all duration-300"
                                        >
                                            {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                        </span>
                                    </div>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={!isValid}
                                className={`w-full h-[56px] text-white rounded-2xl font-bold transition-all duration-500 ${isValid ? 'bg-[#2EAA7B]' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Войти
                            </Button>
                        </form>
                        <div className='w-full flex flex-col items-center'>
                            <div className='w-[237px] border border-[#DFDFDF] mt-[38px]'></div>
                            {/*<div className="mt-[30px] w-full">*/}
                            {/*    <Button className="w-[378px] h-[56px] flex items-center gap-x-3 justify-center bg-white border border-[#C9CCCF] rounded-2xl text-[#232323] font-semibold  font-inter leading-[24px] transition-all duration-500 hover:bg-gray-100 hover:shadow-lg active:">*/}
                            {/*        <img src="/images/google_icon.png" alt="Google" className="w-[24px] h-[24px]" />*/}
                            {/*        Войти с помощью Google*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                            <Paragraph className="w-full text-center text-[16px] font-inter text-[#232323] leading-[130%] mt-10 transition-all duration-300">
                                Еще нет аккаунта?
                                <Applink to='/register' className="text-[#2EAA7B] hover:underline ml-1 font-semibold transition duration-500">Зарегистрироваться</Applink>
                            </Paragraph>
                        </div>
                    </div>
                    <div className='hidden md:block'>
                        <Description showCards={true} showLaptop={false} />
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
