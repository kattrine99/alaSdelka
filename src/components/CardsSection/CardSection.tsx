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
        cardWrapperClass={`rounded-xl w-[22rem] flex-col shadow-lg`}
        WhatchButtonClass='py-3 px-5 w-79.5 bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer'

      />
    </div>
  );
};
