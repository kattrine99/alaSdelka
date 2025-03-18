interface ButtonPage {
    type?: "button" | "submit" | "reset"
    className: string
    onClick?: () => void;
    children?: React.ReactNode;
}

export const Button = ({ className, children, type, onClick }: ButtonPage) => {
    return (
        <button className={className} onClick={onClick} type={type}>{children}</button>
    )
}