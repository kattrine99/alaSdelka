import { Paragraph } from "../Typography/Paragraph/Paragraph";
import { useEffect, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string;
    isError: boolean;
    value?: string; // ← добавлено
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ← добавлено
}

export const Input = ({
    type,
    placeholder,
    isError,
    errorMessage,
    value,
    onChange,
    ...props
}: InputProps) => {
    const [inputStatus, setInputStatus] = useState<"default" | "error" | "success">("default");

    useEffect(() => {
        if (isError) {
            setInputStatus("error");
        } else if (!isError && value) {
            setInputStatus("success");
            const timer = setTimeout(() => setInputStatus("default"), 500);
            return () => clearTimeout(timer);
        }
    }, [isError, value]);

    const borderColor =
        inputStatus === "error"
            ? "border-red-500 focus:ring-red-500"
            : inputStatus === "success"
                ? "border-green-500 focus:ring-green-500"
                : "border-gray-300 focus:ring-blue-500";

    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${borderColor}`}
                {...props}
            />

            <div
                className={`transition-all duration-300 ease-in-out ${isError ? "opacity-100 scale-100 mt-1" : "opacity-0 scale-95 h-0 mt-0"
                    } overflow-hidden text-left`}
            >
                {isError && (
                    <Paragraph className="text-sm text-red-500">
                        {errorMessage}
                    </Paragraph>
                )}
            </div>
        </div>
    );
};
