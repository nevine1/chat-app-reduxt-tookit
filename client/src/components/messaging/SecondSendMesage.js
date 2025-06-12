"use client";
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import Image from 'next/image';
import { IoMdCloseCircle } from "react-icons/io";
// import { connectSocket, disconnectSocket } from '../../app/socket/socket'; // You are using direct io, so these might not be necessary
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";
import moment from 'moment';
import { setIsLoading } from '@/store/slices/auth/authSlice';
import uploadFile from '@/uploads/upload';
const SendMessage = ({ userId, allMessages, currentMsg }) => {
    const [socket, setSocket] = useState(null);
    const backendUrl = "http://localhost:5000"; 
    const { user, token } = useSelector((state) => state.auth);
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({
        text: "",
        imageUrls: [ ], 
        videoUrls: [ ]  
    });

    const [imageFile, setImageFile] = useState(null); 
    const [videoFile, setVideoFile] = useState(null);
    const [previewImageUrl, setPreviewImageUrl] = useState([]); 
    const [previewVideoUrl, setPreviewVideoUrl] = useState([]); 

    // Ref for scrolling to the latest message
    const messagesEndRef = useRef(null);

    // Scroll to the bottom when new messages sent
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    // Handle image file selection and local preview
    const handleUploadImage = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
    
      const localUrl = URL.createObjectURL(file);
      setPreviewImageUrl((prev) => [...prev, localUrl]);
      setImageFile(file);
    
      setLoading(true);
      const uploadedUrl = await uploadFile(file, token);
      setLoading(false);
    
      if (uploadedUrl) {
          setMessage((prev) => ({
              ...prev, 
              imageUrls: [...prev.imageUrls, uploadedUrl]
         }));
        }
        //to hide add image and video option after selecting the image or video
        setShowMediaOptions(!showMediaOptions)
    };
    // Clear uploaded image
    const handleRemoveImage = (urlToRemove) => {
        setPreviewImageUrl((prev) => prev.filter((url) => url !== urlToRemove));
        
        setMessage((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
        }));
      };

    // Handle video file selection and local preview
    const handleUploadVideo = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
    
      const localUrl = URL.createObjectURL(file);
      setPreviewVideoUrl((prev) => [...prev, localUrl ]);
      setVideoFile(file);
    
      setLoading(true);
        const uploadedUrl = await uploadFile(file, token);
        console.log('uploading iamge url is:', uploadedUrl)
      setLoading(false);
    
      if (uploadedUrl) {
        setMessage((prev) => ({ ...prev, videoUrls: [...prev.videoUrls, uploadedUrl] }));
        }
        
        setShowMediaOptions(!showMediaOptions)
    };
    

    const clearUploadVideo = () => {
        setVideoFile(null);
        setPreviewVideoUrl([]);
        setMessage((prev) => ({ ...prev, videoUrl: [] })); // Clear videoUrl if any was set
    };

    // Socket.IO connection and event handling
    useEffect(() => {
        if (!token) return;

        const newSocket = io(backendUrl, {
            transports: ["websocket"],
            withCredentials: true,
            auth: { authToken: token },
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from Socket.IO");
        });

        newSocket.on("receive message", (data) => {
            console.log("New message received:", data);
         
        });
        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [token, backendUrl]); 

    const handleTextMessage = async (e) => {
        const textMsg = e.target.value;
        setMessage((prev) => ({
            ...prev,
            text: textMsg
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
          loading || 
          (!message.text.trim() && message.imageUrls.length === 0 && message.videoUrls.length === 0)
        ) return;
      
        //if (!userId || !user?._id || !socket) return;
       
        

        try {
            setLoading(true);
            const msgToSend = {
                sender: user._id,
                receiver: userId,
                text: message.text,
                imageUrls: [...message.imageUrls],  
                videoUrls: [...message.videoUrls],
                msgByUserId: user._id,
                createdAt: new Date().toISOString(),
            };
            console.log("new message to send: ", msgToSend)
          socket.emit("new message", msgToSend);
          console.log("Sent:", msgToSend);
      
          setMessage({ text: "", imageUrls: [], videoUrls: [] });
          setImageFile(null);
          setVideoFile(null);
          setPreviewImageUrl([]);
          setPreviewVideoUrl([]);
        } catch (err) {
          console.error(" Failed to send message", err);
        } finally {
          setLoading(false);
        }
      };
      

    // to see all messages when load the page; 
    useEffect(() => {
        if (user?._id) {
            setMessage(message)
        }
    }, [])

    return (
        <div>
            <section className=" my-3 mx-2 p-3 bg-slate-300 h-[calc(100vh-17rem)] overflow-x-hidden overflow-y-scroll">

                {/* all messages */}
                <div className="flex flex-col" /* ref={messagesEndRef} */ > 
                    {
                        allMessages.map((msg, index) => (
                            <div
                                key={index}
                                // The currentMsg ref should be handled by the parent component or within this component's useEffect for scrolling
                                 ref={index === allMessages.length - 1 ? currentMsg : null} // This ref is passed as a prop, better to manage scrolling internally
                                className={`flex flex-col max-w-fit py-1 px-4 m-2 rounded-lg shadow-sm
                                ${user?._id === msg.msgByUserId
                                        ? ' bg-blue-400  text-right self-end rounded-tr-none'
                                        : 'bg-gray-200 text-left self-start rounded-tl-none'
                                    }`}
                                    >
                                <div className="object-scale-down max-w-full md:max-w-[300px]">
                                    {
                                        msg?.imageUrl && ( 
                                            <Image
                                                src={msg?.imageUrl}
                                                width={150}
                                                height={150}
                                                alt="send image"
                                                className=" aspect-square w-[40%] h-[40%]  rounded-md bg-white  m-4 p-4"
                                            />
                                        )
                                    }
                                    {
                                        msg?.videoUrl && ( 
                                            <video
                                                src={msg?.videoUrl}
                                                className="aspect-square w-full object-scale-down h-full max-w-sm rounded-lg bg-white mt-8 m-4 p-4"
                                                controls
                                            />
                                        )
                                    }
                                </div>
                                {msg.text && <p className="text-white">{msg.text}</p>}


                                <p className="text-white text-xs mt-1">
                                    {moment(msg.createdAt).format("hh:mm A")}
                                </p>
                            </div>
                        ))
                    }
                </div>


            </section>


            {/* send new message */}
            <section className="bg-white py-2 px-3 pr-4">

            <div className="flex flex-row sm:flex-row gap-2 w-full mt-3 ">
                  
                 <form className="flex flex-row gap-2 w-full" onSubmit={handleSubmit}>

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
                                    <AiFillPicture className="bg-blue-500 text-white rounded-full p-1 w-6 h-6  border  " />
                                    <p className="text-[14px]">Image</p>
                                </label>
                                <label htmlFor="uploadVideo" className="flex items-center gap-2  rounded-sm cursor-pointer p-2 pl-3  transition-all duration-200 hover:bg-white ">
                                    <FaVideo className="bg-blue-500 text-white rounded-full p-2 w-7 h-7  border hover:border-blue-500 " />
                                    <p className="text-[14px]">Video</p>
                                </label>

                                <input type="file"
                                    id="uploadImage"
                                    onChange={handleUploadImage}
                                    className="hidden"
                                    accept="image/*" // Specify accepted file types
                                />

                                <input type="file"
                                    id="uploadVideo"
                                    onChange={handleUploadVideo}
                                    className="hidden"
                                    accept="video/*" // Specify accepted file types
                                />
                            </div>
                        )}
                        </div>
                        
                    {previewImageUrl.length > 0 && (
                    <div className="flex flex-wrap gap-4 justify-start items-center p-2 bg-pink-50 relative">
                        {previewImageUrl.map((url, index) => (
                        <div key={index} className="relative">
                            <IoMdCloseCircle
                            size={20}
                            onClick={() => handleRemoveImage(url)}
                            className="absolute top-0 right-0 cursor-pointer text-blue-500 z-10"
                            />
                            <Image
                            src={url}
                            width={60}
                            height={60}
                            alt={`preview-${index}`}
                            className="aspect-square w-16 h-16 object-cover rounded"
                            />
                        </div>
                        ))}
                        </div>
                            
                    )}
                        
                        {previewVideoUrl.length > 0 && (
                    <div className="flex flex-wrap gap-4 justify-start items-center p-2 bg-pink-50 relative">
                       
                     {previewVideoUrl.map((url, index) => (
                        <div key={index} className="relative">
                            <IoMdCloseCircle
                            size={20}
                            onClick={() => clearUploadVideo(index)}
                            className="absolute top-0 right-0 cursor-pointer text-blue-500 z-10"
                            />
                            
                           <video
                            src={previewVideoUrl} // Use previewVideoUrl for src here
                            className="aspect-square sticky bottom-0 w-[40%] object-scale-down h-[40%] max-w-sm rounded-lg bg-white mt-8  m-4 p-4"
                            controls
                            autoPlay
                            muted
                        />
                        </div>
                        ))}
                    </div>
                    )}
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
                        <button type="submit" disabled={loading}> {/* Disable button during upload */}
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