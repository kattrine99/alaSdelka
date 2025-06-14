import { useTranslation } from "../../../public/Locales/context/TranslationContext";
import { Paragraph } from "../Typography/Paragraph/Paragraph";
import {
    forwardRef,
    InputHTMLAttributes,
    TextareaHTMLAttributes,
    useEffect,
    useState,
} from "react";

interface BaseProps {
    isTextArea?: boolean;
    errorMessage?: string;
    isError: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    LabelClassName?: string;
    LabelText?: string;
}


type InputProps = BaseProps &
    Omit<
        InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
        "onChange" | "value" | "type"
    >;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ type, placeholder, isError, errorMessage, value, onChange, isTextArea = false, LabelClassName, LabelText, ...props }, ref) => {
        const [inputStatus, setInputStatus] = useState<"default" | "error" | "success">("default");
        const { t } = useTranslation()
        useEffect(() => {
            if (isError) {
                console.log("isError: ", isError)
                setInputStatus("error");
            } else if (!isError && value) {
                setInputStatus("success");
                const timer = setTimeout(() => setInputStatus("default"), 500);
                return () => clearTimeout(timer);
            }
        }, [isError, value]);

        const borderColor =
            inputStatus === "error"
                ? "border border-red-500 focus:ring-red-500"
                : inputStatus === "success" && "border border-[#2EAA7B] focus:ring-[#2EAA7B]"
        if (isTextArea) {
            return (
                <div className="w-full relative flex flex-col gap-2.5">
                    <label className={LabelClassName}>{LabelText}</label>
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        maxLength={3000}
                        className={`bg-[#F0F1F2]/50 resize-none rounded-[14px] outline-none py-[14px] px-[18px] text-[#101828] font-inter text-sm placeholder:text-[#8A8A8A] w-full h-[150px] ${borderColor}`}
                        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                    {isError && (
                        <Paragraph className="text-sm text-red-500 mt-1">{errorMessage}</Paragraph>
                    )}
                </div>
            );
        }
        return (
            <div className="flex-1 flex-col">
                <label className={LabelClassName}>{LabelText}</label>
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`py-3.5 px-4.5 bg-[#EEEEEE80] rounded-[14px] outline-none ${borderColor} ${props.className ?? ""}`}
                    {...(props as InputHTMLAttributes<HTMLInputElement>)}
                />
                <div
                    className={` ${isError ? "transition-all duration-300 ease-in-out opacity-100 scale-100 mt-1" : "opacity-0 scale-95 h-0 mt-0"
                        } overflow-hidden text-left`}
                >
                    {isError && (
                        <Paragraph className="text-sm text-red-500">{errorMessage}</Paragraph>
                    )}
                </div>
            </div >
        );
    }
);
