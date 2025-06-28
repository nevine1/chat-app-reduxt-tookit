import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {connectSocket, disconnectSocket } from "../../app/socket/socket"
import { setOnlineUsers } from '@/store/slices/auth/authSlice';
import Image from 'next/image'
import { upperCase } from 'lodash';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import SendMessage from './SendMessage';

const MessageBar = ({userId}) => {
  const { token , user} = useSelector(state => state.auth);
  const [chatUser, setChatUser ] = useState(null)
  const dispatch = useDispatch();

  const [allMessages, setAllMessages] = useState([])
  const currentMsg = useRef(null)
  const backendUrl = "http://localhost:5000";
  
  const profilePic = chatUser?.profile_pic ? `/assets/${chatUser?.profile_pic}` : "/assets/flower.jpg"
  
  useEffect(() => {
      
        if (!token) return;
        const socket = connectSocket(token, backendUrl);
        socket.on("onlineUsers", (users) => {
          console.log("Online users:", users);
          dispatch(setOnlineUsers(users));
        });
      
      if (socket) {
         
          socket.emit("message-page", userId); //  This is the ID being sent
          socket.on("message-user", (data) => {
          console.log("user details coming from socket server are:", data);
          setChatUser(data)
          });
        
        //to see the sent and received messages 
        socket.on('message', (data) => {
          setAllMessages(data)
        })
        
      }
    
        return () => {
          disconnectSocket();
        };

    }, [token, userId]);
  
  
  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages]);

  //fetching of all messages ;
  
  const fetchMessages = async (senderId, userId, token) => {
    const res = await fetch(`http://localhost:5000/api/messages/${userId}?myId=${senderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    return data;
  };
  
  useEffect(() => {
    const loadMessages = async () => {
      const messages = await fetchMessages(user._id, userId, token);
      setAllMessages(messages); 
    };
  
    if (userId) {
      loadMessages();
    }
  }, [userId]);
  
console.log('hello here are all messages', allMessages)

 return (
    <div className="w-full ">
     
     <header className="sticky flex-none h-16 bg-white flex items-center justify-between px-4 border-b">
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
     
     <section className=" ">
       
       <SendMessage userId={userId} allMessages={allMessages} currentMsg={currentMsg}  />
     </section>
    </div>
  );
};

export default MessageBar;
