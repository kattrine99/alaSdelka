interface ModalSuccessProps {
    message: string;
}

export const ModalSuccess: React.FC<ModalSuccessProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#3B3B3B80] bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-[34px] text-center max-w-[460px] w-full">
                <h2 className="text-[32px] font-semibold text-[#101828] mb-4 leading-11">Успешно!</h2>
                <p className="text-[#667085] text-base leading-5">{message}</p>
            </div>
        </div>
    );
};
