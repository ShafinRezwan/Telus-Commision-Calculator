import { createBrowserRouter } from "react-router-dom";
import AuthLanding from "./components/Authlanding";
import ProtectedRoute from "./components/ProtectedRoutes";
import CommissionCalculatorPage from "./pages/CommissionCalculatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLanding />,
  },
  {
    path: "/calculate",
    element: (
      <ProtectedRoute>
        <CommissionCalculatorPage />
      </ProtectedRoute>
    ),
  },
]);
