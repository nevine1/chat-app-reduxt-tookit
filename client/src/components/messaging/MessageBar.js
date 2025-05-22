import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {connectSocket, disconnectSocket } from "../../app/socket/socket"
import { setOnlineUsers } from '@/store/slices/auth/authSlice';
const MessageBar = ({userId}) => {
  const { token , user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
console.log('messages user id is: ', user?._id)
  const backendUrl = "http://localhost:5000"

    useEffect(() => {
        
        if (!token) return;
    
        const socket = connectSocket(token, backendUrl);
    
        socket.on("onlineUsers", (users) => {
          console.log("Online users:", users);
          dispatch(setOnlineUsers(users));
        });
       console.log('connected socket in message pgae is:', socket)
      if (socket) {
        socket.emit("message-page", user?._id);
        socket.on("message-user", (data) => { //this data coming from socket/index.js (it is userDetails in socket)
          console.log("user details coming from socket server are:", data)
        })
        console.log('user id in message page is, ', user?._id)
      }
    
        return () => {
          disconnectSocket();
        };

    }, [token, user]);
  
 return (
    <div className="w-full bg-slate-100">
      <h1 className="text-center h-14 text-xl bg-slate-100 font-semibold">
        Chatting with User: {userId}
      </h1>
     {/* chat messages here ------------------ */}
     <p>
       Hello
       <span className="text-red-600 text-[25px] ">{user?.name}</span>
     </p>
    </div>
  );
};

export default MessageBar;
