import Sidebar from '../components/Sidebar'
import Popup from 'reactjs-popup'
import CreateTask from '../components/CreateTask'
import CreateWorkspace from '../components/CreateWorkspace';
import { Route, Routes, Link } from 'react-router-dom';
//import { useWorkspace } from '../context/WorkspaceContext';


function Dashboard() {
  //useWorkspace();

  return (
    <>
      <div className='flex bg-[#090D11]'>
      <Sidebar/>
      
      

      <Routes>
        <Route path="createworkspace" element={<CreateWorkspace/>}/>
      </Routes>
      
      </div>
      
      
    </>
  )
}

export default Dashboard