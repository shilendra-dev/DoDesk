import React from 'react'
import HeadlessButton from '../atoms/headlessUI/HeadlessButton'
import { SquarePlus } from 'lucide-react'

function CreateTaskButton({onClick}) {
  return (
    <div>
      <HeadlessButton
        type="button"
        onClick={onClick}
        size='sm'
      >

        <SquarePlus className="h-4 w-4" />
          Add Task
      </HeadlessButton>
    </div>
  )
}

export default CreateTaskButton



