import { Breadcrumbs } from "../../components"

export const Promotion = () => {
    return (
        <div className="py-7.5 px-48">
            <Breadcrumbs
                links={[
                    { label: "Мои объявления", href: "/announcements" },
                    { label: "Продвигать объявление" },
                ]}
            />
        </div>
    )
}
