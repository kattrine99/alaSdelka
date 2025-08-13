import { ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "../../../public/Locales/context/TranslationContext"
interface ApplinkProps {
    to: string
    children?: ReactNode
    className?: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;

}
export const Applink = ({ to, children, className, onClick }: ApplinkProps) => {
    const { lang } = useTranslation();
    if (lang === "uz") {
        return (
            <Link to={`/${lang}${to}`} onClick={onClick} className={className}>
                {children}
            </Link>
        )
    }
    return (
            <Link to={`${to}`} onClick={onClick} className={className}>
                {children}
            </Link>
        )
}