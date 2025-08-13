import {
  LoginPage, RegistrationPage, MainPage, CategoryPage, ProfilePage,
  CardDetailPage, FavoritePage, AnnouncemntsPage, NoticePage,
  UserAnnouncementPage, StatisticsPage,
  UpdatePage
} from "./Pages/index";
import {
  createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useNavigate
} from "react-router-dom";
import './index.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken, setAuthReady,
  setIsAuthenticated, setLogoutReason
} from "./Store/Slices/authSlice";
import { getToken } from "./utils/tokenUtils";
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
import { StepsAddingOffer } from "./Pages/Announcements/StepsAddingOffer/StepsAddingOffer";
import { PromotionPage } from "./Pages/PromotionPage/PromotionPage";
import { useAutoLogout } from "./utils/useAutoLogout";
import { useAuthInit } from "./utils/useAUthInit";
import { PromotionCards, ModalBase, Button } from "./components";
import { RootState } from "./Store/store";
import { ProtectedRoute } from "./ProtectedRoute";
import UserAgreement from "./components/Footer/UserAgreement";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import { useGetCurrencyRateQuery, useGetSiteSettingsQuery } from "./Store/api/Api";
import { setCurrencyRate } from "./Store/Slices/currencySlice";
import { setSiteSettings } from "./Store/Slices/siteSettings";
import { TranslationProvider } from "./../public/Locales/context/TranslationContext";
import { ArchivePage } from "./Pages/Announcements/Archive";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutReason = useSelector((state: RootState) => state.auth.logoutReason);
  const authReady = useSelector((state: RootState) => state.auth.authReady);

  const { data } = useGetCurrencyRateQuery();
  useEffect(() => {
    if (data?.rate) {
      dispatch(setCurrencyRate(data.rate));
    }
  }, [data, dispatch]);

  const { data: siteSettings } = useGetSiteSettingsQuery();
  useEffect(() => {
    if (siteSettings) {
      dispatch(setSiteSettings(siteSettings));
    }
  }, [siteSettings, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("expires_in");
    const isExpired = expiresAt && Date.now() > Number(expiresAt);

    if (token && !isExpired) {
      dispatch(setIsAuthenticated(true));
      dispatch(setAccessToken(token));
    } else if (token && isExpired) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("hasVisitedNotices");
      dispatch(setIsAuthenticated(false));
      dispatch(setLogoutReason("expired"));
    }

    dispatch(setAuthReady(true));
  }, [dispatch]);

  const showModal = logoutReason === "expired" && authReady;

  const handleCloseModal = () => {
    dispatch(setLogoutReason(null));
    navigate("/login");
  };

  return (
    <>
      <ScrollToTop />
      <div className="relative min-h-screen">
        <Outlet />
      </div>

      {showModal && (
        <ModalBase
          title="Сессия завершена"
          message="Ваша сессия истекла. Пожалуйста, войдите снова."
          onClose={handleCloseModal}
          actions={
            <Button onClick={handleCloseModal} className="bg-[#2EAA7B] text-white px-6 py-2 rounded-lg">
              Войти
            </Button>
          }
          HeadingClassName=""
        />
      )}
    </>
  );
};

const LanguageRedirect: React.FC = () => {
  const location = useLocation();
  const language = window.location.pathname.split("/")[1];
  const pathWithoutLang = '/' + location.pathname.split("/").slice(2).join("/");
  console.log(pathWithoutLang);


  // Если это русский язык с префиксом /ru/ - редиректим без префикса
  if (language === 'ru' && location.pathname.startsWith('/ru')) {
    return <Navigate to={pathWithoutLang} replace />;
  }

  return null;
};


const routerConfig = createBrowserRouter([
  {
    path: "ru/*", element: <LanguageRedirect />
  },
  {
    path: "/:lng?",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegistrationPage /> },

      // Section routes
      { path: "business", element: <CategoryPage section="business" /> },
      { path: "franchise", element: <CategoryPage section="franchise" /> },
      { path: "startup", element: <CategoryPage section="startup" /> },
      { path: "investments", element: <CategoryPage section="investments" /> },

      // Section with category routes
      { path: "business/category/:category", element: <CategoryPage section="business" /> },
      { path: "franchise/category/:category", element: <CategoryPage section="franchise" /> },
      { path: "startup/category/:category", element: <CategoryPage section="startup" /> },
      { path: "investments/category/:category", element: <CategoryPage section="investments" /> },

      // Section with city routes
      { path: "business/city/:city", element: <CategoryPage section="business" /> },
      { path: "franchise/city/:city", element: <CategoryPage section="franchise" /> },
      { path: "startup/city/:city", element: <CategoryPage section="startup" /> },
      { path: "investments/city/:city", element: <CategoryPage section="investments" /> },

      { path: "business/card/:slug", element: <CardDetailPage section="business" /> },
      { path: "franchise/card/:slug", element: <CardDetailPage section="franchise" /> },
      { path: "startup/card/:slug", element: <CardDetailPage section="startup" /> },
      { path: "investments/card/:slug", element: <CardDetailPage section="investments" /> },

      { path: "category/:category", element: <CategoryPage /> },
      { path: "city/:city", element: <CategoryPage /> },
      { path: "card/:slug", element: <CardDetailPage /> },
      { path: "user-agreement", element: <UserAgreement /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      {
        path: "profile", element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites", element: (
          <ProtectedRoute>
            <FavoritePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "announcements", element: (
          <ProtectedRoute>
            <AnnouncemntsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "announcements/archived", element: (
          <ProtectedRoute>
            <ArchivePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit/:slug", element: (
          <ProtectedRoute>
            <UpdatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-offer", element: (
          <ProtectedRoute>
            <StepsAddingOffer />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotion/:slug", element: (
          <ProtectedRoute>
            <PromotionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotion", element: (
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
        path: "statistics/:slug", element: (
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:userId/:category", element: (
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
        <TranslationProvider>

          <RouterProvider router={routerConfig} />
        </TranslationProvider>
      </div>
    </div>
  );
}

export default App;
