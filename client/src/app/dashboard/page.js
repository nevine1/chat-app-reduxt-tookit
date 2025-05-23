"use client"
import { useEffect } from "react";
import SideBar from '../../components/messaging/SideBar'
import { useSelector, useDispatch } from 'react-redux'
import Image from "next/image";
import logoImg from '../../../public/assets/logo.png'
import { setOnlineUsers , setSocketConnection } from '../../store/slices/auth/authSlice'
import { connectSocket, disconnectSocket } from '../socket/socket'

const page = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token, backendUrl);

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <div className="w-[22%] bg-slate-100">
        <SideBar />
      </div>

      <div className="w-[78%] p-4 overflow-y-auto">
        <div className="flex flex-col items-center gap-5">
          <Image src={logoImg} alt="Logo" width={250} height={100} />
          <h2 className="text-gray-600 text-lg">{user?.name}, select your friend to chat</h2>
          <h2>{user?.email}</h2>
          <Image
            src={profile_pic}
            alt={`picture of ${user.name}`}
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
