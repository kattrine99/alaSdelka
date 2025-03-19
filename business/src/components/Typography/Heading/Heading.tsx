import { JSX } from "react";

interface HeadingProps {
    children?: React.ReactNode;
    text: string;
    level: number;
    className?: string;
}

export const Heading = ({ text, level, className }: HeadingProps) => {
    let Tag: keyof JSX.IntrinsicElements;

    switch (level) {
        case 1:
            Tag = "h1";
            break;
        case 2:
            Tag = "h2";
            break;
        case 3:
            Tag = "h3";
            break;
        case 4:
            Tag = "h4";
            break;
        case 5:
            Tag = "h5";
            break;
        case 6:
            Tag = "h6";
            break;
        default:
            Tag = "h6"; // Если уровень вне диапазона 1-6, используем h6 как запасной вариант
    }

    return <Tag className={className}>{text}</Tag>;
};
