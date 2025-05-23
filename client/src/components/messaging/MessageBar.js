import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {connectSocket, disconnectSocket } from "../../app/socket/socket"
import { setOnlineUsers } from '@/store/slices/auth/authSlice';
const MessageBar = ({userId}) => {
  const { token } = useSelector(state => state.auth);
  const [chatUser, setChatUser ] = useState(null)
  const dispatch = useDispatch();
console.log('messages user id is: ', userId)
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
  
 return (
    <div className="w-full bg-slate-100">
      <h1 className="text-center h-14 text-xl bg-slate-100 font-semibold">
        Chatting with User: {chatUser?.name}
      </h1>
     {/* chat messages here ------------------ */}
     <p>
       ID is: 
       <span className="text-red-600 text-[25px] "> {chatUser?._id}</span>
     </p>
     <p>
       email is: 
       <span className="text-red-600 text-[25px] "> {chatUser?.email}</span>
     </p>
    </div>
  );
};

export default MessageBar;
