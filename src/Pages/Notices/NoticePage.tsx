import { useEffect, useState } from "react";
import {
    EmptyMessage,
    Footer,
    Header,
    Heading,
    Paragraph,
    Pagination,
    Button,
} from "../../components";
import { profileNavigate } from "../../utils/categoryMap";
import { useGetNotificationsQuery, useMarkAllReadMutation } from "../../Store/api/Api";
import { Notification } from "../../Store/api/types";
import { CiCalendar } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import CheckedAllIcon from "../../assets/check2-all.svg?react";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { useNavigate } from "react-router-dom";

export const NoticePage = () => {
    const [page, setPage] = useState(1);
    const perPage = 5;
    const { lang, t } = useTranslation()
    const { data, isLoading, isError, refetch } = useGetNotificationsQuery({ page, per_page: perPage });

    const notifications = data?.data ?? [];
    const totalPages = data?.meta?.last_page ?? 1;
    const unreadCount = data?.meta?.unread_count ?? 0;
    const [markAllAsRead] = useMarkAllReadMutation();
    const navigate = useNavigate()
    useEffect(() => {
        if (unreadCount > 0) {
            markAllAsRead()
                .unwrap()
                .then(() => {
                    localStorage.setItem("hasVisitedNotices", "true");
                    data?.data?.forEach(n => n.is_read = true);

                    refetch();
                })
                .catch(err => {
                    console.error("Ошибка при отметке уведомлений как прочитанных:", err);
                });
        }
    }, [unreadCount]);

    useEffect(() => {
        if (unreadCount > 0) {
            localStorage.removeItem("hasVisitedNotices");
        }
    }, [unreadCount]);

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />

            <div className="px-4 sm:px-6 md:px-10 xl:px-48 py-9 min-h-screen">
                <Heading
                    text={t("Уведомления")}
                    level={2}
                    className="font-inter text-xl font-bold leading-5"
                />

                {isLoading ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <p className="text-red-500">{t("Ошибка загрузки")}</p>
                ) : notifications.length === 0 ? (
                    <EmptyMessage
                        title="Нет уведомлений"
                        subtitle="Здесь будут отображаться ваши уведомления"
                        hideButton
                    />
                ) : (
                    <>
                        <div className="flex flex-col gap-4 mt-6">
                            {notifications.map((item: Notification, index: number) => {
                                const createdDate = new Date(item.created_at);
                                const date = createdDate.toLocaleDateString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                });
                                const time = createdDate.toLocaleTimeString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <div
                                        key={index}
                                        className="w-full mt-5 flex flex-col gap-6 rounded-lg py-6 px-5 shadow-[1px_1px_4.5px_0px] shadow-[#28B13D4D]"
                                    >
                                        <Heading
                                            className="font-inter font-bold text-lg text-[#232323] mb-3.5"
                                            text={lang === "uz" ? item.title_uz : item.title_ru}
                                            level={3}
                                        />
                                        <Paragraph className="font-inter text-lg text-[#232323] mb-3.5">
                                            {lang === "uz" ? item.text_uz : item.text_ru}
                                        </Paragraph>
                                        <div className="flex flex-col sm:flex-row justify-between">
                                            <div className="text-[#727272] text-sm flex gap-3 items-center">
                                                <span className="flex gap-2">
                                                    <CiCalendar className="w-4 h-4 text-[#727272]" /> {date}
                                                </span>
                                                <span className="flex gap-2">
                                                    <IoMdTime className="w-4 h-4 text-[#727272]" /> {time}
                                                </span>
                                            </div>
                                            <div className="text-[#2EAA7B] items-center mr-2 mt-3 sm:mt-0">
                                                {item.type === "offer_show" && item.offer_slug && (

                                                    <Button
                                                        className="bg-[#2EAA7B] text-white px-5 py-2 rounded-md"
                                                        onClick={() => navigate(`/card/${item.offer_slug}`)}
                                                    >
                                                        {t("Посмотреть")}
                                                    </Button>

                                                )}
                                                {item.type === "offer_edit" && (
                                                    <Button
                                                        className="bg-[#FF8707] text-white px-5 py-2 rounded-md"
                                                        onClick={() => navigate(`/edit/${item.offer_slug}`)}
                                                    >
                                                        {t("Исправить")}
                                                    </Button>
                                                )}
                                                {item.type === "promotion" && item.offer_slug && (
                                                    <Button
                                                        className="bg-[#2EAA7B] text-white px-5 py-2 rounded-md"
                                                        onClick={() => navigate(`/promotion/${item.offer_slug}`)}
                                                    >
                                                        {t("Продвижение")}
                                                    </Button>
                                                )}

                                                {item.type === "statistics" && item.offer_slug && (
                                                    <Button
                                                        className="bg-[#2EAA7B] text-white px-5 py-2 rounded-md"
                                                        onClick={() => navigate(`/statistics/${item.offer_slug}`)}
                                                    >
                                                        {t("Статистика")}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </>
                )}
            </div>

            <Footer showSmallFooter={true} />
        </div>
    );
};
