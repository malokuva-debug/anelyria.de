import { cn } from "../utils/cn";
import { useStore, type Page } from "../store/useStore";
import {
  LayoutDashboard, LineChart, SmilePlus, ClipboardList,
  ShoppingBag, Gift, Trophy, Award, Bell, Users,
  BarChart3, Upload, Settings, X
} from "lucide-react";
import { AnelyriaLogo, Coin } from "./icons";

const NAV_ITEMS: { id: Page; label: string; icon: any; badge?: number; requiredFeature?: "import" | "admin" | "user_management" | "team_management" }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "performance", label: "Performance", icon: LineChart },
  { id: "chis", label: "CHIs", icon: SmilePlus },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "rewards-shop", label: "Rewards", icon: ShoppingBag },
  { id: "my-rewards", label: "My Rewards", icon: Gift },
  { id: "leaderboards", label: "Leaderboards", icon: Trophy },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { id: "team", label: "Team", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "import", label: "Import CSV", icon: Upload, requiredFeature: "import" },
  { id: "admin", label: "Admin", icon: Settings, requiredFeature: "admin" },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, notifications, canAccessFeature } = useStore();
  const currentUser = useStore((s) => s.currentUser);
  const currentCoins = useStore((s) => s.getCurrentCoins());

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Role-based nav filtering: employees cannot see Import or Admin
  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (!item.requiredFeature) return true;
    return canAccessFeature(item.requiredFeature);
  });

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AnelyriaLogo className="h-10 w-10" />
            </div>
            <div className="leading-tight">
              <div className="gradient-text text-lg font-bold tracking-[0.2em]">ANELYRIA</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">Performance Platform</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 no-scrollbar">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            const displayBadge = item.id === "notifications" ? unreadCount : item.badge;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={cn(
                  "nav-item group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "active text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-zinc-500 group-hover:text-white")} />
                <span className="flex-1 text-left">{item.label}</span>
                {displayBadge ? (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                    active ? "bg-white text-black" : "bg-white/10 text-zinc-300"
                  )}>
                    {displayBadge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-white/5 p-4">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="avatar-ring h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{currentUser.name}</div>
                <div className="truncate text-xs text-zinc-500">{currentUser.department}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2 ring-1 ring-white/10">
              <Coin className="h-6 w-6" />
              <div>
                <div className="text-lg font-bold tabular-nums text-white leading-none">{currentCoins.toLocaleString()}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">Anelyria Coins</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
