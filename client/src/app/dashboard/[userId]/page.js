"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import MessageBar from '@/components/messaging/MessageBar';
import SideBar from '@/components/messaging/SideBar';
const ChatPage  = () => {
    const { userId } = useParams(); 
    
    console.log(userId)
 return (
    <div className="flex h-screen">
      <div className="w-full sm:w-1/5 md:w-2/5 h-full bg-slate-100 shadow-md">
        <SideBar />
      </div>
      <div className="w-full sm:w-4/5 md:3/5 p-4 shadow-md">
        <MessageBar userId={userId} />
      </div>
    </div>
  );
};

export default ChatPage 