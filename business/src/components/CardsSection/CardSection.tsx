import { Cards } from "../index";
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
  maxVisible = 8,
  to,
}) => {
  const navigate = useNavigate();
  const handleViewAll = () => {
    navigate(to)
  };

  return (
    <div className="px-[clamp(20px,5vw,192px)]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={2} text={title} className="text-[30px] font-bold mb-1 text-black" />
          <Paragraph className="text-[16px] text-gray-500">{description}</Paragraph>
        </div>
        <button
          onClick={handleViewAll}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Посмотреть все
        </button>
      </div>
      <Cards cards={cards.slice(0, maxVisible)} cardIconClass="rounded-xl" cardWrapperClass="grid 
    gap-x-6 
    gap-y-10 
    sm:[grid-template-columns:repeat(auto-fit,minmax(360px,1fr))] rounded-xl overflow-hidden " />
    </div>
  );
};
