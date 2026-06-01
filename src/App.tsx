import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { LoginModal } from "./pages/LoginModal";
import { LandingPage } from "./pages/Landing";
import {
  PerformancePage, CHIsPage, TasksPage, RewardsShopPage,
  MyRewardsPage, LeaderboardsPage, AchievementsPage,
  NotificationsPage, TeamPage, AnalyticsPage, ImportPage, AdminPage
} from "./pages/Pages";
import { useStore } from "./store/useStore";
import { useEffect } from "react";

function PageRouter() {
  const currentPage = useStore((s) => s.currentPage);
  switch (currentPage) {
    case "dashboard": return <Dashboard />;
    case "performance": return <PerformancePage />;
    case "chis": return <CHIsPage />;
    case "tasks": return <TasksPage />;
    case "rewards-shop": return <RewardsShopPage />;
    case "my-rewards": return <MyRewardsPage />;
    case "leaderboards": return <LeaderboardsPage />;
    case "achievements": return <AchievementsPage />;
    case "notifications": return <NotificationsPage />;
    case "team": return <TeamPage />;
    case "analytics": return <AnalyticsPage />;
    case "import": return <ImportPage />;
    case "admin": return <AdminPage />;
    default: return <Dashboard />;
  }
}

function AuthenticatedShell() {
  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1">
          <PageRouter />
        </main>
      </div>
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />
      <div className="noise-overlay" />
    </div>
  );
}

function App() {
  const { currentView, isLoggedIn, setShowLoginModal } = useStore();

  // Redirect to login if trying to access dashboard without being logged in
  useEffect(() => {
    if (currentView === "app" && !isLoggedIn) {
      // Auto-redirect to landing if somehow not logged in
      useStore.setState({ currentView: "landing" });
    }
  }, [currentView, isLoggedIn]);

  // Auto-open login if someone tries to navigate but isn't logged in
  const handleLoginRequest = () => {
    setShowLoginModal(true);
  };

  if (currentView === "landing" || !isLoggedIn) {
    return (
      <>
        <LandingPage onLoginClick={handleLoginRequest} />
        <LoginModal />
      </>
    );
  }

  return (
    <>
      <AuthenticatedShell />
      <LoginModal />
    </>
  );
}

export default App;
