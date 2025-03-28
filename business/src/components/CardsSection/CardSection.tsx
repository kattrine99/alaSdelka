import { Button, Cards } from "../index";
import { ICard } from "../Cards/Cards";
import { Heading, Paragraph } from "../index";
import { useNavigate } from "react-router-dom";

interface CardSectionProps {
  title: string;
  description?: string;
  cards: ICard[];
  maxVisible?: number;
  to: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  description,
  cards,
  maxVisible,
  to,
}) => {
  const navigate = useNavigate();
  const handleViewAll = () => {
    navigate(to)
  };

  return (
    <div className="px-[192px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={2} text={title} className="text-[30px] font-bold mb-1 text-black" />
          <Paragraph className="text-[16px] text-gray-500">{description}</Paragraph>
        </div>
        <Button
          onClick={handleViewAll}
          className="bg-black text-white text-sm px-[20px] py-[14px] rounded hover:bg-gray-800 transition"
        >
          Посмотреть все
        </Button>
      </div>
      <Cards cards={cards.slice(0, maxVisible)} cardIconClass="rounded-xl" cardWrapperClass="
   rounded-xl overflow-hidden " />
    </div>
  );
};
