import { io, Socket } from "socket.io-client";
let socket = null;

export const connectSocket = (token, backendUrl) => {
 
  if (!token) {
    console.warn(" No token provided, not connecting socket yet.");
    return null; 
  }

  if (!socket || !socket.connected) {
    socket = io(backendUrl, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { authToken: token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Connected?", socket.connected); // should return true
    });

    socket.on("disconnect", (reason) => {
      console.warn(" Socket disconnected. Reason:", reason);
      console.log("Connected?", socket.connected); //should return  false
    });

    socket.on("connect_error", (err) => {
      console.error(" Connection error:", err.message);
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
  

console.log("hello this is socket in socket file;", socket)

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