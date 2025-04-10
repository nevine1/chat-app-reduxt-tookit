import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import SearchUser from './UserSearchingPage'
const UserSearchingPage = ({onClose}) => {
  return (
      <div className="fixed top-0 left-0 bg-red-200 w-full h-screen">
      <h1>Helloooooooooooooooooooooooooooo </h1>
      
      <p onClick={onClose}>Close </p>
        </div>
  )
}

export default UserSearchingPage;