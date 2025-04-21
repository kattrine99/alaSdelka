import { EmptyMessage, Footer, Header, Heading } from "../../components"
import { profileNavigate } from "../../utils/categoryMap"

export const FavoritePage = () => {
  return (
    <div className="w-screen">
      <Header navLinksData={profileNavigate} />
      <div className="px-[192px] py-9">
        <Heading text={"Избранное"} level={2} className="font-inter text-xl font-bold leading-5 space-x-[-0.5%]" />
        <EmptyMessage
          title="Нет избранных"
          subtitle="Здесь будут отображаться ваши избранные"
          hideButton
        />

      </div>
      <Footer showSmallFooter={true} />
    </div>
  )
}