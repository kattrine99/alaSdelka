import { Applink } from "../index";

interface NavLinksProps {
    links: { label: string; to: string }[];
    className?: string;
    linkClassName?: string;
    onClick?: (label: string) => void;
    activeLabel?: string;
    variant?: "header" | "tabs";
}

export const NavLinks: React.FC<NavLinksProps> = ({
    links,
    className = "",
    linkClassName = "",
    onClick,
    activeLabel,
    variant = "header", // по умолчанию — обычная навигация
}) => {
    return (
        <nav className={`flex flex-wrap gap-x-8.5 font-medium ${className}`}>
            {links.map((link, idx) => {
                const isActive = link.label === activeLabel;

                // Tabs-режим: кнопки с нижней линией
                if (variant === "tabs") {
                    return (
                        <button
                            key={idx}
                            onClick={() => onClick?.(link.label)}
                            className={`relative pb-2 text-[18px] font-semibold transition-all
                ${isActive ? "text-[#28B13D]" : "text-[#787878] hover:text-[#28B13D]"}
                ${isActive ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#28B13D]" : ""}
                ${linkClassName}
              `}
                        >
                            {link.label}
                        </button>
                    );
                }

                // Header-режим: обычные ссылки
                return (
                    <Applink
                        key={idx}
                        to={link.to}
                        className={`text-[#232323] hover:text-[#28B13D] transition-all ${linkClassName}`}
                    >
                        {link.label}
                    </Applink>
                );
            })}
        </nav>
    );
};
