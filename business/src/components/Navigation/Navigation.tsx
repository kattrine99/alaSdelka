import { Applink } from "../index";

interface NavLinksProps {
    links: { label: string; to: string }[];
    className?: string;
    linkClassName?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({ links, className = "", linkClassName = "" }) => {
    return (
        <nav className={`flex flex-wrap gap-x-8.5 font-medium${className}`}>
            {links.map((link, idx) => (
                <Applink key={idx} to={link.to} className={`text-[#232323] ${linkClassName}`}>
                    {link.label}
                </Applink>
            ))}
        </nav>
    );
};
