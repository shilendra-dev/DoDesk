import Sidebar from '../../shared/components/organisms/Sidebar';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWorkspace } from '../../providers/WorkspaceContext';

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
    <div className="flex h-screen bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 m-2 rounded-md border border-[var(--color-border-secondary)]  flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
