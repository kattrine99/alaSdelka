import { Button, Heading, Paragraph } from "../../../components";
import { Link } from "react-router-dom";

export const ModerationStep = () => {
    return (
        <div className="flex flex-col items-center gap-6 text-center pt-16">
            <Heading level={2} className="text-[24px] font-bold text-[#101828]" text="Ожидайте публикацию после проверки модераторами" />
            <Paragraph className="text-[#667085] max-w-[600px]">
                Информация о публикации придет Вам на странице “Уведомления”
            </Paragraph>

            <Link to="/announcements">
                <Button className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md">
                    Спасибо!
                </Button>
            </Link>
        </div>
    );
};
