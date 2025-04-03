import { Cards } from "../index";
import { ICard } from "../Cards/Cards";
import { titleToTypeMap } from "../../utils/categoryMap";

interface CardSectionProps {
  title: string;
  cards: ICard[];
  maxVisible?: number;
  hideViewAllButton?: boolean;
  Class: string;
  ClassName: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  cards,
  maxVisible,
  Class,
  ClassName,
}) => {



  const typeFilter = titleToTypeMap[title] || "";
  const filteredCards = cards.filter((card) => card.type === typeFilter);

  return (
    <div className={ClassName}>
      <Cards
        cards={filteredCards.slice(0, maxVisible)}
        containerClass={Class}
        cardIconClass="rounded-t-xl overflow-hidden"
        cardWrapperClass="rounded-xl"
      />
    </div>
  );
};
