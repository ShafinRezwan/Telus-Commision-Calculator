import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommissionCalculatorPage from "./pages/CommissionCalculatorPage";
import AuthLanding from "./components/Authlanding";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
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
