import { Home, ListTodo, CalendarDays, BarChart2, Users, Settings, HelpCircle, LogOut, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';

const menuItems = [
  { icon: <Home size={20} />, label: 'Dashboard', active: true },
  { icon: <ListTodo size={20} />, label: 'Workspaces', badge: '' },
  { icon: <CalendarDays size={20} />, label: 'Calendar' },
  { icon: <BarChart2 size={20} />, label: 'Analytics' },
  { icon: <Users size={20} />, label: 'Team' },
];



export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  }

  const generalItems = [
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <HelpCircle size={20} />, label: 'Help' },
    { icon: <LogOut size={20} />, label: 'Logout', onClick:handleLogout},
  ];

  return (
      <aside className='w-64 min-h-screen bg-[#202020] p-6 flex flex-col  shadow-md'>
        {/*Logo*/}
        <div className='mb-10 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-100 '>DoD</h1>
          <div className='flex justify-between items-center'>
            <Avatar />
            <MenuIcon className='ml-2'/>
          </div>
        </div>
        

        {/*Menu*/}
        <nav className='space-y-6'>
          <div>
            <h2 className='text-sm text-gray-500 mb-2'>Menu</h2>
            <ul className='space-y-2'>
              {menuItems.map(({icon, label, active, badge}) => (
                <li key={label} className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-green-500 ${
                  active ? 'bg-green-700 font-semibold text-gray-100' : 'text-gray-700'
                }`}>
                  <div className='flex items-center gap-3'>
                    {icon}
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span className='text-xs text-white bg-green-600 rounded-3xl px-2'>{badge}</span> 
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
          <h2 className='text-sm text-gray-500 mb-2'>General</h2>
            <ul className='space-y-2'>
                {generalItems.map(({icon, label, onClick}) => (
                  <li key={label} onClick={onClick} className='flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg cursor-pointer hover:bg-green-100'>
                    {icon}
                    <span>{label}</span>
                  </li>
                ))}
            </ul>
          </div>
        </nav>

      </aside>
  );
}
