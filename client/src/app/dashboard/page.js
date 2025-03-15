"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from '../../components/messaging/SideBar'
import { useSelector } from 'react-redux'


const page = () => {
   
    
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    console.log("User in Dashboard:", user);

    const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
    const userName = user?.name || "User";

    return (
        <div className="flex flex-col sm:flex-row h-screen gap-4">
            <div className="w-full sm:w-1/3 h-[calc(100vh-5rem)] bg-slate-100 shadow-md">
                <SideBar />
            </div>
            <div className="w-full sm:w-2/3 bg-blue-500 p-4 shadow-md">
                <h1 className="text-xl font-bold text-white">Welcome, { userName}!</h1>
                {user?.profile_pic && (
                    <img
                        src={profile_pic}
                        alt="Profile"
                        className="w-20 h-20 rounded-full mt-4"
                    />
                )}
            </div>
        </div>

            )
};

export default page;










