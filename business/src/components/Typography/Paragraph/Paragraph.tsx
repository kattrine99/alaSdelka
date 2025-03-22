import React from "react";

interface ParagraphProps {
    children: React.ReactNode;
    className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
    children,
    className = "",
}) => {
    return (
        <p className={` transition-all duration-300 ${className}`}>
            {children}
        </p>
    );
};
