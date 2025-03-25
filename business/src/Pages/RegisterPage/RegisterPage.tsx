import { Button, Input, Heading, Header } from "../../components/";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { NeedHelp } from "../../components/NeedHelp/NeedHelp";

export interface IRegisterForm {
    username: string;
    useremail: string;
    userpassword: string;
}

const registerFormschema = yup.object({
    username: yup
        .string()
        .required("Обязательное поле")
        .min(2, "Имя должно содержать минимум 2 буквы")
        .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Имя должно содержать только буквы"),
    useremail: yup.string().email("Введите почту в правильном формате").required("Обязательное поле"),
    userpassword: yup.string().required("Обязательное поле").min(8, "Минимум 8 символов"),
});

export const RegistrationPage = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<IRegisterForm>({
        resolver: yupResolver(registerFormschema),
        defaultValues: {
            username: "",
            useremail: "",
            userpassword: "",
        },
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"buyer" | "partner" | null>(null);
    const [roleError, setRoleError] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
        if (!selectedRole) {
            setRoleError(true);
            return;
        }

        try {
            // const payload = {
            //   ...data,
            //   role: selectedRole,
            // };
            // const response = await registrationUser(payload).unwrap();
            // localStorage.setItem("user", JSON.stringify(response));
            console.log("Зарегистрирован:", { ...data, role: selectedRole });
        } catch (err) {
            console.error("Registration failed:", err);
            alert("Ошибка при регистрации. Пожалуйста, попробуйте снова.");
        }
    };

    return (

        <div className="min-w-screen min-h-screen flex items-center justify-center px-6 pt-[140px] md:pt-[100px] sm:pt-[80px] transition-all duration-300">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-[85%] lg:max-w-[80%] md:max-w-[85%] sm:max-w-[90%] w-full items-center transition-all duration-500">
                <div className="w-full max-w-[700px] lg:max-w-[600px] md:max-w-[500px] sm:max-w-[360px] min-w-[320px] shadow-lg rounded-2xl p-[clamp(30px,4vw,70px)] flex flex-col items-center text-center transition-all duration-300" >
                    <Heading className="text-[clamp(24px,2.2vw,44px)] font-bold text-blue-700 mb-[clamp(18px,2.2vw,36px)]" text="Регистрация" level={1} />

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 justify-center">
                                <div
                                    onClick={() => {
                                        setSelectedRole("buyer");
                                        setRoleError(false);
                                    }}
                                    className={`w-full py-4 px-6 rounded-lg cursor-pointer border transition-all duration-300 ${selectedRole === "buyer"
                                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                        : "border-gray-300 hover:border-blue-400"
                                        }`}
                                >
                                    Покупатель / Продавец
                                </div>
                                <div
                                    onClick={() => {
                                        setSelectedRole("partner");
                                        setRoleError(false);
                                    }}
                                    className={`w-full py-4 px-6 rounded-lg cursor-pointer border transition-all duration-300 ${selectedRole === "partner"
                                        ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                                        : "border-gray-300 hover:border-green-400"
                                        }`}
                                >
                                    Партнер
                                </div>
                            </div>
                            {roleError && <p className="text-red-500 text-sm">Пожалуйста, выберите роль</p>}
                        </div>

                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    isError={!!errors.username}
                                    errorMessage={errors.username?.message}
                                    type="text"
                                    placeholder="Имя"
                                    {...field}

                                />
                            )}
                        />
                        <Controller
                            name="useremail"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    isError={!!errors.useremail}
                                    errorMessage={errors.useremail?.message}
                                    type="email"
                                    placeholder="Email"
                                    {...field}
                                />
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
                            Зарегистрироваться
                        </Button>
                    </form>
                </div>
                <NeedHelp />
            </div>

        </div>
    );
};
