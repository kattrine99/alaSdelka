import { Button, Heading, Paragraph } from "../../../components";
import { useNavigate, useParams } from "react-router-dom";

export const ModerationStep = () => {
    const navigate = useNavigate();
    const { lng } = useParams<{ lng: string }>();
    return (
        <div className="flex flex-col items-center gap-6 text-center pt-16">
            <Heading level={2} className="text-[24px] font-bold text-[#4f4f4f] " text="Ожидайте публикацию после проверки модераторами" />
            <Paragraph className="text-[#667085] max-w-[600px]">
                Информация о публикации придет Вам на странице “Уведомления”
            </Paragraph>

            <Button
                onClick={() =>
                    navigate(`/${lng}/announcements`, { state: { newOffer: true } })
                }
                className="bg-[#2EAA62] text-white px-6 py-3 rounded-md"
            >
                Спасибо!
            </Button>
        </div>
    );
};
