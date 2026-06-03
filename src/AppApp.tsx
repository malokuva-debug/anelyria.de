import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";
import { BuilderLoginPage } from "./pages/BuilderLoginPage";
import { BuilderPage } from "./pages/BuilderPage";
import {
  PerformancePage, CHIsPage, TasksPage, RewardsShopPage,
  MyRewardsPage, LeaderboardsPage, AchievementsPage,
  NotificationsPage, TeamPage, AnalyticsPage, ImportPage, AdminPage
} from "./pages/Pages";
import { useStore } from "./store/useStore";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />
      <div className="noise-overlay" />
    </div>
  );
}

function AppApp() {
  const { isLoggedIn, isSuperAdmin } = useStore();

  return (
    <Routes>
      {/* Tenant login — public */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/app" /> : <LoginPage />} />
      
      {/* Tenant dashboard — requires tenant auth */}
      <Route path="/app/*" element={
        isLoggedIn ? (
          <AuthenticatedShell>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="performance" element={<PerformancePage />} />
              <Route path="chis" element={<CHIsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="rewards-shop" element={<RewardsShopPage />} />
              <Route path="my-rewards" element={<MyRewardsPage />} />
              <Route path="leaderboards" element={<LeaderboardsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="import" element={<ImportPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/app" />} />
            </Routes>
          </AuthenticatedShell>
        ) : (
          <Navigate to="/login" />
        )
      } />

      {/* LyriaBuilder (super admin) — public login, protected dashboard */}
      <Route path="/lyriabuilder/login" element={
        isLoggedIn && isSuperAdmin ? <Navigate to="/lyriabuilder" /> : <BuilderLoginPage />
      } />
      <Route path="/lyriabuilder/*" element={
        isLoggedIn && isSuperAdmin ? <BuilderPage /> : <Navigate to="/lyriabuilder/login" />
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/app" : "/login"} />} />
    </Routes>
  );
}

export default AppApp;
