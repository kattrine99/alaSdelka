import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOfferStatsQuery } from "../../Store/api/Api";
import { Heading, Paragraph } from "../../components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import { FiAlertCircle } from "react-icons/fi";

export const StatisticsPage = () => {
    const { offerId } = useParams<{ offerId: string }>();
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        new Date(),
    ]);
    const [startDate, endDate] = dateRange;

    const { data, isLoading, error } = useGetOfferStatsQuery({
        offer_id: Number(offerId),
        from: format(startDate, "yyyy-MM-dd"),
        to: format(endDate, "yyyy-MM-dd"),
    });

    const chartData = {
        options: {
            chart: { id: "offer-stats" },
            xaxis: {
                categories: data?.data.map((entry) => entry.date) || [],
            },
        },
        series: [
            {
                name: "Посещения",
                data: data?.data.map((entry) => entry.view_count) || [],
            },
            {
                name: "Избранное",
                data: data?.data.map((entry) => entry.favourite_count) || [],
            },
            {
                name: "Контакты",
                data: data?.data.map((entry) => entry.contact_view_count) || [],
            },
        ],
    };
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-7.5">
                <div className="w-10 h-10 border-4 border-[#2EAA7B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (error) return <div className="w-screen h-[670px] flex flex-col justify-center items-center py-[30px]">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-3">
            <FiAlertCircle className="text-red-600 text-[28px]" />
        </div>
        <p className="text-red-600 text-lg font-semibold">Произошла ошибка при загрузке</p>
    </div>;
    return (
        <div className="px-16 py-10">
            <div className="mb-6">
                <Heading level={2} text="Статистика объявления" />
                <DatePicker
                    selected={startDate}
                    onChange={(update) => setDateRange(update as [Date, Date])}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    dateFormat="dd.MM.yyyy"
                    className="border p-2 rounded mt-4"
                />
            </div>

            {/* Метрики за неделю */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <StatsCard
                    label="Всего посещений"
                    value={data?.metrics.view_count.current_week}
                    diff={data?.metrics.view_count.change}
                />
                <StatsCard
                    label="Всего добавлено в избранное"
                    value={data?.metrics.favourite_count.current_week}
                    diff={data?.metrics.favourite_count.change}
                />
                <StatsCard
                    label="Всего просмотров контактов"
                    value={data?.metrics.contact_view_count.current_week}
                    diff={data?.metrics.contact_view_count.change}
                />
            </div>

            {/* График */}
            <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
    );
};

const StatsCard = ({ label, value, diff }: { label: string; value?: number; diff?: number }) => {
    const isPositive = (diff ?? 0) >= 0;
    return (
        <div className="p-6 bg-white rounded-xl shadow text-center">
            <Paragraph className="text-lg mb-1">{label}</Paragraph>
            <Paragraph className="text-3xl font-bold">{value ?? 0}</Paragraph>
            <Paragraph className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "↑" : "↓"} {Math.abs(diff ?? 0)} за неделю
            </Paragraph>
        </div>
    );
};
