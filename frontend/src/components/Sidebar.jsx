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
import WorkspaceDropdown from "./WorkspaceDropdown";
import CreateWorkspaceButton from "./CreateWorkspaceButton";
import {useWorkspace} from "../context/WorkspaceContext"




export default function Sidebar() {
  const navigate = useNavigate();
  const {selectedWorkspace} = useWorkspace();
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home size={20} />, label: "Overview", path:"overview"},
    { icon: <ListTodo size={20} />, label: "Tasks", badge: "" , path:"tasks"},
    { icon: <CalendarDays size={20} />, label: "Calendar", path:"calender"},
    { icon: <BarChart2 size={20} />, label: "Analytics" , path:"analytics"},
    { icon: <Users size={20} />, label: "Team" , path:"team", },
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
    { icon: <Settings size={20} />, label: "Settings" , path:""},
    { icon: <HelpCircle size={20} />, label: "Help" , path:""},
    { icon: <LogOut size={20} />, label: "Logout", onClick: handleLogout},
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#101221] p-6 flex flex-col  shadow-md border-r border-gray-800">
      {/*Logo*/}
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-2xl font-mono text-gray-100 ">DoDesk</h1>
        <div className="flex justify-between items-center">
          <Avatar />
          <MenuIcon className="ml-2" />
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
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-green-600 ${
                  isActive
                    ? "bg-green-700 font-semibold text-gray-100"
                    : "text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-xs text-white bg-green-600 rounded-3xl px-2">
                    {badge}
                  </span>
                )}
              </li>
            )})}
          </ul>
        </div>

        <div>
          <h2 className="text-sm text-gray-400 mb-2">General</h2>
          <ul className="space-y-2">
            {generalItems.map(({ icon, label, onClick }) => (
              <li
                key={label}
                onClick={onClick}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg cursor-pointer hover:text-gray-950 hover:bg-green-100"
              >
                {icon}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <CreateWorkspaceButton />
    </aside>
  );
}
