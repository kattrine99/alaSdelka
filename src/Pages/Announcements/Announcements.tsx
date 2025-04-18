import { Footer, Header, Heading } from "../../components"
import { profileNavigate } from "../../utils/categoryMap"

export const AnnouncemntsPage = () => {
  return (
    <div className="w-screen">
      <Header navLinksData={profileNavigate} />
      <div className="px-[192px] py-9">
        <Heading text={"Мои объявления"} level={2} className="font-inter text-xl font-bold leading-5 space-x-[-0.5%]" />

      </div>
      <Footer showSmallFooter={true} />
    </div>
  )
}