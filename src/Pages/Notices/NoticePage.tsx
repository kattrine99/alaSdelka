import { EmptyMessage, Footer, Header, Heading } from "../../components";
import { profileNavigate } from "../../utils/categoryMap";
import { useGetNotificationsQuery } from "../../Store/api/Api";
import { Notification } from "../../Store/api/types";
export const NoticePage = () => {
    const { data, isLoading, isError } = useGetNotificationsQuery();

    const notifications = data?.data ?? [];

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} />
            <div className="px-48 py-9">
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
                    />) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {notifications.map((item: Notification, index: number) => (
                            <div
                                key={index}
                                className="border border-green-100 rounded-lg p-4 shadow-sm"
                            >
                                <h3 className="font-bold text-black mb-1">{item.title_ru}</h3>
                                <p className="text-gray-700 mb-3">{item.text_ru}</p>
                                <div className="text-gray-400 text-sm flex gap-4 items-center">
                                    <span>📅 17.05.2021</span>
                                    <span>⏰ 16:23</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
