"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../public/assets/logo.png';

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between bg-white items-center h-20  px-10 shadow-md ">
      <div>
        <Image 
            src={Logo} 
            width={150} 
            height={50} 
            priority={true} 
            className="w-auto h-auto" 
            alt="logo" 
          />
        {/* <Link className=" text-[24px]" href="/">Chat-App</Link> */}
      </div>
      <nav >
        <ul className="flex flex-row gap-4">
            <Link href="/auth/register">Register</Link>
            <Link href="/auth/email">login</Link>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar;
