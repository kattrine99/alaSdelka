import { LoginPage, RegistrationPage, MainPage, CategoryPage, ProfilePage, CardDetailPage } from "./Pages/index";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './index.css';
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
const Layout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

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
      { path: ":category/card/:id", element: <CardDetailPage /> },
    ]
  }
]);

function App() {
  return (
    <div className="">
      <div className="container">
        <RouterProvider router={routerConfig} />
      </div>
    </div>
  )
}

export default App
