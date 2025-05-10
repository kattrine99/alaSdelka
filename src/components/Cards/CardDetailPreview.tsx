import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { useNavigate } from "react-router-dom";
import { Heading, Paragraph } from "../index";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
export const CardDetailPreview = () => {
    const navigate = useNavigate();
    const data = useSelector((state: RootState) => state.tempOffer.offerData);

    if (!data) return <Paragraph>Нет данных для предпросмотра</Paragraph>;

    const imagePreview = data.images?.[0] ? URL.createObjectURL(data.images[0]) : null;

    return (
        <div className="px-[192px] py-10">
            <div className="mb-6 flex items-center gap-2 cursor-pointer text-[#28B13D]" onClick={() => navigate(-1)}>
                <HiOutlineArrowNarrowLeft className="w-5 h-5" />
                <span className="font-medium text-[15px]">Предварительный просмотр вашего объявления</span>
            </div>

            {/* Основной блок */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <Heading level={2} text={data.title || "Название"} className="text-[24px] mb-3" />
                <Paragraph className="text-[#667085] text-sm mb-2">ID {data.id ?? "—"}</Paragraph>
                <Paragraph className="text-[#667085] text-sm mb-6">
                    {data.city_name}, {data.address}
                </Paragraph>

                {/* Изображение */}
                <div className="border rounded-lg p-4 bg-gray-100 flex justify-center items-center mb-6">
                    {imagePreview &&
                        <img src={imagePreview} alt="preview" className="max-h-[300px] object-contain" />
                    }
                </div>

                {/* Удобства */}
                <div className="mb-6">
                    <Heading level={3} text="Удобства" className="text-[18px] mb-2" />
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[#232323]">
                        <li>Парковка: {data.parking ? "Есть" : "Нет"}</li>
                        <li>Клиенты: {data.clients ? "Есть" : "Нет"}</li>
                        <li>Поставщики: {data.suppliers ? "Есть" : "Нет"}</li>
                        <li>Оборудование: {data.equipment ? "Есть" : "Нет"}</li>
                        <li>Импорт: {data.imported_supplies ? "Есть" : "Нет"}</li>
                        <li>Экспорт: {data.export_contracts ? "Есть" : "Нет"}</li>
                        <li>Филиалы: {data.has_branches ? "Есть" : "Нет"}</li>
                        <li>Кредиты: {data.no_credit ? "Нет" : "Есть"}</li>
                    </ul>
                </div>

                {/* Описание */}
                <div className="mb-6">
                    <Heading level={3} text="Описание" className="text-[18px] mb-2" />
                    <Paragraph>{data.description}</Paragraph>
                </div>

                {/* Финансы */}
                <div className="mb-6">
                    <Heading level={3} text="Информация и финансы" className="text-[18px] mb-2" />
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <li>Цена: <strong>{data.amount?.toLocaleString()} сум</strong></li>
                        <li>Доход: <strong>{data.monthly_income} сум</strong></li>
                        <li>Прибыль: <strong>{data.profit} сум</strong></li>
                        <li>Окупаемость: <strong>{data.payback_period} месяцев</strong></li>
                        <li>Доля бизнеса: <strong>{data.business_share}%</strong></li>
                    </ul>
                </div>

                {/* Локация */}
                <div>
                    <Heading level={3} text="Местоположение" className="text-[18px] mb-2" />
                    <Paragraph className="flex items-center text-[#667085] text-[14px]">
                        <FaLocationDot className="text-[#2EAA7B] mr-2" />
                        {data.city_name}, {data.address}
                    </Paragraph>
                </div>
            </div>
        </div>
    );
};
