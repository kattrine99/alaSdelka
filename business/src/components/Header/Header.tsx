import './Header.css'

export const Header = () => {
    return (
        <div className="w-full fixed top-0 left-0 z-50 h-[96px] flex flex-row justify-between shadow-lg bg-white px-6">
            {/* Логотип */}
            <div className="logo flex items-center p-4">
                <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                <p className="ml-2 font-bold">Logo</p>
                <p className="ml-2 font-normal hidden md:block">Logo</p>
            </div>

            {/* Контакты (скрываются при ширине <= 950px) */}
            <div className="hidden md:flex flex-row gap-10 items-center">
                <div className="flex flex-col">
                    <p className="number text-lg font-semibold">+998 71 789 78 78</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg font-semibold">info@name-com.uz</p>
                </div>
                <div className="flex flex-row space-x-4">
                    <a href="#" className="text-blue-600 hover:underline">Telegram</a>
                    <a href="#" className="text-green-600 hover:underline">Whatsapp</a>
                </div>
            </div>

            {/* Выпадающий список (всегда видно) */}
            <div className="flex items-center">
                <select className="border rounded px-2 py-1">
                    <option value="RU">Русский</option>
                    <option value="ENG">Английский</option>
                    <option value="UZ">Узбекский</option>
                </select>
            </div>
        </div>

    )
}