import { io, Socket } from "socket.io-client";

let socket = null;


export const connectSocket = (token, backendUrl) => {
    if (!socket) {
      socket = io(backendUrl, {
        withCredentials: true,
        transports: ["websocket"],
        auth: { authToken: token },
      });
  
      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
      });
  
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }
  
    return socket;
  };
  
 
  
  export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
};
  


/*  useEffect(() => {
 
      if (!token) return; 

        const newSocket = io(backendUrl, {
            withCredentials: true,
            transports: ["websocket"],
            auth: {
            authToken: token,
                },
        });

      setSocket(newSocket);
      

        newSocket.on("connect", () => {
            console.log("Socket connected id is: ", newSocket.id);
        });
      
        console.log('connected socket is :', socket)
      
        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
       
        newSocket.on("onlineUsers", (users) => {
            console.log(" Online users received:", users);
            dispatch(setOnlineUsers(users));
        });
        dispatch(setSocketConnection(newSocket))
    
    
  return () => {
    newSocket.disconnect();
    setSocket(null)
    };
    
}, [token]); */