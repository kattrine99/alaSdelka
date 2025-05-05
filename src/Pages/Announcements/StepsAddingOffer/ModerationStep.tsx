import { Button, Heading, Paragraph } from "../../../components";
import { Link } from "react-router-dom";

export const ModerationStep = () => {
    return (
        <div className="flex flex-col items-center gap-6 text-center pt-16">
            <Heading level={2} className="text-[24px] font-bold text-[#101828]" text="Объявление отправлено на модерацию" />
            <Paragraph className="text-[#667085] max-w-[600px]">
                Мы проверим ваше объявление в течение ближайших часов. Вы получите уведомление, когда оно будет опубликовано.
            </Paragraph>

            <Link to="/profile">
                <Button className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md">
                    Перейти в профиль
                </Button>
            </Link>
        </div>
    );
};
