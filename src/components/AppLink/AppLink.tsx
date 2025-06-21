import { ReactNode } from "react"
import { Link } from "react-router-dom"
interface ApplinkProps {
    to: string
    children?: ReactNode
    className?: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;

}
export const Applink = ({ to, children, className, onClick }: ApplinkProps) => {
    return (
        <Link to={to} onClick={onClick} className={className}>
            {children}
        </Link>
    )
}