import { Applink } from "../index";

interface NavLinksProps {
    links: { label: string; to: string }[];
    className?: string;
    linkClassName?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({ links, className = "", linkClassName = "" }) => {
    return (
        <nav className={`flex flex-wrap gap-4 ${className}`}>
            {links.map((link, idx) => (
                <Applink key={idx} to={link.to} className={`text-gray-700 ${linkClassName}`}>
                    {link.label}
                </Applink>
            ))}
        </nav>
    );
};
