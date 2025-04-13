import { Button, Footer, Header } from "../../components"
import { personalpages } from "../../utils/variables"
import { clearToken } from "../../utils/tokenUtils";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../Store/Slices/authSlice";
import { useNavigate } from "react-router-dom";


export const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        dispatch(setIsAuthenticated(false));
        navigate("/login");
    };
    return (
        <div className="w-screen">
            <Header navLinksData={personalpages} showtoBar={false} />
            <div className="w-full">
                <Button className={""} onClick={handleLogout}>Log out</Button>
            </div>
            <Footer showSmallFooter={true} ></Footer>
        </div>
    )
}
