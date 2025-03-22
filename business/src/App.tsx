import { LoginPage } from "./Pages/index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import { RegistrationPage } from "./Pages/RegisterPage/RegisterPage";
const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />
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
