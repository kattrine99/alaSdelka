import { LoginPage, RegistrationPage, MainPage, CategoryPage, ProfilePage, CardDetailPage, FavoritePage, AnnouncemntsPage, NoticePage, UserAnnouncementPage, StatisticsPage } from "./Pages/index";
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import './index.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "./Store/Slices/authSlice";
import { getToken } from "./utils/tokenUtils";
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
import { StepsAddingOffer } from "./Pages/Announcements/StepsAddingOffer/StepsAddingOffer";
import { PromotionPage } from "./Pages/PromotionPage/PromotionPage";
import { useAutoLogout } from "./utils/useAutoLogout";
import { useAuthInit } from "./utils/useAUthInit";
import { PromotionCards, ModalBase, Button } from "./components";
import { RootState } from "./Store/store";
import { setSessionExpired } from "./Store/Slices/uiSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionExpired = useSelector((state: RootState) => state.ui.sessionExpired);

  return (
    <>
    
      <ScrollToTop />
      <Outlet />

      {sessionExpired && (
        <ModalBase
          title="Сессия завершена"
          message="Ваша сессия истекла. Пожалуйста, войдите снова."
          onClose={() => {
            dispatch(setSessionExpired(false));
            navigate("/login");
          } }
          actions={<Button
            onClick={() => {
              dispatch(setSessionExpired(false));
              navigate("/login");
            } }
            className="bg-[#2EAA7B] text-white px-6 py-2 rounded-lg"
          >
            Войти
          </Button>} HeadingClassName={""}        />
      )}

    </>
  )
}

const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "main", element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegistrationPage /> },
      { path: ":category", element: <CategoryPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "favorites", element: <FavoritePage /> },
      { path: "announcements", element: <AnnouncemntsPage /> },
      { path: "add-offer", element: <StepsAddingOffer /> },
      { path: "/promotion/:id", element: <PromotionPage /> },
      { path: "/promotion", element: <PromotionCards /> },
      { path: "notices", element: <NoticePage /> },
      { path: "/statistics/:id", element: <StatisticsPage /> },
      { path: ":category/card/:id", element: <CardDetailPage /> },
      { path: "/users/:userId/:category", element: <UserAnnouncementPage /> },
    ]
  }
]);

function App() {
  useAuthInit();
  const dispatch = useDispatch();
  useAutoLogout();
  useEffect(() => {
    const token = getToken();
    if (token) dispatch(setIsAuthenticated(true));
  }, [dispatch]);
  return (
    <div className="">
      <div className="container">
        <RouterProvider router={routerConfig} />
      </div>
    </div>
  )
}

export default App
