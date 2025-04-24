"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from '../../components/messaging/SideBar'
import { useSelector } from 'react-redux'
import Image from "next/image";
import logoImg from '../../../public/assets/logo.png'
const page = () => {
   
    const {user} = useSelector((state) => state.auth);
   
    const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
    const userName = user?.name || "User";

    return (
        <div className="flex flex-col sm:flex-row h-screen ">
            <div className="w-full sm:w-1/5 md:w-2/5 h-[calc(100vh-5rem)] bg-slate-100 shadow-md">
                <SideBar onSelectedUser={selectedUserId}/>
            </div>
            <div className="w-full sm:w-4/5 md:3/5 p-4 shadow-md">
                
                <div className="flex flex-col gap-5 justify-center items-center min-h-screen pb-24 mb-20">
                    <Image
                        src={logoImg}
                        alt="Logo image"
                        width={250}
                        height={100}
                        
                    />
                    <h2 className="text-gray-600 text-[18px]">{user.name}, you can select your friend to start chat here </h2>
                </div>
            </div>
        </div>

    )
};

export default page;










