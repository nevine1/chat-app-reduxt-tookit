import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import SearchUser from './SearchUser';

const UserSearchingPage = ({ onClose , onSelectUser }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 ">
      <div className="relative w-full h-full overflow-auto ">
        <div className="flex justify-end p-4">
          <IoMdCloseCircle
            onClick={onClose}
            className="text-white text-3xl cursor-pointer"
            title="Close"
          />
        </div>
        <SearchUser onClose={onClose} onSelectUser={onSelectUser}  />
      </div>
    </div>
  );
};

export default UserSearchingPage;
