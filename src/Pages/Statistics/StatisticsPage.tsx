import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useLazyGetOfferStatsQuery } from "../../Store/api/Api";
import { Breadcrumbs, Footer, Header, Heading, Paragraph } from "../../components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import { FiAlertCircle } from "react-icons/fi";
import { profileNavigate } from "../../utils/categoryMap";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import './StatisticsPage.css'
registerLocale("ru", ru);

export const StatisticsPage = () => {

    const { id } = useParams<{ id: string }>();
    const offerId = Number(id);

    const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 14);
        return [start, end];
    });

    const [trigger, { data, isLoading, error }] = useLazyGetOfferStatsQuery();
    const [startDate, endDate] = dateRange;



    const fetchStats = useCallback(() => {

        const from = format(startDate, "yyyy-MM-dd");
        const to = format(endDate, "yyyy-MM-dd");

        trigger({
            offer_id: Number(offerId),
            from,
            to,
        });
    }, [offerId, startDate, endDate, trigger]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats, offerId]);

    const handleDateChange = (range: [Date, Date]) => {
        setDateRange(range);
    };

    const chartData = {
        options: {
            chart: {
                id: "offer-stats",
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: "Inter, sans-serif",
                animations: { enabled: true },
            },
            colors: ["#2EAA7B"],
            stroke: {
                curve: "straight" as const,
                width: 4,
            },
            grid: {
                show: true,
                borderColor: "#CECECE",
                strokeDashArray: 0,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: true } },
            },
            xaxis: {
                categories: data?.data.map((entry) =>
                    format(new Date(entry.date), "dd.MM")
                ) || [],
                labels: {
                    style: {
                        fontSize: "13px",
                        colors: "#98A2B3",
                    },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
                tooltip: { enabled: false },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: "13px",
                        colors: "#98A2B3",
                    },
                },
            },
            markers: {
                size: 0,
                strokeColor: "#2EAA7B",
                strokeWidth: 3,
                shape: "circle" as const,
                colors: ["#ffffff"],
                hover: { size: 0 },
            },
            tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
                    const entry = data?.data?.[dataPointIndex];
                    if (!entry) return "";
                    return `
        <div style="padding:10px 14px;font-family:Inter;background:white;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.08);font-size:14px;color:#101828;">
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:24px">
            <p style="font-weight:bold; font-size:15px;">Посещения страницы</p>
            <p style="font-size:15px;">${entry.view_count ?? 0}</p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:24px">
            <p style="font-weight:bold; font-size:15px;">Добавлено в избранное</p>
            <p style="font-size:15px;">${entry.favourite_count ?? 0}</p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:24px">
            <p style="font-weight:bold; font-size:15px;">Контакты просмотрены</p>
            <p style="font-size:15px;">${entry.contact_view_count ?? 0}</p>
          </div>
        </div>
      `;
                },
            },
            crosshairs: {
                show: true,
                width: 0,
                position: 'back',
                stroke: {
                    width: 0,
                },
                fill: {
                    type: 'solid',
                    color: '#2EAA7B',
                    opacity: 1,
                },
            },
            legend: { show: false },
        },

        series: [
            {
                name: "Итого по всем метрикам",
                data:
                    data?.data.map((entry) =>
                        (entry.view_count ?? 0) +
                        (entry.favourite_count ?? 0) +
                        (entry.contact_view_count ?? 0)
                    ) || [],
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

    if (error) {
        return (
            <div className="w-screen h-[670px] flex flex-col justify-center items-center py-[30px]">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-3">
                    <FiAlertCircle className="text-red-600 text-[28px]" />
                </div>
                <p className="text-red-600 text-lg font-semibold">Произошла ошибка при загрузке</p>
            </div>
        );
    }

    return (
        <div className="w-screen">
            <Header navLinksData={profileNavigate} showtoBar={false} />
            <div className="flex flex-col justify-center py-10 container mx-auto px-3 xl:px-0">
                <div className="mb-12">
                    <Breadcrumbs
                        links={[
                            { label: "Мои объявления", href: "/announcements" },
                            { label: "Статистика", href: `/statistics/${offerId}` },
                        ]} />
                </div>
                <div className="mb-6">
                    <Heading level={2} text="Статистика объявления" className="font-inter font-bold text-xl leading-5 -space-x-[-0.5%]" />
                </div>

                <div className="flex justify-start flex-wrap md:flex-nowrap gap-6 mb-12">
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
                <div className="bg-[#F8F8F8] shadow-[0px_1px_7px_rgba(0,0,0,0.25)] rounded-lg">
                    <DatePicker
                        locale="ru"
                        selected={startDate}
                        onChange={(update) => handleDateChange(update as [Date, Date])}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        calendarClassName="custom-calendar"
                        dayClassName={() => "custom-day"}
                        dateFormat="dd.MM.yyyy"
                        showPopperArrow={false}
                        placeholderText="Выберите диапазон"
                        className="bg-white w-full text-center shadow-[0px_1px_3px_rgba(0,0,0,0.40)] p-2 rounded my-6 mx-12.5 font-inter font-medium text-[16px] text-[#728197] leading-5"
                    />
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        height={350}
                        className="bg-white rounded-b-lg"
                    />
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};

const StatsCard = ({ label, value, diff }: { label: string; value?: number; diff?: number }) => {
    const isPositive = (diff ?? 0) >= 0;
    return (
        <div className="w-full py-3.5 border font-inter  border-[#2EAA7B] rounded-xl text-center">
            <Paragraph className="font-bold text-[15px] uppercase mb-1.5">{label}</Paragraph>
            <Paragraph className="text-xl font-bold">{value ?? 0}</Paragraph>
            <Paragraph className={`font-inter text-[15px] leading-[100%] ${isPositive ? "text-[#2EAA7B]" : "text-red-500"}`}>
                {isPositive ? "↑" : "↓"} {Math.abs(diff ?? 0)} за неделю
            </Paragraph>
        </div>
    );
};
