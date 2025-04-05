interface ButtonPage {
    type?: "button" | "submit" | "reset"
    className: string
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
}

export const Button = ({ className, children, type, onClick, disabled }: ButtonPage) => {
    return (
        <button className={className} onClick={onClick} type={type} disabled={disabled} >{children}</button>
    )
}