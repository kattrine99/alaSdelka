import {useMemo, useState} from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    wrapperClassName?: string;
    selectClassName?: string;
};

export default function Select({
                                         value,
                                         onChange,
                                         options,
                                         placeholder = "Выберите значение",
                                         searchable = false,
                                   wrapperClassName = 'relative mt-2 mb-4',
    selectClassName = 'bg-[#F2F2F2] w-full h-[42.4px] rounded-[8px] pl-4 pr-8 text-left text-[#4f4f4f] ',
                                     }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const selected = options.find((opt) => opt.value === value);

    const filteredOptions = useMemo(() => {
        if (!searchable || !query.trim()) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, options, searchable]);

    const onInternalChange = (value: string) => {
        setOpen(false);
        setQuery("");
        onChange(value);
    }

    return (
        <div
            className={wrapperClassName}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                className={selectClassName + 'w-full flex items-center justify-between'}
            >
                {selected ? selected.label : placeholder}
                <MdOutlineArrowDropDown className="text-xl text-[#191919]" />
            </button>

            {open && (
                <div className="absolute z-10 w-full bg-white text-[#4f4f4f] rounded-md shadow-md max-h-60 overflow-y-auto">
                    {searchable && (
                        <div className="sticky top-0 bg-white p-2 border-b border-b-[#F2F2F2]">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Поиск..."
                                className="w-full rounded px-2 py-1 text-sm focus:outline-none"
                            />
                        </div>
                    )}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={"px-4 py-2 hover:bg-gray-100 cursor-pointer" + (opt.disabled ? "bg-gray-100" : "")}
                                    onClick={() => {
                                        if (!opt.disabled) {
                                            onInternalChange(opt.value)
                                        }
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">
                            Нет результатов
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
