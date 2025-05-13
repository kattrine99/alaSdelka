import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserInfoQuery, useUpdateUserInfoMutation } from "../../Store/api/Api";
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

    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
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
    const [firstName, lastName] = (data.name || "").split(" ");
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        dispatch(setIsAuthenticated(false));
        navigate("/login");
    };

    const handleEditClick = () => {
        setEditMode(true);
        if (data) {
            setFirstNameInput(firstName);
            setLastNameInput(lastName);
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
            const fullName = `${firstNameInput} ${lastNameInput}`.trim();

            const form = new FormData();
            form.append("name", fullName);
            if (formData.email) form.append("email", formData.email);
            form.append("city_id", formData.city_id.toString());
            if (formData.phone) form.append("phone", formData.phone);
            if (formData.photo) form.append("photo", formData.photo);

            await updateUserInfo(form).unwrap();
            await refetch(); // ⬅️ перезапрашиваем данные
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
                    showCloseButton={true}
                    onClose={() => setShowSuccess(false)}
                />
            )}
            <Header navLinksData={profileNavigate} />
            <div className="w-full px-48 mt-6">
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
                                text={`Добро пожаловать, ${firstName}!`}
                                level={2} />
                            <div className="flex justify-between mt-6 ml-5">
                                <div className="flex gap-x-6 mb-1.5 items-center">
                                    {data.photo && (
                                        <img src={data.photo || "/src/assets/profile-circle.svg"} alt="profile_Photo" className="rounded-full w-[100px] h-[100px]" />
                                    )}                                    <div className="flex flex-col gap-2">
                                        <Paragraph className="font-inter font-medium text-xl leading-7 tracking-[-1%]">{data.name}</Paragraph>
                                        <Paragraph className="font-inter font-semibold text-[14px] text-[#667085] leading-5">ID: {data.id}</Paragraph>
                                    </div>
                                </div>
                                <div className="flex gap-x-4 items-center">
                                    <Button className="h-13.5 px-5 text-white bg-[#31B683] rounded-[6px] cursor-pointer" onClick={handleLogout}>Выйти из профиля</Button>
                                    <Button className="px-5 h-13.5 text-white bg-[#31B683] rounded-[6px] cursor-pointer" onClick={handleEditClick}>Редактировать личные данные</Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bg-[#F8F8F8] w-full mt-6 p-10">
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
                            <div className="flex gap-3.5">
                                <div className="w-98.25">
                                    <label className="text-[#121212] text-sm mb-1 block">Имя</label>
                                    {editMode ? (<Input
                                        title="Имя"
                                        type="text"
                                        value={editMode ? firstNameInput : firstName}
                                        onChange={e => setFirstNameInput(e.target.value)}
                                        disabled={!editMode}
                                        isError={false}
                                        className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"
                                    />) : (
                                        <div className="w-98.25">
                                            <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]">
                                                {firstName || " "}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-98.25">
                                    <label className="text-[#121212] text-sm mb-1 block">Фамилия</label>
                                    {editMode ? (<Input
                                        title="Фамилия"
                                        type="text"
                                        value={editMode ? lastNameInput : lastName}
                                        onChange={e => setLastNameInput(e.target.value)}
                                        disabled={!editMode}
                                        isError={false}
                                        className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]"
                                    />) : (
                                        <div className="bg-[#F2F2F2] rounded-[10px] h-14 px-4 py-3.5 text-[#121212] text-[16px]">
                                            {lastName || " "}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-[800px]">
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
