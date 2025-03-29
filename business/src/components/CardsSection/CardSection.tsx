import { Button, Cards } from "../index";
import { ICard } from "../Cards/Cards";
import { Heading, Paragraph } from "../index";
import { useNavigate } from "react-router-dom";
import { titleToTypeMap } from "../../utils/categoryMap";

interface CardSectionProps {
  title: string;
  description?: string;
  cards: ICard[];
  maxVisible?: number;
  to: string;
  hideViewAllButton?: boolean;
  Class: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  description,
  cards,
  maxVisible,
  to,
  hideViewAllButton = false,
  Class,
}) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(to);
  };

  const typeFilter = titleToTypeMap[title] || "";
  const filteredCards = cards.filter((card) => card.type === typeFilter);

  return (
    <div className="px-[192px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={2} text={title} className="text-[30px] font-bold mb-1 text-black" />
          <Paragraph className="text-[16px] text-gray-500">{description}</Paragraph>
        </div>
        {!hideViewAllButton && <Button
          onClick={handleViewAll}
          className="bg-black text-white text-sm px-[20px] py-[14px] rounded hover:bg-gray-800 transition"
        >
          Посмотреть все
        </Button>
        }
      </div>
      <Cards
        cards={filteredCards.slice(0, maxVisible)}
        containerClass={Class}
        cardIconClass="rounded-t-xl overflow-hidden"
        cardWrapperClass="rounded-xl"
      />
    </div>
  );
};
