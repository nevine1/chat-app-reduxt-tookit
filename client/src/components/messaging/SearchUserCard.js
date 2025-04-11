
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const SearchUserCard = ({ user }) => {

  const userPic = user?.profile_pic ? `/assets/${user?.profile_pic}` : "/assets/flower.jpg";
  
  return (
    <div className="flex    items-center   px-4  border-b-2 border-slate-200
      hover:border hover:border-blue-400  hover:rounded-md cursor-pointer
      ">
      <div className="m-3 flex  flex-row gap-4 justify-center">
        
        <Image
          alt="pic"
          src={userPic}
          width={50}
          height={50}
          className="rounded-full h-10 w-10 "
        />
        <h1>{user.name}</h1>
      </div>
    </div>
  )
}

export default SearchUserCard