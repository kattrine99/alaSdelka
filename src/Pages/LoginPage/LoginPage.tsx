import { Footer, Header, Heading, Input, Paragraph } from '../../components/index'
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import './LoginPage.css'
import { Button } from '../../components/Button/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Applink } from '../../components/AppLink/AppLink';
import { Description } from '../RegisterPage/Description';

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
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(loginFormschema),
        mode: "onChange",
        defaultValues: { userphone: "", userpassword: "" },
    });

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const onSubmit = () => {
        console.log("Login submitted");
    };


    return (
        <div className="min-w-screen bg-[url('/images/grid.png')] bg-contain bg-no-repeat bg-right">
            <Header showNavLinks={false} showAuthButtons={false} />
            <div className=" flex items-center justify-center py-[62px] transition-all duration-300">
                <div className="w-full flex px-[192px] transition-all duration-500">
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
                            <div className="mt-[30px] w-full">
                                <Button className="w-[378px] h-[56px] flex items-center gap-x-3 justify-center bg-white border border-[#C9CCCF] rounded-2xl text-[#232323] font-semibold  font-inter leading-[24px] transition-all duration-500 hover:bg-gray-100 hover:shadow-lg active:">
                                    <img src="/images/google_icon.png" alt="Google" className="w-[24px] h-[24px]" />
                                    Войти с помощью Google
                                </Button>
                            </div>
                            <Paragraph className="text-[16px] font-inter text-[#232323] leading-[130%] mt-10 transition-all duration-300">
                                Еще нет аккаунта?
                                <Applink to='/register' className="text-[#2EAA7B] hover:underline ml-1 font-semibold transition duration-500">Зарегистрироваться</Applink>
                            </Paragraph>
                        </div>
                    </div>
                    <div>
                        {/*Описание*/}
                        <Description showCards={true} showLaptop={false} showContact={false} />
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};