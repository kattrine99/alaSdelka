import './Header.css'
import { Paragraph } from '../index'

export const Header = () => {
    return (
        <div className="w-full fixed top-0 left-0 z-50 h-[96px] flex flex-row justify-between shadow-lg bg-white px-6">
            <div className="logo flex items-center p-4">
                <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                <Paragraph className='ml-2 font-bold' >Logo</Paragraph>
                <Paragraph className='ml-2 font-normal hidden md:block'>Logo</Paragraph>
            </div>

            <div className="hidden md:flex flex-row gap-10 items-center">
                <div className="flex flex-col">
                    <Paragraph className='number text-lg font-semibold' >+998 71 789 78 78</Paragraph>
                </div>
                <div className="flex flex-col">
                    <Paragraph className='text-lg font-semibold' >info@name-com.uz</Paragraph>
                </div>
                <select className="border rounded px-2 py-1">
                    <option value="RU">RU</option>
                    <option value="ENG">ENG</option>
                    <option value="UZ">UZ</option>
                </select>
            </div>
        </div>

    )
}