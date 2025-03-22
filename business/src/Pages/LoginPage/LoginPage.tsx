
import { Header, Heading, Input, Paragraph } from '../../components/index'
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import './LoginPage.css'
import { Button } from '../../components/Button/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { NeedHelp } from '../../components/NeedHelp/NeedHelp';
import { Applink } from '../../components/AppLink/AppLink';


// interface ILoginForm {
//     useremail: string;
//     userpassword: string;
// }

const loginFormschema = yup.object({
    useremail: yup
        .string()
        .email("Введите почту в правильном формате")
        .required("Обязательное поле"),
    userpassword: yup
        .string()
        .required("Обязательное поле")
        .min(8, "Минимум 8 символов"),
});

export const LoginPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginFormschema),
        defaultValues: { useremail: "", userpassword: "" },
    });

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    return (
        <>
            <Header />
            <div className="min-w-screen min-h-screen flex items-center justify-center px-6 pt-[140px] md:pt-[100px] sm:pt-[80px] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-[85%] lg:max-w-[80%] md:max-w-[85%] sm:max-w-[90%] w-full items-center transition-all duration-500">
                    <div className="flex justify-center w-full transition-all duration-300">
                        <div className="w-full max-w-[700px] lg:max-w-[600px] md:max-w-[500px] sm:max-w-[360px] min-w-[320px] shadow-lg rounded-2xl p-[clamp(30px,4vw,70px)] flex flex-col items-center text-center transition-all duration-300">
                            <Heading className="text-[clamp(24px,2.2vw,44px)] font-bold text-blue-700 mb-[clamp(18px,2.2vw,36px)]" text={'Вход в личный кабинет'} level={1} />
                            <form className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                                <Controller
                                    name="useremail"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                isError={!!errors.useremail}
                                                errorMessage={errors.useremail?.message}
                                                type="text"
                                                placeholder="Email"
                                                {...field}
                                                className="w-full px-[clamp(16px,2.5vw,26px)] py-[clamp(12px,1.8vw,22px)] border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-500"
                                            />
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="userpassword"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative w-full">
                                            <Input
                                                isError={!!errors.userpassword}
                                                errorMessage={errors.userpassword?.message}
                                                type={isPasswordVisible ? "text" : "password"}
                                                placeholder="Пароль"
                                                {...field}
                                                className="w-full px-[clamp(16px,2.5vw,26px)] py-[clamp(12px,1.8vw,22px)] border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-500"
                                            />
                                            <span
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-5 top-[clamp(12px,1.8vw,22px)] cursor-pointer text-blue-500 transition-all duration-300"
                                            >
                                                {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                            </span>
                                        </div>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full py-[clamp(14px,2vw,24px)] text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg font-bold hover:from-blue-700 hover:to-blue-500 transition-all duration-500"
                                >
                                    Войти
                                </Button>
                            </form>
                            <Paragraph className="text-[clamp(14px,1.7vw,18px)] text-gray-600 mt-4 transition-all duration-300">
                                Еще нет аккаунта?
                                <Applink to='/register' className="text-blue-600 hover:underline ml-1 transition duration-500">Зарегистрироваться</Applink>
                            </Paragraph>
                            <div className="mt-6 w-full">
                                <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-5 py-[clamp(14px,2vw,24px)] shadow-md text-gray-700 font-semibold transition-all duration-500 hover:bg-gray-100 hover:shadow-lg active:">
                                    <img src="/images/google_icon.png" alt="Google" className="w-[clamp(22px,2.2vw,34px)] h-[clamp(22px,2.2vw,34px)]" />
                                    Войти с помощью Google
                                </button>
                            </div>
                        </div>
                    </div>
                    <NeedHelp />
                </div>
            </div >
        </>



    );
};
