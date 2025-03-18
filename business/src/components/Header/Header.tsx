import './Header.css'

export const Header = () => {
    return (
        <div className="w-full fixed top-0 left-0 z-50 h-[96px] flex flex-row justify-between shadow-lg">
            <div className="logo flex  items-center p-4">
                <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                <p className="ml-2 font-bold">Logo</p>
                <p className="ml-2 font-normal">Logo</p>
            </div>
            <div className="flex flex-row gap-10 items-center px-8 pb-4">
                <div className="flex flex-col">
                    <span></span>
                    <p className="number text-lg font-semibold">+998 71 789 78 78</p>
                </div>
                <div className="flex flex-col">
                    <span></span>
                    <p className="text-lg font-semibold">info@name-com.uz</p>
                </div>
                <div className="flex flex-row space-x-4">
                    <a href="#" className="text-blue-600 hover:underline">Telegram</a>
                    <a href="#" className="text-green-600 hover:underline">Whatsapp</a>
                    <select className="border rounded px-2 py-1">
                        <option value="RU">Русский</option>
                        <option value="ENG">Английский</option>
                        <option value="UZ">Узбекский</option>
                    </select>
                </div>
            </div>
        </div>

    )
}