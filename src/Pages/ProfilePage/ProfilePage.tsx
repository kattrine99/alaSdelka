import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserInfoQuery, useUpdateUserInfoMutation } from "../../Store/api/Api";
import { Heading, Paragraph, Input, Button, Header, Footer, Breadcrumbs, ModalBase } from "../../components";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../Store/Slices/authSlice";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

const profileNavigate = [
    { label: "Мои объявления", to: "/announcements" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
    { label: "Продвижение", to: "/promotion" },
];

export const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const { data, isLoading, error } = useGetUserInfoQuery();
    const [updateUserInfo] = useUpdateUserInfoMutation();

    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        email: string;
        city_id: number;
        photo?: File;
    }>({
        name: "",
        phone: "",
        email: "",
        city_id: 0,
        photo: undefined,
    });

    const [showSuccess, setShowSuccess] = useState(false);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка</div>;
    if (!data) return <div>Нет данных</div>;

    const [firstName, lastName] = (data.name || "").split(" ");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        dispatch(setIsAuthenticated(false));
        navigate("/login");
    };

    const handleEditClick = () => {
        setEditMode(true);
        setFormData({
            name: data.name ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            city_id: data.city_id ?? 0,
            photo: undefined,
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
        }
    };

    const handleSave = async () => {
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("city_id", formData.city_id.toString());
            form.append("phone", formData.phone);

            if (formData.photo) {
                form.append("photo", formData.photo);
            }

            await updateUserInfo(form).unwrap();
            setEditMode(false);
            setShowSuccess(true);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const isEditingProfile = location.pathname.includes("profile") && editMode;

    return (
        <div className="w-screen">
            {showSuccess && (
                <ModalBase
                    title="Успешно!"
                    message="Данные успешно обновлены"
                    showCloseButton={false}
                />
            )}
            <Header navLinksData={profileNavigate} />
            <div className="w-full px-[192px] mt-6">
                {isEditingProfile && <Breadcrumbs category="profile" title="Редактировать личные данные" />}

                <div className="w-[1127px] p-5">
                    {!editMode && (
                        <>
                            <Heading
                                className="text-[#121212] font-inter font-bold text-4xl leading-10"
                                text={`Добро пожаловать, ${firstName}!`}
                                level={2}
                            />
                            <div className="flex justify-between mt-6 ml-5">
                                <div className="flex gap-x-6 mb-1.5 items-center">
                                    <img src={data.photo || ""} alt="profile_Photo" className="rounded-full w-[100px] h-[100px]" />
                                    <div className="flex flex-col gap-2">
                                        <Paragraph className="font-inter font-medium text-xl leading-7 tracking-[-1%]">{data.name}</Paragraph>
                                        <Paragraph className="font-inter font-semibold text-[14px] text-[#667085] leading-5">ID: {data.id}</Paragraph>
                                    </div>
                                </div>
                                <div className="flex gap-x-4 items-center">
                                    <Button className="h-[54px] px-5 text-white bg-[#31B683] rounded-[6px] cursor-pointer" onClick={handleLogout}>Выйти из профиля</Button>
                                    <Button className="px-5 h-[54px] text-white bg-[#31B683] rounded-[6px] cursor-pointer" onClick={handleEditClick}>Редактировать личные данные</Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bg-[#F8F8F8] w-full mt-6 p-10">
                        {editMode && (
                            <div className="relative w-max mb-6">
                                {formData.photo instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(formData.photo)}
                                        alt="Preview"
                                        className="rounded-full w-[140px] h-[140px] object-cover"
                                    />
                                ) : (
                                    <img
                                        src={data.photo}
                                        alt="profile_Photo"
                                        className="rounded-full w-[100px] h-[100px] object-cover"
                                    />
                                )}
                                <label className="absolute bottom-0 right-0 bg-white border border-[#2EAA7B] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                                    <FiEdit2 className="text-[#2EAA7B] text-sm" />
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                </label>
                            </div>
                        )}

                        <Heading className="text-[#101828] font-inter font-semibold text-xl leading-7 mb-3.5" text="Основная информация" level={3} />

                        <div className="flex flex-col gap-y-6">
                            <div className="flex gap-3.5">
                                <div className="w-[393px]">
                                    <label className="text-[#121212] text-sm mb-1 block">Имя</label>
                                    <Input
                                        title="Имя"
                                        type="text"
                                        value={editMode ? formData.name.split(" ")[0] : firstName}
                                        onChange={e => setFormData({ ...formData, name: `${e.target.value} ${lastName}` })}
                                        disabled={!editMode}
                                        isError={false}
                                    />
                                </div>
                                <div className="w-[393px]">
                                    <label className="text-[#121212] text-sm mb-1 block">Фамилия</label>
                                    <Input
                                        title="Фамилия"
                                        type="text"
                                        value={editMode ? formData.name.split(" ")[1] || "" : lastName}
                                        onChange={e => setFormData({ ...formData, name: `${firstName} ${e.target.value}` })}
                                        disabled={!editMode}
                                        isError={false}
                                    />
                                </div>
                            </div>

                            <div className="w-[800px]">
                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">Номер телефона</label>
                                    <Input
                                        title="Телефон"
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!editMode}
                                        isError={false}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">ID города</label>
                                    <Input
                                        title="Город"
                                        type="number"
                                        value={formData.city_id.toString()}
                                        onChange={e => setFormData({ ...formData, city_id: Number(e.target.value) })}
                                        disabled={!editMode}
                                        isError={false}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">Электронная почта</label>
                                    <Input
                                        title="Email"
                                        type="text"
                                        value={formData.email ?? ""}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!editMode}
                                        isError={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-4 mt-6">
                                <Button className="text-white bg-[#2EAA7B] px-6 py-3 rounded-[10px] cursor-pointer" onClick={handleSave}>Сохранить</Button>
                                <Button className="border border-[#2EAA7B] text-[#2EAA7B] px-6 py-3 rounded-[10px] cursor-pointer" onClick={handleCancel}>Отменить</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
