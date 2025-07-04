import Sidebar from '../../shared/components/organisms/Sidebar';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWorkspace } from '../../providers/WorkspaceContext';
import Header from '../../shared/components/organisms/Header';

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
    <div className="flex bg-[var(--color-bg)] dark:bg-[var(--color-bg)] h-screen overflow-hidden">
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header />

        <div className="flex-1 text-[var(--color-text)] dark:text-[var(--color-text)] overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
