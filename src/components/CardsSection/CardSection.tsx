import { Cards } from "../index";
import { ICard } from "../Cards/Interfaces";

interface CardSectionProps {
  title?: string;
  cards: ICard[];
  maxVisible?: number;
  hideViewAllButton?: boolean;
  Class: string;
  ClassName: string;
  initialFavorites?: number[];
  onFavoritesChanged?: (id: number, status: "added" | "removed") => void;
}

export const CardSection: React.FC<CardSectionProps> = ({
  cards,
  maxVisible,
  Class,
  ClassName,
  initialFavorites,
  onFavoritesChanged,
}) => {
  const filteredCards = [...cards].sort((a, b) => {
    const aIsPaid = a.offer_status === "is_payed" ? 1 : 0;
    const bIsPaid = b.offer_status === "is_payed" ? 1 : 0;
    return bIsPaid - aIsPaid;
  });

  return (
    <div className={ClassName}>
      <Cards
        cards={filteredCards.slice(0, maxVisible)}
        containerClass={Class}
        cardIconClass="rounded-t-xl overflow-hidden"
        cardWrapperClass="rounded-xl w-auto flex-col shadow-lg"
        WhatchButtonClass="py-3 px-5 w-full bg-[#2EAA7B] text-white font-medium rounded-md flex justify-center hover:bg-[#31B683] transition duration-300 cursor-pointer"
        initialFavorites={initialFavorites}
        onFavoritesChanged={onFavoritesChanged}
      />
    </div>
  );
};

