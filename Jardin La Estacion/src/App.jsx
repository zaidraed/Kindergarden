import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import ProtectedRoute from "./utils/ptotectedRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ErrorBoundary from "./components/ErrorBoundary";
import ResetPassword from "./components/Auth/resetPassword";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
