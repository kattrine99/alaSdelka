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
}

export const ModalBase: React.FC<ModalBaseProps> = ({
    title = " ",
    message,
    onClose,
    actions,
    showCloseButton = true
}) => {
    return (
        <div
            className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-[#3B3B3B80] bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white flex flex-col p-6 rounded-[24px] max-w-[460px] w-[457px] shadow-lg"
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
                <Heading className="text-[32px] mb-4 font-semibold font-inter text-[#101828] leading-6" level={2} text={title} />
                <Paragraph className="text-[#667085] text-[16px] leading-5 space-[30px] tracking-[0.5%] mb-6">{message}</Paragraph>
                {actions && <div>{actions}</div>}
            </div>
        </div>
    );

};
