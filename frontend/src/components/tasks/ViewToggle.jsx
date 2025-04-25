import {React, useState} from 'react'

function ViewToggle({onToggle}) {
  const [isBoardView, setIsBoardView] = useState(false);

  const handleToggle = () => {
    const newView = !isBoardView;
    setIsBoardView(newView);
    onToggle(newView? 'board': 'list');
  }
  return (
    <div>
        <label className="inline-flex items-center cursor-pointer">
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {isBoardView ? 'Board' : 'List'}
            </span>
            <input type="checkbox" checked={isBoardView} onChange={handleToggle} className="sr-only peer" />
            <div className="relative ml-2 w-11 h-6 peer-focus:outline-none dark: rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            
        </label>
    </div>
  )
}

export default ViewToggle