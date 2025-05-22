"use client"
import { useEffect } from "react";

import SideBar from '../../components/messaging/SideBar'
import MessageBar  from '../../components/messaging/MessageBar'
import { useSelector, useDispatch } from 'react-redux'
import Image from "next/image";
import logoImg from '../../../public/assets/logo.png'
import { setOnlineUsers , setSocketConnection } from '../../store/slices/auth/authSlice'
import {connectSocket, disconnectSocket } from '../socket/socket'
const page = () => {
    const dispatch = useDispatch();
    const { user,  token} = useSelector((state) => state.auth);
  
    const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";

    const backendUrl = "http://localhost:5000"

    useEffect(() => {
        
        if (!token) return;
    
        const socket = connectSocket(token, backendUrl);
        console.log('socket in dashboard page is', socket)
        socket.on("onlineUsers", (users) => {
          console.log("Online users:", users);
          dispatch(setOnlineUsers(users));
        });
    
        return () => {
          disconnectSocket();
        };

    }, [token]);
    
    return (
        <div className="flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-1/5 md:w-2/5 h-[calc(100vh-5rem)] bg-slate-100 shadow-md">
                <SideBar   />
            </div>
            <div className="w-full sm:w-4/5 md:3/5 p-4 shadow-md">
                
                <div className="flex flex-col gap-5 justify-center items-center  pb-24 mb-20">
                    <Image
                        src={logoImg}
                        alt="Logo image"
                        width={250}
                        height={100}
                        className="h-auto w-auto"
                       priority
                    />
                    <h2 className="text-gray-600 text-[18px]">{user.name}, you can select your friend to start chat here </h2>
                    <h2>{user.email}</h2>
                    <Image
                        src={profile_pic}
                        alt={`picture of ${user.name}`}
                        width={100}
                        height={100}
                        className="h-auto w-auto rounded-md"
                        priority
                    />
                </div>
            </div>
    
             
        </div>

    )
};

export default page;










