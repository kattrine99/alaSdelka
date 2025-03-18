
import { Header, Input } from '../../components/index'
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import './LoginPage.css'
import { Button } from '../../components/Button/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";


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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Header />
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-blue-700 mb-5">Вход в личный кабинет</h1>
                <form className="w-full flex flex-col gap-4">
                    {/* Поле Email */}
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        )}
                    />

                    {/* Поле Пароль */}
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-4 cursor-pointer text-blue-500"
                                >
                                    {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                </span>
                            </div>
                        )}
                    />

                    {/* Кнопка Вход */}
                    <Button
                        type="submit"
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg font-bold hover:from-blue-700 hover:to-blue-500 transition-all"
                    >
                        Войти
                    </Button>
                </form>

                {/* Ссылка на регистрацию */}
                <p className="text-sm text-gray-600 mt-4">
                    Еще нет аккаунта?
                    <a href="#" className="text-blue-600 hover:underline ml-1">Зарегистрироваться</a>
                </p>

                {/* Социальный логин */}
                <div className="mt-6">
                    <p className="text-sm text-gray-600">Или войдите через:</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <img src="/images/google-icon.png" alt="Google" className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" />
                        <img src="/images/facebook-icon.png" alt="Facebook" className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};
