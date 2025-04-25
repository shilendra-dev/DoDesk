import React from 'react'

function TaskListView({tasks}) {
  return (
    <div className='overflow-x-auto '>
      <table className='min-w-full bg-[#101221] shadow-md overflow-hidden'>
        <thead className='bg-[#090E12] border-b border-b-gray-800 text-gray-100 text-left text-sm'>
          <tr>
            <th className='px-4 py-3'>Title</th>
            <th className='px-4 py-3'>Description</th>
            <th className='px-4 py-3'>Status</th>
            <th className='px-4 py-3'>Priority</th>
            <th className='px-4 py-3'>Due Date</th>
            <th className='px-4 py-3'>Created By</th>
          </tr>
        </thead>
        <tbody>
          {console.log(tasks)}
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className='border-b border-b-gray-800 hover:bg-[#090E12] text-sm text-gray-200'>
                <td className="px-4 py-3">{task.title}</td>
                <td className="px-4 py-3">{task.description || "-"}</td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">{task.priority}</td>
                <td className="px-4 py-3">{task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3">{task.created_by_name || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TaskListView