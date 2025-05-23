import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

const SearchUserCard = ({ user, onClose }) => {
  const { onlineUsers } = useSelector(state => state.auth);

  const userPic = user?.profile_pic ? `/assets/${user?.profile_pic}` : "/assets/flower.jpg";
  const isOnline = user?._id && onlineUsers.includes(user._id);

  return (
    <Link href={`/dashboard/${user?._id}`} onClick={onClose} passHref>
      <div className="flex items-center px-4 py-2 hover:bg-blue-100 rounded-md cursor-pointer">
        <div className="relative mr-4">
          <Image
            alt="pic"
            src={userPic}
            width={50}
            height={50}
            className="rounded-full"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchUserCard;
