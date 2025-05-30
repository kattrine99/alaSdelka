import { useState } from "react";
import {
    EmptyMessage,
    Footer,
    Header,
    Heading,
    Paragraph,
    Pagination,
} from "../../components";
import { profileNavigate } from "../../utils/categoryMap";
import { useGetNotificationsQuery } from "../../Store/api/Api";
import { Notification } from "../../Store/api/types";
import { CiCalendar } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";

export const NoticePage = () => {
    const [page, setPage] = useState(1);
    const perPage = 5;

    const { data, isLoading, isError } = useGetNotificationsQuery({ page, per_page: perPage });

    const notifications = data?.data ?? [];
    const totalPages = data?.meta?.last_page ?? 1;

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />

            <div className="px-4 sm:px-6 md:px-10 xl:px-48 py-9 min-h-screen">
                <Heading
                    text="Уведомления"
                    level={2}
                    className="font-inter text-xl font-bold leading-5"
                />

                {isLoading ? (
                    <div className="flex justify-center items-center py-[30px]">
                        <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <p className="text-red-500">Ошибка загрузки</p>
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
                                            text={item.title_ru}
                                            level={3}
                                        />
                                        <Paragraph className="font-inter text-lg text-[#232323] mb-3.5">
                                            {item.text_ru}
                                        </Paragraph>
                                        <div className="text-[#727272] text-sm flex gap-3 items-center">
                                            <span className="flex gap-2">
                                                <CiCalendar className="w-4 h-4 text-[#727272]" /> {date}
                                            </span>
                                            <span className="flex gap-2">
                                                <IoMdTime className="w-4 h-4 text-[#727272]" /> {time}
                                            </span>
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
