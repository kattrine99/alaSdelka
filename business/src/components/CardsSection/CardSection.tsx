import { Button, Cards } from "../index";
import { ICard } from "../Cards/Cards";
import { titleToTypeMap } from "../../utils/categoryMap";

interface CardSectionProps {
  title: string;
  cards: ICard[];
  maxVisible?: number;
  hideViewAllButton?: boolean;
  Class: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  cards,
  maxVisible,
  hideViewAllButton = false,
  Class,
}) => {


  const typeFilter = titleToTypeMap[title] || "";
  const filteredCards = cards.filter((card) => card.type === typeFilter);

  return (
    <div className="px-[192px]">
      <div className="flex items-start justify-between mb-6">
        {!hideViewAllButton && <Button
          className="text-sm px-[20px] rounded"
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
