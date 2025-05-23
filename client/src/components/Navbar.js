"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../public/assets/logo.png';
import  { logOut } from '../store/slices/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { persistStore } from 'redux-persist';
import { store } from "../store/store"
const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
    const {user, token} = useSelector((state) => state.auth)
  /* console.log("user details in the navbar", user)
  console.log("user token in the navbar", token) */

  const handleLogout = () => {
    
    dispatch(logOut());
      const persistor = persistStore(store); 
      persistor.purge();
      router.push("/");
  }

  return (
    <div className="flex flex-row justify-between bg-white items-center h-20 border-b-black px-10 shadow-md ">
      <div>
        <Link className=" text-[24px]" href="/">
          <Image 
              src={Logo} 
              width={130} 
              height={40} 
              priority
              className="h-auto w-auto"
              alt="logo" 
            />
         </Link> 
      </div>
      <nav >
        <ul className="flex flex-row gap-4">
          {
            token ? (
              <>
                <Link href="/dashboard" >Dashboard</Link>
                <button type="button" onClick={handleLogout}>Logout</button>
            </>
            ) : (
               <>
                  <Link href="/auth/register">Register</Link>
                  <Link href="/auth/loginEmail">login</Link>
                </> 
            )
          }
            {/* <Link href="/auth/register">Register</Link>
            <Link href="/auth/email">login</Link> */}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar;
