import { RxCross1 } from "react-icons/rx";
import { Heading } from "../Typography/Heading/Heading";
import { Paragraph } from "../Typography/Paragraph/Paragraph";

interface ModalBaseProps {
    title?: string;
    message: string;
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
        <div className="fixed w-screen h-screen z-50 flex items-center justify-center bg-[#3B3B3B80] bg-opacity-50">
            <div className="flex">
                <div className="bg-white flex flex-col p-6 rounded-[24px] max-w-[460px] w-[457px] shadow-lg">
                    <Heading className="text-[32px] mb-4 font-semibold font-inter text-[#101828] leading-6" level={2} text={title} />
                    <Paragraph className="text-[#667085] text-[16px] leading-5 space-[30px] tracking-[0.5%] mb-6">{message}</Paragraph>
                    {actions && <div className="">{actions}</div>}
                </div>
                <div className="ml-6 ">
                    {showCloseButton && onClose && (
                        <button
                            className="w-12 h-12 bg-[#10111166] rounded-full flex items-center justify-center text-white hover:text-black shadow-md"
                            onClick={onClose}
                        >
                            <RxCross1 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
};
