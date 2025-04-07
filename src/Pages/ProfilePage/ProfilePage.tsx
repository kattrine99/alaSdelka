import { Footer, Header } from "../../components"
import { personalpages } from "../../utils/variables"

export const ProfilePage = () => {
    return (
        <div className="w-screen">
            <Header navLinksData={personalpages} showtoBar={false} />

            <Footer showSmallFooter={true} ></Footer>
        </div>
    )
}
