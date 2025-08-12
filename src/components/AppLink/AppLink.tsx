import { ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
interface ApplinkProps {
    to: string
    children?: ReactNode
    className?: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;

}
export const Applink = ({ to, children, className, onClick }: ApplinkProps) => {
    const { lng } = useParams();
    return (
        <Link to={`/${lng}${to}`} onClick={onClick} className={className}>
            {children}
        </Link>
    )
}