import { Heading, Paragraph } from "../index";

interface ICard {
    icon: string;
    heading: string;
    text: string;

    // кастомные классы
    wrapperClass?: string;
    iconClass?: string;
    headingClass?: string;
    textClass?: string;
}

interface ICards {
    cards: ICard[];
    containerClass?: string;
}

export const Cards: React.FC<ICards> = ({ cards, containerClass = "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }) => {
    return (
        <div className={containerClass}>
            {cards.map((card, index) => (
                <div key={index} className={`p-6 rounded-lg shadow-md bg-white ${card.wrapperClass ?? ""}`}>
                    <div className={`mb-4 ${card.iconClass ?? ""}`}>
                        <img src={card.icon} alt={`icon-${index}`} className="w-10 h-10" />
                    </div>
                    <Heading
                        text={card.heading}
                        level={3}
                        className={`text-lg font-semibold mb-2 ${card.headingClass ?? ""}`}
                    />
                    <Paragraph className={`text-gray-600 ${card.textClass ?? ""}`}>{card.text}</Paragraph>
                </div>
            ))}
        </div>
    );
};

