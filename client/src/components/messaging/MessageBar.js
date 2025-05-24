import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {connectSocket, disconnectSocket } from "../../app/socket/socket"
import { setOnlineUsers } from '@/store/slices/auth/authSlice';
import Image from 'next/image'
import { upperCase } from 'lodash';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";

const MessageBar = ({userId}) => {
  const { token } = useSelector(state => state.auth);
  const [chatUser, setChatUser ] = useState(null)
  const dispatch = useDispatch();
console.log('messages user id is: ', userId)
  const backendUrl = "http://localhost:5000"
const profilePic = chatUser?.profile_pic ? `/assets/${chatUser?.profile_pic}` : "/assets/flower.jpg"
    useEffect(() => {
        
        if (!token) return;
    
        const socket = connectSocket(token, backendUrl);
    
        socket.on("onlineUsers", (users) => {
          console.log("Online users:", users);
          dispatch(setOnlineUsers(users));
        });
      
      console.log('connected socket in message page is:', socket)
      
       if (socket) {
        socket.emit("message-page", userId); //  This is the ID being sent
        socket.on("message-user", (data) => {
          console.log("user details coming from socket server are:", data);
          setChatUser(data)
        });
         
        console.log("user id in message page is, ", userId);
      }
      
    
        return () => {
          disconnectSocket();
        };

    }, [token, userId]);
  console.log(" chatting user in message bar is: ", chatUser)
  
 return (
    <div className="w-full bg-white">
     
     <header className="sticky top-0 h-16 bg-white flex flex-row justify-between items-center">
       <div className="m-4 flex flex-row gap-1 items-center">
         <div className="text-red lg:hidden cursor-pointer">
           <FaAngleLeft size={25} />
         </div>
         <div className="relative m-4 flex flex-col  items-center">
           <Image
             alt="profile pic"
             src={profilePic}
             width={40} height={40}
             className="h-10 w-10 rounded-full"
           />
           {
             chatUser?.online &&  (
              <span className="absolute bg-green-500 p-1 -right-1  bottom-3 rounded-full"></span>
            )
           }
         </div>
           <div className="flex flex-col ">
             <h2 className="text-blue-700 font-semibold">{upperCase(chatUser?.name)}</h2>
             {
             chatUser?.online ? (
               <p className='text-[13px] text-green-600'>Online</p>
             ) : (
                 <p className='text-[13px] text-gray-400'>Offline</p>
             )
             
           }
           </div>
       </div>
       <div className="mr-2 cursor-pointer hover:text-green-600 ">
        <HiOutlineDotsVertical size={26} />
      </div>
     </header>


     {/* show all messages  */}
     <section className="h-[calc(100vh-128px)] bg-gray-500 overflow-x-hidden overflow-y-scroll">
       <h1>show all message</h1>
     </section>

     {/* send new message */}
     <section className="bg-white h-16 p-3">
       <h1>Send new message</h1>
     </section>
    </div>
  );
};

export default MessageBar;
