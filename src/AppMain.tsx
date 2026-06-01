import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/Landing";
import { BuilderPage } from "./pages/BuilderPage";
import { BuilderLoginPage } from "./pages/BuilderLoginPage";
import { useStore } from "./store/useStore";

function AppMain() {
  const { isLoggedIn, isSuperAdmin } = useStore();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder/login" element={
        isLoggedIn && isSuperAdmin ? <Navigate to="/builder" /> : <BuilderLoginPage />
      } />
      <Route path="/builder/*" element={
        isLoggedIn && isSuperAdmin ? <BuilderPage /> : <Navigate to="/builder/login" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppMain;
