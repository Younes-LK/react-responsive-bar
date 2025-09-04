import React, { useState, useEffect, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Layers3,
  CheckCircle2,
  Users,
  LayoutDashboard,
  BarChart3,
  BadgePercent,
  Receipt,
  ChevronDown,
  LogOut,
  UserCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // NOTE: Please adjust the import path to your AuthContext file

// --- Type Definition for a Menu Item ---
interface SubMenuItem {
  text: string;
  path: string;
}
interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  subItems?: SubMenuItem[];
}

// --- Data for navigation items ---
const menuItems: MenuItem[] = [
  { text: "Home", icon: <Home size={20} />, path: "/dashboard" },
  {
    text: "Projects",
    icon: <Layers3 size={20} />,
    path: "/projects",
    subItems: [
      { text: "Web Design", path: "/projects/web-design" },
      { text: "Mobile App", path: "/projects/mobile-app" },
      { text: "Branding", path: "/projects/branding" },
      { text: "SEO", path: "/projects/seo" },
    ],
  },
  {
    text: "Tasks",
    icon: <CheckCircle2 size={20} />,
    path: "/tasks",
    subItems: [
      { text: "To Do", path: "/tasks/todo" },
      { text: "In Progress", path: "/tasks/in-progress" },
      { text: "Completed", path: "/tasks/completed" },
    ],
  },
  { text: "Team", icon: <Users size={20} />, path: "/team" },
  { text: "Tracker", icon: <LayoutDashboard size={20} />, path: "/tracker" },
  { text: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
  { text: "Perks", icon: <BadgePercent size={20} />, path: "/perks" },
  { text: "Expenses", icon: <Receipt size={20} />, path: "/expenses" },
];

// --- Main Layout Component ---
export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div dir="rtl" className={`font-sans ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-[#181818] text-black dark:text-white min-h-screen">
        {isMobile ? (
          <MobileLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        ) : (
          <DesktopLayout
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      </div>
    </div>
  );
}

// --- Prop Types for Components ---
interface LayoutProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarItemProps {
  item: MenuItem;
  isOpen?: boolean;
  toggleSubMenu?: () => void;
}

type AnimationState = "opening" | "closing" | null;

// --- Desktop Layout Component ---
function DesktopLayout({ isDarkMode, setIsDarkMode }: LayoutProps) {
  const { user, logout } = useAuth();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [userMenuState, setUserMenuState] = useState<AnimationState>(null);

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "G";

  useEffect(() => {
    if (userMenuState === "closing") {
      const timer = setTimeout(() => setUserMenuState(null), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [userMenuState]);

  const toggleUserMenu = () => {
    setUserMenuState(userMenuState === null ? "opening" : "closing");
  };

  const toggleSubMenu = (text: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  return (
    <div className="flex">
      <aside className="h-screen sticky top-0">
        <nav className="h-full flex flex-col bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-sm rounded-lg w-64">
          {/* Logo and Brand Name */}
          <div className="p-4 pb-2 flex items-center gap-2">
            <img src="../../public/YourLogo.svg" className="w-8 h-8" />
            <span className="text-xl font-bold">YourName</span>
          </div>

          {/* Navigation Items */}
          <ul className="flex-1 px-3 mt-4 overflow-y-auto">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                isOpen={openSubMenus[item.text]}
                toggleSubMenu={() => toggleSubMenu(item.text)}
              />
            ))}
          </ul>

          {/* User Info and Popover Menu */}
          <div className="p-3 dark:border-gray-800 relative">
            <div
              onClick={toggleUserMenu}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-300">
                  {userInitials}
                </span>
              </div>
              <div className="leading-4 flex-1">
                <h4 className="font-semibold">{user?.name || "Guest User"}</h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.company?.name || "No Company"}
                </span>
              </div>
            </div>
            {userMenuState !== null && (
              <div
                className={`absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 ${
                  userMenuState === "opening"
                    ? "animate-fade-in-up"
                    : "animate-fade-out-down"
                }`}
              >
                <ul className="p-2 text-sm">
                  <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <UserCircle size={20} />
                    <span>Profile</span>
                  </li>
                  <li
                    onClick={logout}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

// --- Sidebar Item for Desktop ---
function SidebarItem({ item, isOpen, toggleSubMenu }: SidebarItemProps) {
  const location = useLocation();
  const { text, icon, subItems, path } = item;
  const isActive = location.pathname.startsWith(path);

  const commonClasses =
    "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group";
  const activeClasses =
    "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white";
  const inactiveClasses =
    "hover:bg-gray-100 dark:hover:bg-slate-900 text-gray-600 dark:text-gray-100";
  const liClasses = `${commonClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;

  if (!subItems) {
    return (
      <Link to={path}>
        <li className={liClasses}>
          {icon}
          <span className="w-52 mr-3">{text}</span>
        </li>
      </Link>
    );
  }

  return (
    <>
      <li onClick={toggleSubMenu} className={liClasses}>
        {icon}
        <span className="w-52 mr-3">{text}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </li>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="pr-10 pl-3 pb-2 text-sm text-gray-600 dark:text-gray-400">
          {subItems.map((sub, index) => (
            <Link to={sub.path} key={index}>
              <li
                className={`py-1.5 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                  location.pathname === sub.path
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : ""
                }`}
              >
                {sub.text}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

// --- Mobile Layout Component ---
interface SubMenuState {
  status: AnimationState;
  item: MenuItem | null;
}

function MobileLayout({ isDarkMode, setIsDarkMode }: LayoutProps) {
  const { user, logout } = useAuth();
  const [subMenuState, setSubMenuState] = useState<SubMenuState>({
    status: null,
    item: null,
  });
  const [userMenuState, setUserMenuState] = useState<AnimationState>(null);

  useEffect(() => {
    if (subMenuState.status === "closing") {
      const timer = setTimeout(
        () => setSubMenuState({ status: null, item: null }),
        300
      );
      return () => clearTimeout(timer);
    }
  }, [subMenuState.status]);

  useEffect(() => {
    if (userMenuState === "closing") {
      const timer = setTimeout(() => setUserMenuState(null), 300);
      return () => clearTimeout(timer);
    }
  }, [userMenuState]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.subItems) {
      if (subMenuState.status === null) {
        setSubMenuState({ status: "opening", item });
      } else {
        setSubMenuState((prev) => ({ ...prev, status: "closing" }));
      }
    }
  };

  const toggleUserMenu = () => {
    setUserMenuState(userMenuState === null ? "opening" : "closing");
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <TopNavbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onUserMenuClick={toggleUserMenu}
        user={user}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Submenu Popover for Mobile */}
      {subMenuState.status !== null && subMenuState.item && (
        <div
          onClick={() =>
            setSubMenuState((prev) => ({ ...prev, status: "closing" }))
          }
          className="fixed inset-0 bg-transparent z-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border dark:border-gray-700 ${
              subMenuState.status === "opening"
                ? "animate-slide-up"
                : "animate-slide-down"
            }`}
          >
            <h3 className="font-bold text-center p-2">
              {subMenuState.item.text}
            </h3>
            <hr className="dark:border-gray-700" />
            <ul className="text-sm">
              {subMenuState.item.subItems?.map((sub, index) => (
                <Link
                  to={sub.path}
                  key={index}
                  onClick={() =>
                    setSubMenuState((prev) => ({ ...prev, status: "closing" }))
                  }
                >
                  <li className="p-3 text-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                    {sub.text}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* User Menu Popover for Mobile */}
      {userMenuState !== null && (
        <div
          onClick={() => setUserMenuState("closing")}
          className="fixed inset-0 bg-transparent z-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-16 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 w-48 ${
              userMenuState === "opening"
                ? "animate-fade-in-down"
                : "animate-fade-out-up"
            }`}
          >
            <ul className="p-2 text-sm">
              <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                <UserCircle size={20} />
                <span>Profile</span>
              </li>
              <li
                onClick={logout}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <BottomNavbar onMenuClick={handleMenuClick} />
    </div>
  );
}

// --- Top Navbar for Mobile ---
interface TopNavbarProps extends Omit<LayoutProps, "children"> {
  onUserMenuClick: () => void;
  user: ReturnType<typeof useAuth>["user"];
}

function TopNavbar({
  isDarkMode,
  setIsDarkMode,
  onUserMenuClick,
  user,
}: TopNavbarProps) {
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "G";

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm rounded-lg sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <img src="../../public/YourLogo.svg" className="w-8 h-8" />
        <span className="text-lg font-bold">YourName</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div
          onClick={onUserMenuClick}
          className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
        >
          <span className="font-semibold text-sm text-gray-600 dark:text-gray-300">
            {userInitials}
          </span>
        </div>
      </div>
    </header>
  );
}

// --- Bottom Navbar for Mobile ---
interface BottomNavbarProps {
  onMenuClick: (item: MenuItem) => void;
}

function BottomNavbar({ onMenuClick }: BottomNavbarProps) {
  const navItems = menuItems.slice(0, 5);
  const location = useLocation();

  return (
    <nav className="flex justify-around items-center p-2 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-sm rounded-lg sticky bottom-0">
      {navItems.map((item, index) => {
        const isActive = location.pathname.startsWith(item.path);

        const content = (
          <div
            className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors w-16 ${
              isActive
                ? "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
                : "text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-900"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1 truncate">{item.text}</span>
          </div>
        );

        if (item.subItems) {
          return (
            <div key={index} onClick={() => onMenuClick(item)}>
              {content}
            </div>
          );
        }
        return (
          <Link to={item.path} key={index}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
