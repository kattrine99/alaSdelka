import { LoginPage, RegistrationPage, MainPage, CategoryPage, ProfilePage, CardDetailPage, FavoritePage, AnnouncemntsPage, NoticePage, UserAnnouncementPage } from "./Pages/index";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './index.css';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "./Store/Slices/authSlice";
import { getToken } from "./utils/tokenUtils";
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
import { useInactivityLogout } from "./utils/useAuthTimeout";
import { StepsAddingOffer } from "./Pages/Announcements/StepsAddingOffer/StepsAddingOffer";
const Layout = () => {
  useInactivityLogout(3600_000)
  return (
    <>
      <ScrollToTop />
      <Outlet />
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
      { path: "notices", element: <NoticePage /> },
      { path: ":category/card/:id", element: <CardDetailPage /> },
      { path: "user_announcements", element: <UserAnnouncementPage /> },
    ]
  }
]);

function App() {
  const dispatch = useDispatch();
  useInactivityLogout(3600_000);

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
