import Sidebar from '../components/Sidebar';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import Header from '../components/Header';

function Dashboard() {
  const { defaultWorkspaceId } = useWorkspace(); // use your default workspace logic here
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!workspaceId) {
      if (defaultWorkspaceId) {
        navigate(`/${defaultWorkspaceId}`, { replace: true });
      } else {
        navigate('/createworkspace', { replace: true });
      }
    }
  }, [workspaceId, defaultWorkspaceId, navigate]);

  return (
    <div className="flex bg-[#090D11] min-h-screen">
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <div className='w-full'><Header /></div>
        
        <div className="flex-1 p-4 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
