import { LoginPage, RegistrationPage, MainPage, CategoryPage, ProfilePage, CardDetailPage, FavoritePage, AnnouncemntsPage, NoticePage, UserAnnouncementPage, StatisticsPage } from "./Pages/index";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './index.css';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "./Store/Slices/authSlice";
import { getToken } from "./utils/tokenUtils";
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
import { StepsAddingOffer } from "./Pages/Announcements/StepsAddingOffer/StepsAddingOffer";
import { PromotionPage } from "./Pages/PromotionPage/PromotionPage";
import { useAutoLogout } from "./utils/useAutoLogout";
import { useAuthInit } from "./utils/useAUthInit";
const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

const routerConfig = createBrowserRouter([
  {
    path: "/main",
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
