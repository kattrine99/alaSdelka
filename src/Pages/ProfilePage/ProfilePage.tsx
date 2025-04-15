import { useNavigate } from "react-router-dom";
import { useGetUserInfoQuery } from "../../Store/api/authApi";
import { Heading, Paragraph, Input, Button, Header } from "../../components";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../Store/Slices/authSlice";

const profileNavigate = [
    { label: "Мои объявления", to: "/announcements" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
    { label: "Продвижение", to: "/promotion" },
]
export const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("access_token");
        dispatch(setIsAuthenticated(false)); // если ты используешь authSlice
        navigate("/login");
    };
    const { data, isLoading, error } = useGetUserInfoQuery();

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка</div>;
    if (!data) return <div>Нет данных</div>;

    const [firstName = "", lastName = ""] = data.name.split(" ");

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />
            <div className="w-full px-[192px]">
                <Paragraph className="font-inter my-9 mx-5 text-[#191919] font-bold text-xl leading-5">Профиль</Paragraph>
                <div className="w-[1127px] p-5">
                    <div>
                        <Heading
                            className="text-[#121212] font-inter font-bold text-4xl leading-10"
                            text={`Добро пожаловать, ${firstName}!`}
                            level={2}
                        />
                    </div>
                    <div className="flex justify-between mt-6 ml-5">
                        <div className="flex gap-x-6 mb-1.5 items-center">
                            <img
                                src={data.photo || ""}
                                alt="profile_Photo"
                                className="rounded-full w-[100px] h-[100px]"
                            />
                            <div className="flex flex-col gap-2">
                                <Paragraph className="font-inter font-medium text-xl leading-7 tracking-[-1%]">{data.name}</Paragraph>
                                <Paragraph className="font-inter font-semibold text-[14px] text-[#667085] leading-5">ID: {data.id}</Paragraph>
                            </div>
                        </div>
                        <div className="flex gap-x-4 items-center">
                            <Button className="h-[54px] px-5 text-white bg-[#31B683] rounded-[6px]" onClick={logout}>
                                Выйти из профиля
                            </Button>
                            <Button className="px-5 h-[54px] text-white bg-[#31B683] rounded-[6px]" onClick={() => console.log("Редактирование...")}>
                                Редактировать личные данные
                            </Button>
                        </div>
                    </div>

                    <div className="bg-[#F8F8F8] w-full mt-2 p-10">
                        <Heading
                            className="text-[#101828] font-inter font-semibold text-xl leading-7 mb-3.5"
                            text="Основная информация"
                            level={3}
                        />
                        <div className="flex gap-3.5">
                            <div className="w-[393px]">
                                <label className="text-[#121212] text-sm mb-1 block">Имя</label>
                                <Input title="Имя" type="text" value={firstName} disabled isError={false} />
                            </div>
                            <div className="w-[393px]">
                                <label className="text-[#121212] text-sm mb-1 block">Фамилия</label>
                                <Input title="Фамилия" type="text" value={lastName} disabled isError={false} />
                            </div>
                        </div>
                        <div className="flex gap-3.5 mt-4">
                            <div className="w-[393px]">
                                <label className="text-[#121212] text-sm mb-1 block">Номер телефона</label>
                                <Input title="Телефон" type="text" value={data.phone} disabled isError={false} />
                            </div>
                            <div className="w-[393px]">
                                <label className="text-[#121212] text-sm mb-1 block">Город</label>
                                <Input title="Город" type="text" value="Ташкент" disabled isError={false} /> {/* временно хардкод */}
                            </div>
                        </div>
                        <div className="w-[393px] mt-4">
                            <label className="text-[#121212] text-sm mb-1 block">Электронная почта</label>
                            <Input title="Email" type="text" value={data.email} disabled isError={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
