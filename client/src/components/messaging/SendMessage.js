"use client";
import { useState, useEffect } from 'react'
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import Image from 'next/image'
import { IoMdCloseCircle } from "react-icons/io";
import { connectSocket, disconnectSocket } from '../../app/socket/socket'
import { useSelector } from 'react-redux'
import { io, Socket } from "socket.io-client";
import moment from 'moment';
const SendMessage = ({ userId , allMessages}) => {
    const [socket, setSocket] = useState(null);
    const backendUrl = "http://localhost:5000"
    const { user, token } = useSelector((state) => state.auth)
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [loading, setLoading ] = useState(false)
    const [message, setMessage ] = useState({
      text: "", 
      imageUrl: "", 
      videoUrl:""
  })

  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile ] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null)
  const [receivedMsg, setReceivedMsg] = useState("");
  
  
  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
  
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    setMessage((prev) => ({ ...prev, imageUrl: url }));

    setShowMediaOptions(false)
    return () => URL.revokeObjectURL(url);
  }, [file]);
  
  //  Handle image file selection
  const handleUploadImage = (e) => {
    setLoading(true)
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile); 
    setLoading(false)
  };
  
  // Clear uploaded image
  const clearUploadImage = () => {
    setFile(null); 
    setMessage((prev) => ({ ...prev, imageUrl: '' }));
  };

  useEffect(() => {
    if (!videoFile) {
      setPreviewVideoUrl('');
      return;
    }
  
    const url = URL.createObjectURL(videoFile);
    setPreviewVideoUrl(url);
    setMessage((prev) => ({ ...prev, videoUrlUrl: url }))

    setShowMediaOptions(false)
 
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);
 
  const handleUploadVideo = (e) => {
    const selectedVideoFile = e.target.files?.[0] || null;
    setVideoFile(selectedVideoFile); 
  };
  
 
  const clearUploadVideo = () => {
    setVideoFile(null); 
    setMessage((prev) => ({ ...prev, videoUrlUrl: '' }));
  };
   
  /* sending message */
  
  useEffect(() => {
    if (!token) return;

    const newSocket = io(backendUrl, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { authToken: token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(" Connected:", newSocket.id)
    });

    newSocket.on("disconnect", () => {
      console.log(" Disconnected");
    });

    // Listen for messages
    newSocket.on("receive message", (data) => {
      console.log("The new message is :", data);
      setReceivedMsg(data.text || "Media message received");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  const handleTextMessage = (e) => {
    const textMsg = e.target.value; 
    setMessage((prev) => ({
      ...prev, 
      text: textMsg
    }))
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socket) {
        socket.emit('new message', {

          sender: user?._id, 
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,

        })

        setMessage({ text: "", imageUrl: "", videoUrl: "" });
        setFile(null);
        setVideoFile(null);
        setPreviewUrl("");
        setPreviewVideoUrl("");
      }
    }
    
  }

  return (
    
    <div >
     
      <section className=" my-3 mx-2 p-3 bg-slate-300 h-[calc(100vh-17rem)] overflow-x-hidden overflow-y-scroll">
        
        {/* { upload image file } */}
       {message.imageUrl && (
          <div className="flex flex-col justify-center gap-3 items-center bg-pink-50 relative">
            <div className="absolute top-1 cursor-pointer text-blue-500">
              <IoMdCloseCircle size={22}
                onClick={clearUploadImage}
              />
            </div>

              <Image
                /* src={previewUrl}  use this previewUrl for src  or message.imageUrl */
                src={message.imageUrl}
                width={150}
                height={150}
                alt="send image"
                className=" aspect-square w-full h-full rounded-md bg-white  m-4 p-4"
              />
          </div>
        )}
          
        
        {/* upload video file */}

        {previewVideoUrl && (
          <div className="flex flex-col justify-center gap-3 items-center bg-pink-50 relative">
            <div className="absolute top-1 cursor-pointer text-blue-500">
              <IoMdCloseCircle size={22}
                onClick={clearUploadVideo}
              />
            </div>
            <video
              src={previewVideoUrl}
              className="aspect-square w-full object-scale-down h-full max-w-sm rounded-lg bg-white mt-8  m-4 p-4"
              controls
              autoPlay
              muted
            />
          </div>
        )}

        {/* all messages */}
        <div>
          {
            allMessages.map((msg, index) => (
              <div key={index} className="flex flex-col gap-2 bg-white py-1 px-3 m-2 rounded-sm shadow-sm"> 
                <h1>{msg.text}</h1>
                <p className="text-gray-500 text-xs ml-auto w-fit">{moment(msg.cratedAt).format("hh:mm dd")}</p>
              </div>
            ))
          }
        </div>
       
     
      </section>
      


      {/* send new message */}
    <section className="bg-white py-2 px-3 pr-4">
        
    <div className="flex flex-row sm:flex-row gap-2 w-full mt-3 ">
      
      {/* Plus Button with Dropdown for sending images and videos */}
      <div className="relative">
        <button type="button" onClick={() => setShowMediaOptions(!showMediaOptions)}>
          <FaPlus
            className="bg-blue-500 text-white rounded-full p-1 w-6 h-6
              hover:text-blue-500 border hover:border-blue-500
              hover:bg-white duration-200 transition-all cursor-pointer"
          />
        </button>
            
            {showMediaOptions && (
                  
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-5% flex flex-col gap-1 bg-slate-200 p-2 shadow rounded z-10">
            <label htmlFor="uploadImage" className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-white p-2 pl-3 rounded-sm">
              <AiFillPicture className="bg-blue-500 text-white rounded-full p-1 w-6 h-6  border  " />
              <p className="text-[14px]">Image</p>
            </label>
            <label htmlFor="uploadVideo" className="flex items-center gap-2  rounded-sm cursor-pointer p-2 pl-3  transition-all duration-200 hover:bg-white ">
              <FaVideo className="bg-blue-500 text-white rounded-full p-2 w-7 h-7  border hover:border-blue-500 " />
              <p className="text-[14px]">Video</p>
                </label>
                
             <input type="file"
                 id="uploadImage"   
                  onChange={handleUploadImage} 
                 className="hidden" 
                />
                
             <input type="file"
                id="uploadVideo"   
                  onChange={handleUploadVideo} 
                 className="hidden" 
                />         
          </div>
        )}
      </div>

          {/* messages input field*/}
      <form className="flex flex-row gap-2 w-full" onSubmit={handleSubmit}>
        <div className="flex-auto">
          <input
                type="text"
                value={message.text}
                placeholder='Type your message'
              className="bg-slate-200 rounded-full w-full border py-1 px-2 text-[15px] text-gray-500
            border-blue-500 focus:border-blue-500 outline-none"
            onChange={handleTextMessage}
          />
        </div>
        
        <div className="flex items-center">
          <button type="submit">
            <IoSend size={18} className="text-blue-500" />
          </button>
        </div>
      </form>
     
      </div>
      
      </section>
    </div>
  );
};

export default SendMessage;
