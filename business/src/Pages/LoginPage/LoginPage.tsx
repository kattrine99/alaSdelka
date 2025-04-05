import { Footer, Header, Heading, Input, Paragraph } from '../../components/index'
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import './LoginPage.css'
import { Button } from '../../components/Button/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Applink } from '../../components/AppLink/AppLink';

const loginFormschema = yup.object({
    username: yup
        .string()
        .required("Введите имя")
        .min(2, "Имя должно содержать минимум 2 буквы")
        .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Имя должно содержать только буквы"),
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
        defaultValues: { username: "", userpassword: "" },
    });

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const onSubmit = () => {
        console.log("Login submitted");
    };


    return (
        <div className="min-w-screen min-h-screen bg-[url('public/images/grid.png')] bg-contain bg-no-repeat bg-right">
            <Header />
            <div className=" flex items-center justify-center py-[62px] transition-all duration-300">
                <div className="w-full flex px-[192px] transition-all duration-500">
                    <div className="w-full p-[clamp(30px,4vw,70px)] flex flex-col items-start text-start transition-all duration-300">
                        <Heading className="text-[32px] mb-[32px] font-inter font-bold text-black" text={'Вход в личный кабинет'} level={1} />
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-[clamp(14px,1.8vw,28px)]">
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        isError={!!errors.username}
                                        errorMessage={errors.username?.message}
                                        type="text"
                                        placeholder="Имя"
                                        className={`w-full px-[18px] py-[17px] border-2 bg-[#EEEEEE80] rounded-[14px] focus:outline-none text-[16px] font-semibold leading-[130%] transition-all duration-500 ${errors.username ? 'border-red-500 focus:ring-red-500' : field.value ? 'border-green-500 focus:ring-green-500' : 'border-[#9C9C9C33] focus:ring-[#2EAA7B]'}`}
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
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};