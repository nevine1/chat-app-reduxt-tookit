"use client"
import { useState, useEffect, useRef } from 'react'; 
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import Image from 'next/image';
import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";
import moment from 'moment';
import Link from 'next/link';
import { setIsLoading } from '@/store/slices/auth/authSlice';
import uploadFile from '@/uploads/upload';
import AllMessages from './AllMessages';
const SendMessage = ({ userId, allMessages, currentMsg }) => {
    const [socket, setSocket] = useState(null);
    const backendUrl = "http://localhost:5000";
    const { user, token } = useSelector((state) => state.auth);
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({
        text: "",
        imageUrls: [],
        videoUrls: []
    });

    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null); 
   const [previewImageUrl , setPreviewImageUrl ] = useState('')
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [uploadedVideoUrls, setUploadedVideoUrls] = useState([]);

  

    // Handle image file selection and local preview
    const handleUploadImage = async (e) => {
       
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
      
        // Preview each selected image
        const localUrls = files.map(file => URL.createObjectURL(file));
        setUploadedImageUrls(prev => [...prev, ...localUrls]);
      
        // Store selected image files for upload
        setImageFile(prev => [...(prev || []), ...files]);
        
        e.target.value = '';
      
        setShowMediaOptions(false);
    };
      
    // Clear uploaded image
    const handleRemoveImage = (urlToRemove) => {
        setUploadedImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
        
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
        setUploadedVideoUrls((prev) => [...prev, localUrl]);
        setVideoFile(file);
    
        setLoading(true);
        const uploadedUrl = await uploadFile(file, token);
        console.log('uploading image url is:', uploadedUrl)
        setLoading(false);
    
      
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
                //console.log("Connected to Socket.IO:", newSocket.id);
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
            if (loading) return;
            if (!userId || !user?._id || !socket) return;
        
            const hasText = message.text.trim().length > 0;
            const hasImage = !!imageFile;
            const hasVideo = !!videoFile;
        
            if (!hasText && !hasImage && !hasVideo) return;
        
            setLoading(true);
            try {
                let uploadedImages = [];
                let uploadedVideos = [];
        
                if (hasImage && Array.isArray(imageFile)) {
                    for (const file of imageFile) {
                      const uploadedImageUrl = await uploadFile(file, token);
                      if (uploadedImageUrl) {
                        uploadedImages.push(uploadedImageUrl);
                      }
                    }
                  } else if (imageFile) {
                    const uploadedImageUrl = await uploadFile(imageFile, token);
                    if (uploadedImageUrl) {
                      uploadedImages.push(uploadedImageUrl);
                    }
                  }
        
                if (hasVideo) {
                    const uploadedVideoUrl = await uploadFile(videoFile, token);
                    if (uploadedVideoUrl) uploadedVideos.push(uploadedVideoUrl);
                }
        
                const msgToSend = {
                    sender: user._id,
                    receiver: userId,
                    text: message.text.trim(),
                    imageUrls: uploadedImages,
                    videoUrls: uploadedVideos,
                    msgByUserId: user._id,
                    createdAt: new Date().toISOString(),
                };
               
                console.log("📦 message to send:", msgToSend);
        
                socket.emit("new message", msgToSend);
                console.log('here is the final url for the sent image:', uploadedImageUrls)
                
                // Reset form
                setMessage({ text: "", imageUrls: [], videoUrls: [] });
                setImageFile(null);
                setVideoFile(null);
                setUploadedImageUrls([]);
                setUploadedVideoUrls([]);
        
            } catch (err) {
                console.error(" Failed to send message", err);
            } finally {
                setLoading(false);
            }
        };
        

        return (
            <div>
                <section className=" my-3 mx-2 p-3 bg-slate-300 h-[calc(100vh-17rem)] overflow-x-hidden overflow-y-scroll">

                    {/* all messages */}
                    <div className="flex flex-col">

                        <AllMessages
                            allMessages={allMessages}
                            message={message}
                            currentMsg={currentMsg}
                            />
                        
                        </div>

                </section>

                {/* send new message */}
            <section className="bg-white py-2 px-3 pr-4">

                <div className="flex flex-row sm:flex-row gap-2 w-full mt-3 ">
                  
                    <form className="flex flex-row gap-2 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-row gap-3 w-full">
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
                                                multiple
                                            onChange={handleUploadImage}
                                            className="hidden"
                                            accept="image/*" 
                                        />

                                        <input type="file"
                                            id="uploadVideo"
                                            onChange={handleUploadVideo}
                                            className="hidden"
                                            accept="video/*" 
                                        />
                                    </div>
                                )}
                            </div>
                            
                         <div className="flex flex-row gap-2 w-full border border-gray-200  rounded-sm p-2">
                            {uploadedImageUrls.length > 0 && (
                                <div className="flex flex-wrap gap-4 justify-start items-center p-2  relative">
                                    {uploadedImageUrls.map((url, index) => (
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
                                                multiple
                                                alt={`preview-${index}`}
                                                className="aspect-square w-16 h-16 object-cover rounded"
                                            />
                                        </div>
                                    ))}
                                </div>
                            
                            )}
                        
                            {uploadedVideoUrls.length > 0 && (
                                <div className="flex flex-wrap gap-4 justify-start items-center p-2 relative">
                       
                                    {uploadedVideoUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <IoMdCloseCircle
                                                size={20}
                                                onClick={() => clearUploadVideo(index)}
                                                className="absolute top-0 right-0 cursor-pointer text-blue-500 z-10"
                                            />
                            
                                            <video
                                                src={url} 
                                                className="aspect-square w-16 h-16 object-cover rounded"
                                                controls
                                                autoPlay
                                                muted
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex-auto w-full">

                                <input
                                    type="text"
                                    value={message.text}
                                    placeholder='Type your message'
                                    className="w-[100%] py-1 px-2 text-[15px] text-gray-500
                                       outline-none"
                                    onChange={handleTextMessage}
                                />
                            </div>   
                            </div>
                            

                            <div className="flex items-center">
                                <button type="submit" disabled={loading}> 
                                    <IoSend size={18} className="text-blue-500" />
                                </button>
                            </div>
                         </div>
                    </form>

                    </div>

                </section>
            </div>
        );
    };

export default SendMessage;