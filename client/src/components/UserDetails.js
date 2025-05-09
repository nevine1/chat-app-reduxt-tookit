import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
const UserDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const imgSrc = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
  console.log('user details is:', user)
  console.log("Profile Pic URL:", user?.profile_pic);
  return (
    <div className="m-10 p-10 bg-pink-100">
      <h1 className="mb-3">{user.name}</h1>
      <p className="mb-6">{user.email}</p>
       <Image
        src={imgSrc}
        height={250}
        width={250}
        alt={user?.name || "user profile"}
        className="h-auto w-auto shadow-sm rounded-md "
        priority
          />
    </div>
  )
}

export default UserDetails