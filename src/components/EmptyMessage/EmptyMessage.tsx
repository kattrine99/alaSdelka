import { useNavigate } from "react-router-dom";
import { Button, Paragraph } from "../index";
import { useTranslation } from "../../../public/Locales/context/TranslationContext";

interface EmptyMessageProps {
    image?: string;
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    hideButton?: boolean;
    centerImageSize?: string;
}

export const EmptyMessage: React.FC<EmptyMessageProps> = ({
    image = "/images/empty.png",
    title,
    subtitle,
    buttonText = "Добавить объявление",
    buttonLink = " ",
    hideButton = false,
    centerImageSize = "w-[96px] h-[96px]",
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation()
    return (
        <div className="w-full h-[500px] flex flex-col justify-center items-center gap-4 mt-10 text-center">
            <img
                src={image}
                alt="empty"
                className={`${centerImageSize} object-contain`}
            />
            <Paragraph className="font-inter text-lg font-semibold text-[#232323]">
                {t(title)}
            </Paragraph>
            {subtitle && (
                <Paragraph className="text-[#667085] text-sm">{t(subtitle)}</Paragraph>
            )}
            {!hideButton && (
                <Button
                    className="bg-[#2EAA7B] text-white rounded-md px-6 py-2 mt-3"
                    onClick={() => navigate(buttonLink)}
                >
                    {t(buttonText)}
                </Button>
            )}
        </div>
    );
};
