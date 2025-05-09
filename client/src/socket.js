import { useEffect, useState } from "react";
import { io } from "socket.io-client"
import { useSelector } from "react-redux";

const backendUrl = process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost:5000";
const { user} = useSelector((state) => state.auth);

export const socket = io(backendUrl, {

    withCredentials: true,
    
    auth: {
        authToken: user.authToken, // replace with actual token
    }
});

/* useEffect(() => {
    
    const connectSocket = () => {
            
            if (user?.authToken && backendUrl) {
                const newSocket = io(backendUrl, {
                    auth: {
                        authToken: user.authToken, // Use the authToken from  Redux store
                    },
                    transports: ['websocket'] // Explicitly try WebSocket first
                });

                setSocket(newSocket);

                newSocket.on(`onlineUser`, (data) => {
                    console.log("Online Users:", data);
                    dispatch(setOnlineUsers(data))
                });

                newSocket.on('connect_error', (error) => {
                    console.error("Socket connection error:", error);
                });

                newSocket.on('disconnect', () => {
                    console.log("Socket disconnected");
                });
            }
        };

        
        const timer = setTimeout(connectSocket, 500);

        return () => {
            clearTimeout(timer); // Clear the timeout if the component unmounts
            if (socket) {
                socket.disconnect();
            }
        };
      
    }, [user?.authToken, backendUrl, dispatch]); 

    useEffect(() => {
        console.log('online users are:', onlineUsers)
    }, [onlineUsers]) */