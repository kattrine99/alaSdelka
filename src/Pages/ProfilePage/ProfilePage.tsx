import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserInfoQuery, useUpdateUserInfoMutation, useLogoutMutation } from "../../Store/api/Api";
import { Heading, Paragraph, Input, Button, Header, Footer, Breadcrumbs, ModalBase } from "../../components";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../Store/Slices/authSlice";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { profileNavigate } from "../../utils/categoryMap"
import { FiAlertCircle } from "react-icons/fi";
import FlagIcon from '../../assets/Flag.svg?react'

export const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const { data, isLoading, error, refetch } = useGetUserInfoQuery();
    const [updateUserInfo] = useUpdateUserInfoMutation();

    const [fullNameInput, setFullNameInput] = useState("");

    const [formData, setFormData] = useState<{
        phone: string;
        email: string;
        city_id: number;
        photo?: File;
    }>({
        phone: "",
        email: "",
        city_id: 1,
        photo: undefined,
    });
    const [logout] = useLogoutMutation();
    const [showSuccess, setShowSuccess] = useState(false);
    if (isLoading) return <div className="w-screen h-[670px] flex justify-center items-center py-[30px]">
        <div className="w-30 h-30 border-10 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
    </div>;
    if (error) return <div className="w-screen h-[670px] flex flex-col justify-center items-center py-[30px]">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-3">
            <FiAlertCircle className="text-red-600 text-[28px]" />
        </div>
        <p className="text-red-600 text-lg font-semibold">Произошла ошибка при загрузке</p>
    </div>;
    if (!data) return <div>Нет данных</div>
    const fullName = data.name || "";
    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            localStorage.removeItem("access_token");
            dispatch(setIsAuthenticated(false));
            navigate("/main");
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        if (data) {
            setFullNameInput(fullName)
            setFormData({
                phone: data.phone ?? "",
                email: data.email ?? "",
                city_id: data.city?.id ?? 0,
                photo: undefined,
            });
        }
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
            form.append("name", fullName);
            if (formData.email) form.append("email", formData.email);
            form.append("city_id", formData.city_id.toString());
            if (formData.phone) form.append("phone", formData.phone);
            if (formData.photo) form.append("photo", formData.photo);

            await updateUserInfo(form).unwrap();
            await refetch();
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
                    ModalClassName='w-100 p-9'
                    showCloseButton={true}
                    onClose={() => setShowSuccess(false)}
                    HeadingClassName={"font-inter font-semibold text-[#101828] text-3xl leading-[44px]"} />
            )}
            <Header navLinksData={profileNavigate} />
            <div className="w-full px-48 max-lg:px-20 max-md:px-2 mt-6">
                {isEditingProfile && <Breadcrumbs
                    links={[
                        { label: "Главная", href: "/" },
                        { label: "Профиль", href: "/profile" },
                        { label: "Редактировать личные данные" },
                    ]}
                />
                }

                <div className="w-full p-5">
                    {!editMode && (
                        <>
                            <Heading
                                className="text-[#121212] font-inter font-bold text-4xl leading-10"
                                text={`Добро пожаловать, ${fullName}!`}
                                level={2} />
                            <div className="flex flex-col md:flex-row justify-center md:justify-between max-w-281.75 mt-6">
                                <div className="flex gap-x-6 mb-1.5 items-center w-full">
                                    {data.photo && (
                                        <img src={data.photo || "/src/assets/profile-circle.svg"} alt="profile_Photo" className="rounded-full w-[100px] h-[100px]" />
                                    )}                                    <div className="flex flex-col gap-2 w-full">
                                        <Paragraph className="font-inter font-medium text-xl leading-7 text-center md:text-left tracking-[-1%]">{data.name}</Paragraph>
                                        <Paragraph className="font-inter font-semibold text-[14px] text-center md:text-left text-[#667085] leading-5">ID: {data.id}</Paragraph>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:flex-row gap-x-4 gap-y-4 items-center">
                                    <Button className="px-5 h-13.5 text-white bg-[#31B683] w-full rounded-[6px] cursor-pointer" onClick={handleEditClick}>Редактировать личные данные</Button>
                                    <Button className="h-13.5 px-5 text-white bg-[#31B683] hover:bg-[#DE5151] w-full rounded-[6px] cursor-pointer" onClick={handleLogout}>Выйти из профиля</Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bg-[#F8F8F8] max-w-281.75 mt-6 p-10">
                        {editMode && (
                            <div className="relative w-max mb-6">
                                {formData.photo ? (


                                    <img src={URL.createObjectURL(formData.photo)} alt="Preview" className="rounded-full w-[100px] h-[100px] object-cover" />


                                ) : (
                                    <img
                                        src={data.photo}
                                        alt="profile_Photo"
                                        className="rounded-full w-25 h-25 object-cover"
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
                            <div className="flex flex-col">
                                <label className="text-[#121212] text-sm mb-1 block">Имя Фамилия</label>
                                {editMode ? (<Input
                                    title="Имя Фамилия"
                                    type="text"
                                    value={editMode && fullNameInput}
                                    onChange={e => setFullNameInput(e.target.value)}
                                    disabled={!editMode}
                                    isError={false}
                                    className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"
                                />) : (
                                    <div className="w-full">
                                        <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]">
                                            {fullName || " "}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">Номер телефона</label>
                                    {editMode ? (
                                        <div className="flex items-center bg-[#F2F2F2] rounded-[10px] px-4 py-[10px]">
                                            <FlagIcon className="w-6.25 h-6.25 object-contain mr-3" />
                                            <Input
                                                title="Телефон"
                                                type="text"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={!editMode}
                                                isError={false}
                                                className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"
                                            />
                                        </div>

                                    ) : (
                                        <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px] flex items-center gap-2">
                                            <FlagIcon className="w-[25px] h-[25px] object-contain" />
                                            {data.phone || " "}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">Город</label>
                                    {editMode ? (<Input
                                        title="Город"
                                        type="number"
                                        value={formData.city_id.toString()}
                                        onChange={e => setFormData({ ...formData, city_id: Number(e.target.value) })}
                                        disabled={!editMode}
                                        isError={false}
                                        className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"

                                    />) : (
                                        <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]">
                                            {data.city?.name_ru || " "}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="text-[#121212] text-sm mb-1 block">Электронная почта</label>
                                    {editMode ? (
                                        <Input
                                            title="Email"
                                            type="text"
                                            value={formData.email ?? ""}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            disabled={!editMode}
                                            isError={false}
                                            className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"

                                        />
                                    ) : (
                                        <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]">
                                            {data.email || " "}
                                        </div>
                                    )}
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
