import { RxCross1 } from "react-icons/rx";
import { Heading } from "../Typography/Heading/Heading";
import { Paragraph } from "../Typography/Paragraph/Paragraph";
import { ReactNode } from "react";

interface ModalBaseProps {
    title?: string;
    message: ReactNode;
    onClose?: () => void;
    actions?: React.ReactNode;
    showCloseButton?: boolean;
    HeadingClassName: string;
    ModalClassName?: string;
}

export const ModalBase: React.FC<ModalBaseProps> = ({
    title = " ",
    message,
    onClose,
    actions,
    showCloseButton = true,
    HeadingClassName,
    ModalClassName,
}) => {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center  bg-[#3B3B3B80]"
            onClick={onClose}
        >
            <div
                className={`relative bg-white flex no-scrollbar flex-col p-6 rounded-[24px] shadow-lg max-w-[90vw] w-[400px] ${ModalClassName}`}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && onClose && (
                    <button
                        className="absolute top-4 right-4 w-10 h-10 bg-white border border-[#2EAA7B] rounded-full flex items-center justify-center text-[#2EAA7B] hover:bg-[#2EAA7B] hover:text-white shadow-md"
                        onClick={onClose}
                    >
                        <RxCross1 className="w-4 h-4" />
                    </button>
                )}
                <Heading className={`${HeadingClassName} mb-4`} level={2} text={title} />
                <Paragraph className="text-[#667085] text-[16px] leading-5 overflow-y-scroll no-scrollbar space-[30px] tracking-[0.5%] mb-6">{message}</Paragraph>
                {actions && <div>{actions}</div>}
            </div>
        </div>
    );
};
