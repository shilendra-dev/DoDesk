import React from 'react'
import SearchBar from './SearchBar'
import AddMemberButton from './AddMemberButton'

function Header() {
  return (
    <div className='flex items-center justify-between p-5 w-full bg-[#101221] h-18 border-b border-b-gray-800'>
        <div className='w-2xl flex '>
            <SearchBar/>
        </div>
            <AddMemberButton/>
    </div>
  )
}

export default Header