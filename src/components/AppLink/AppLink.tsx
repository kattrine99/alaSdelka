import { ReactNode } from "react"
import { Link } from "react-router-dom"
interface ApplinkProps {
    to: string
    children?: ReactNode
    className?: string
}
export const Applink = ({ to, children, className }: ApplinkProps) => {
    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    )
}