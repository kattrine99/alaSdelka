import { Cards } from "../index";
import { ICard } from "../Cards/Interfaces";

interface CardSectionProps {
  title?: string;
  cards: ICard[];
  maxVisible?: number;
  hideViewAllButton?: boolean;
  Class: string;
  ClassName: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  cards,
  maxVisible,
  Class,
  ClassName,
}) => {


  const filteredCards = cards;

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
