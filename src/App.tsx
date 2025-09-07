import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommissionCalculatorPage from "./pages/CommissionCalculatorPage";
import AuthLanding from "./components/Authlanding";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/calculate"
          element={
            <ProtectedRoute>
              <CommissionCalculatorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
