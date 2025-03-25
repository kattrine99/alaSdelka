import { LoginPage, RegistrationPage, MainPage } from "./Pages/index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />
  },
  {
    path: "/main",
    element: <MainPage />
  },
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
