import { Button } from "../../../components";

interface Props {
    category: "Бизнес" | "Франшиза" | "Стартап" | "Инвестиции";
}

export const InformationStep: React.FC<Props> = ({ category }) => {
    // const isFranchise = category === "Франшиза";
    const isStartup = category === "Стартап";
    // const isBusiness = category === "Бизнес";
    // const isInvestments = category === "Инвестиции";

    return (
        <div className="flex flex-col gap-6">

            {/* === Общие поля === */}
            <div>
                <label>Название бизнеса</label>
                <input className="input" type="text" />
            </div>

            <div>
                <label>Описание</label>
                <textarea className="textarea" maxLength={category === "Бизнес" ? 3000 : 2000} />
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <label>Имя</label>
                    <input className="input" type="text" />
                </div>
                <div className="flex-1">
                    <label>Фамилия</label>
                    <input className="input" type="text" />
                </div>
            </div>

            <div>
                <label>Номер телефона</label>
                <input className="input" placeholder="+998 ..." />
            </div>

            {/* === Уникальные поля === */}
            {isStartup && (
                <div>
                    <label>Стадия</label>
                    <select className="select">
                        <option>Выбрать</option>
                        <option>Идея</option>
                        <option>Прототип</option>
                        <option>Готовый продукт</option>
                    </select>
                </div>
            )}

            {/* Остальные — общие */}
            <div>
                <label>Город</label>
                <select className="select">
                    <option>Выбрать</option>
                </select>
            </div>

            <div>
                <label>Адрес</label>
                <input className="input" />
            </div>

            <div>
                <label>Форма владения помещением</label>
                <select className="select">
                    <option>Выбрать</option>
                </select>
            </div>

            {/* === Загрузка документов/изображений === */}
            <div>
                <label>Документы</label>
                <button className="upload-box">Загрузить документ</button>
            </div>

            <div>
                <label>Сумма</label>
                <input className="input" />
            </div>

            <div>
                <label>Изображение</label>
                <button className="upload-box">Загрузить изображение</button>
            </div>

            {/* === Поле ссылок на соцсети === */}
            <div>
                <label>Ссылки на коммуникации</label>
                <input className="input" placeholder="https://..." />
                <button className="text-green-600 underline mt-2">+ Добавить еще</button>
            </div>

            {/* === Финансовые поля === */}
            <div>
                <label>Доход</label>
                <input className="input" />
            </div>

            <div>
                <label>Средний расход</label>
                <input className="input" />
            </div>

            <div>
                <label>Сумма прибыли</label>
                <input className="input" />
            </div>

            <div>
                <label>Окупаемость (в мес.)</label>
                <input className="input" />
            </div>

            {/* === Детали объявления (переключатели) === */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    Прописка
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    База клиентов
                </label>
                {/* … */}
            </div>

            <Button className="mt-6 bg-[#2EAA7B] text-white px-6 py-2 rounded">Дальше</Button>
        </div>
    );
};
