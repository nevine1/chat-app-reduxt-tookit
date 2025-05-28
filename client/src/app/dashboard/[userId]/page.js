"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import MessageBar from '@/components/messaging/MessageBar';
import SideBar from '@/components/messaging/SideBar';
const page  = () => {
  const { userId } = useParams(); 
  
    
    console.log(userId)
 return (
    <div className="flex flex-col sm:flex-row  /*h-[calc(100vh-5rem)] overflow-y-hidden */">
     <div className="w-full sm:w-1/5 md:w-2/5  bg-slate-100 shadow-md">
        <SideBar />
      </div>
      <div className="w-full sm:w-4/5 md:3/5 shadow-md m-2 rounded-sm /* h-[calc(100vh-5rem)] */">
        <MessageBar userId={userId} />
      </div>
    </div>
  );
};

export default page;