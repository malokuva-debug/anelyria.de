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
      <Route path="/lyriabuilder/login" element={
        isLoggedIn && isSuperAdmin ? <Navigate to="/lyriabuilder" /> : <BuilderLoginPage />
      } />
      <Route path="/lyriabuilder/*" element={
        isLoggedIn && isSuperAdmin ? <BuilderPage /> : <Navigate to="/lyriabuilder/login" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppMain;
