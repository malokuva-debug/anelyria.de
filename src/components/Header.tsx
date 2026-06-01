import { useStore } from "../store/useStore";
import { Menu, Search, Bell, LogOut } from "lucide-react";

export function Header() {
  const { searchQuery, setSearchQuery, setSidebarOpen, sidebarOpen, logout } = useStore();
  const currentUser = useStore((s) => s.currentUser);
  const unreadNotifs = useStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <header className="header-glass sticky top-0 z-30 flex h-16 items-center gap-4 px-4 md:px-8">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="relative hidden w-full max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anything..."
          className="glass-input w-full rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      <button
        onClick={() => useStore.setState({ currentPage: "notifications" })}
        className="relative rounded-lg p-2 text-zinc-400 hover:bg-white/5"
      >
        <Bell className="h-5 w-5" />
        {unreadNotifs > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-lg">
            {unreadNotifs}
          </span>
        )}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={logout}
          className="btn-glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-white/5 p-1 pr-3 ring-1 ring-white/10 hover:bg-white/10">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="hidden text-sm font-medium text-white md:inline">{currentUser.name.split(" ")[0]}</span>
        </button>
      </div>
    </header>
  );
}
