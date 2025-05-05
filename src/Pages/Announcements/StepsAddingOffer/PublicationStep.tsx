import { Button, Paragraph, CardPreview } from "../../../components";
import { FiCheck } from "react-icons/fi";
import { ICard } from "../../../components/Cards/Interfaces";
import { useEffect, useState } from "react";

interface Props {
    onPublish: () => void;
}

export const PublicationStep: React.FC<Props> = ({ onPublish }) => {
    const [cardData, setCardData] = useState<ICard | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("temporary_offer");
        if (saved) {
            try {
                setCardData(JSON.parse(saved));
            } catch (e) {
                console.error("Ошибка при парсинге сохранённого объявления", e);
            }
        }
    }, []);

    return (

        <div className="flex flex-col items-center gap-6 text-center">
            <Paragraph className="text-[20px] font-semibold">Подтвердите и публикуйте</Paragraph>
            <Paragraph className="text-[#667085] max-w-[600px]">
                Вы почти у цели! Проверьте, как будет выглядеть ваше готовое объявление после окончательного оформления.
                Обратите внимание, что мы можем отредактировать ваш постинг, чтобы помочь вам продать.
            </Paragraph>
            <div className="w-full max-w-[600px] border rounded-lg p-4 shadow-sm bg-white">
                {cardData && <CardPreview card={cardData} />}
                <Paragraph className="text-lg font-bold">1 780 000 000 сум</Paragraph>
                <Paragraph>Адрес: улица Пушкина, 2</Paragraph>
            </div>

            <Button
                onClick={onPublish}
                className="bg-[#2EAA7B] text-white px-6 py-3 rounded-md flex items-center gap-2"
            >
                <FiCheck /> Опубликовать
            </Button>
        </div>
    );
};
