import {useState,React} from 'react'
import InviteMemberDrawer from '../organisms/InviteMemberDrawer';
import HeadlessButton from '../atoms/headlessUI/HeadlessButton';
import { CirclePlus } from 'lucide-react';
function AddMemberButton({workspaceId}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div>
        <HeadlessButton
        type="button"
        className=""
        onClick={() => setIsDrawerOpen(true)}
      >
        <CirclePlus className="w-4 h-4 me-2" />
          Add Member
      </HeadlessButton>

      {workspaceId && (
        <InviteMemberDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          workspaceId={workspaceId}
        />
      )}
    </div>
  )
}

export default AddMemberButton