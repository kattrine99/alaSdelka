import { HomeCards } from "../index";
import { ICard } from "../Cards/Interfaces";

interface CardSectionProps {
  title?: string;
  cards: ICard[];
  maxVisible?: number;
  hideViewAllButton?: boolean;
  Class: string;
  ClassName: string;
  initialFavorites?: number[];
  allViewLink: string;
  onFavoritesChanged?: (id: number, status: "added" | "removed") => void;
}

export const HomeCardSection: React.FC<CardSectionProps> = ({
  cards,
  maxVisible,
  Class,
  ClassName,
  initialFavorites,
  allViewLink,
  onFavoritesChanged,
}) => {
  const filteredCards = [...cards].sort((a, b) => {
    const aIsPaid = a.offer_status === "is_payed" ? 1 : 0;
    const bIsPaid = b.offer_status === "is_payed" ? 1 : 0;
    return bIsPaid - aIsPaid;
  });

  return (
    <div className={ClassName + ' flex'}>
      <HomeCards
        cards={filteredCards.slice(0, maxVisible)}
        containerClass={Class}
        allViewLink={allViewLink}
        cardIconClass="rounded-t-xl max-h-48 max-lg:h-full bg-center overflow-hidden"
        cardWrapperClass="rounded-xl w-auto flex-col shadow-lg"
        WhatchButtonClass="py-3 px-5 w-full bg-[#2EAA62] text-white font-medium rounded-md flex justify-center hover:bg-[#2EAA62] transition duration-300 cursor-pointer"
        initialFavorites={initialFavorites}
        onFavoritesChanged={onFavoritesChanged}
      />
    </div>
  );
};

