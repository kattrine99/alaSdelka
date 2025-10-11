import { Applink, Button } from "../index";

interface NavLinksProps {
    links: { label: string; to: string }[];
    className?: string;
    linkClassName?: string;
    onClick?: (label: string) => void;
    activeLabel?: string;
    variant?: "header" | "tabs";
    activeClassName?: string;
    inactiveClassName?: string;
    underlineColor?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({
    links,
    className = "",
    linkClassName = "",
    onClick,
    activeLabel,
    variant = "header",
    activeClassName = "text-[#2EAA62]",
    inactiveClassName = "text-[#787878] hover:text-[#2EAA62]",
    underlineColor = "bg-[#2EAA62]",
}) => {
    return (
        <nav className={className}>
            {links.map((link, idx) => {
                const isActive = link.label === activeLabel;

                if (variant === "tabs") {
                    const baseClasses = `relative`;
                    const activeClasses = isActive
                        ? `${activeClassName} after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:${underlineColor}`
                        : inactiveClassName;

                    return (
                        <Button
                            key={idx}
                            onClick={() => onClick?.(link.label)}
                            className={`${baseClasses} ${activeClasses} ${linkClassName}`}
                        >
                            {link.label}
                        </Button>
                    );
                }

                return (
                    <Applink
                        key={idx}
                        to={link.to}
                        className={`text-[#4f4f4f]  hover:text-[#2EAA62] transition-all ${linkClassName}`}
                    >
                        {link.label}
                    </Applink>
                );
            })}
        </nav>
    );
};
