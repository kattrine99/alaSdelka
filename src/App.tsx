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
import { setLogoutReason } from "./Store/Slices/authSlice";
import { ProtectedRoute } from "./ProtectedRoute";
import UserAgreement from "./components/Footer/UserAgreement";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import { useGetCurrencyRateQuery } from "./Store/api/Api";
import { setCurrencyRate } from "./Store/Slices/currencySlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutReason = useSelector((state: RootState) => state.auth.logoutReason);
  const { data } = useGetCurrencyRateQuery();

  useEffect(() => {
    if (data?.rate) {
      dispatch(setCurrencyRate(data.rate));
    }
  }, [data, dispatch]);

  const handleCloseModal = () => {
    dispatch(setLogoutReason(null));
    navigate("/login");
  };

  const getModalContent = () => {
    if (logoutReason === "expired") {
      return {
        title: "Сессия завершена",
        message: "Ваша сессия истекла. Пожалуйста, войдите снова.",
        buttonText: "Войти",
      };
    }
    if (logoutReason === "unauthorized") {
      return {
        title: "Требуется вход",
        message: "Чтобы продолжить, пожалуйста, войдите в систему.",
        buttonText: "Войти",
      };
    }
    return null;
  };

  const modalContent = getModalContent();
  return (
    <>

      <ScrollToTop />
      <Outlet />

      {modalContent && (
        <ModalBase
          title={modalContent.title}
          message={modalContent.message}
          onClose={handleCloseModal}
          actions={
            <Button onClick={handleCloseModal} className="bg-[#2EAA7B] text-white px-6 py-2 rounded-lg">
              {modalContent.buttonText}
            </Button>
          }
          HeadingClassName=""
        />
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
      { path: ":category/card/:id", element: <CardDetailPage /> },
      { path: "/user-agreement", element: <UserAgreement /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },



      {
        path: "profile", element:
          (<ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>),
      },
      {
        path: "favorites", element:
          (<ProtectedRoute>
            <FavoritePage />
          </ProtectedRoute>),
      },
      {
        path: "announcements", element:
          (<ProtectedRoute>
            <AnnouncemntsPage />
          </ProtectedRoute>),
      },
      {
        path: "add-offer", element: (
          <ProtectedRoute>
            <StepsAddingOffer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/promotion/:id", element:
          (
            <ProtectedRoute>
              <PromotionPage />
            </ProtectedRoute>
          ),
      },
      {
        path: "/promotion", element: (
          <ProtectedRoute>
            <PromotionCards />
          </ProtectedRoute>
        ),
      },
      {
        path: "notices", element: (
          <ProtectedRoute>
            <NoticePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/statistics/:id", element: (
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:userId/:category", element: (
          <ProtectedRoute>
            <UserAnnouncementPage />
          </ProtectedRoute>
        ),
      },
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
