import SolidHeartIcon from '../../assets/Solidheart.svg?react';
import HeartIcon from '../../assets/heart.svg?react';
import { Button } from '../Button/Button';

interface Props {
    isFavorite: boolean;
    onToggle: () => void;
}

export const FavoriteButton: React.FC<Props> = ({ isFavorite, onToggle }) => {
    return (
        <Button
            onClick={onToggle}
            className="absolute top-5 right-4.5 transition-transform duration-200 ease-in-out hover:scale-105"
        >
            {isFavorite ? (
                <SolidHeartIcon className="w-8 h-7 border py-0.5 border-[#2EAA7B] text-[#FF1D1D] bg-white rounded-full" />
            ) : (
                <HeartIcon className={`w-8 h-7 border py-0.5 border-[#2EAA7B] text-[#2EAA7B] bg-white rounded-full ${isFavorite ? "animate-fade" : ""}`} />
            )}
        </Button>
    );
};
