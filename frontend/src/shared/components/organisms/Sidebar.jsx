import {
  Home,
  ListTodo,
  CalendarDays,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Smartphone,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import WorkspaceDropdown from "../../../features/workspace/WorkspaceDropdown";
import CreateWorkspaceButton from "../molecules/CreateWorkspaceButton";
import {useWorkspace} from "../../../providers/WorkspaceContext"




export default function Sidebar() {
  const navigate = useNavigate();
  const {selectedWorkspace} = useWorkspace();
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Overview", path:"overview"},
    { icon: <ListTodo size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Tasks", badge: "" , path:"tasks"},
    { icon: <CalendarDays size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Calendar", path:"calender"},
    { icon: <BarChart2 size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Analytics" , path:"analytics"},
    { icon: <Users size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Team" , path:"team", },
  ];

  const handleMenuClick = (path) => {
    navigate(`/${selectedWorkspace.id}/${path}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("workspaces");
    navigate("/");
  };

  const generalItems = [
    { icon: <Settings size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Settings" , path:""},
    { icon: <HelpCircle size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Help" , path:""},
    { icon: <LogOut size={20} className="text-[var(--color-text)] dark:text-[var(--color-text)]"/>, label: "Logout", onClick: handleLogout},
  ];

  return (
    <aside className="w-64 min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg)] p-6 flex flex-col  shadow-md border-r border-[var(--color-border)] dark:border-[var(--color-border)]">
      {/*Logo*/}
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-2xl font-mono text-[var(--color-text)] dark:text-[var(--color-text)]">DoDesk</h1>
        <div className="flex justify-between items-center">
          <Avatar />
          <MenuIcon className="ml-2 text-[var(--color-text)]" />
        </div>
      </div>
      <WorkspaceDropdown />

      {/*Menu*/}
      <nav className="space-y-6">
        <div>
          <ul className="space-y-2">
            {menuItems.map(({ icon, label, badge, path }) => {
              const isActive = location.pathname.includes(`/${path}`)

            return (
              <li
                key={label}
                onClick={()=> handleMenuClick(path)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--color-ghost)] ${
                  isActive
                    ? "bg-[var(--color-bg-secondary)] font-semibold text-[var(--color-text)]"
                    : "text-[var(--color-text)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-xs text-[var(--color-text)] rounded-3xl px-2">
                    {badge}
                  </span>
                )}
              </li>
            )})}
          </ul>
        </div>

        <div>
          <h2 className="text-sm text-[var(--color-text)] mb-2">General</h2>
          <ul className="space-y-2">
            {generalItems.map(({ icon, label, onClick }) => (
              <li
                key={label}
                onClick={onClick}
                className="flex items-center gap-3 px-3 py-2 text-[var(--color-text)] rounded-lg cursor-pointer hover:bg-[var(--color-ghost)]"
              >
                {icon}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="w-64">
        <CreateWorkspaceButton />
      </div>
    </aside>
  );
}
