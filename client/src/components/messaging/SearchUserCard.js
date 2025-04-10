
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const SearchUserCard = ({ user }) => {

  const userPic = user?.profile_pic ? `/assets/${user?.profile_pic}` : "/assets/flower.jpg";
  
  return (
    <div className="flex  flex-row  items-center gap-4  p-4 border-b-2 border-slate-200
      hover:border hover:border-blue-400  hover:rounded-md cursor-pointer
      ">
        
        <Image
          alt="pic"
          src={userPic}
          width={50}
          height={50}
          className="rounded-full h-8 w-8 mb-2"
      />
      <h1>{user.name}</h1>
    </div>
  )
}

export default SearchUserCard