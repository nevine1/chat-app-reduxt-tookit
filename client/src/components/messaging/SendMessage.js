"use client";
import { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import Image from 'next/image'
const SendMessage = () => {
    const [click , setClick ] = useState(true)
    const [showMediaOptions, setShowMediaOptions] = useState(false);
   const [uploadImage, setUploadImage ] = useState("")
    const [message, setMessage ] = useState({
        text: "", 
        imageUrl: "", 
        videoUrl:""
    })
    const handleUploadImage = (e) => {
        const file = e.target.files?.[0] || null; 
        setUploadImage(file)
        setMessage((prev) => ({
          ...prev,
          imageUrL: file || "",
        }));
    }
    const handleUploadVideo = (e) => {
      const file = e.target.files?.[0] || null; 
      setUploadImage(file)
      setMessage((prev) => ({
        ...prev,
        videoUrl: file || "",
      }));
  }
  console.log(message.imageUrl)
  return (
    
    <div >
      {/* show all messages  */}
       <section className=" my-3 mx-2 p-3 bg-slate-300 h-[calc(100vh-17rem)] overflow-x-hidden overflow-y-scroll">
        {
          message.imageUrl && (
            <div className="flex flex-col justify-center items-center bg-pink-50">
          <Image
            src={message.imageUrl}
            width={150}
                height={150}
                alt="send image"
            className="rounded-md bg-white w-40 h-40  m-4 p4"
          />
        </div>
          )
        }
          
       <h1>Show messsages</h1>
     
      </section>
      


      {/* send new message */}
      <section className="bg-white py-2 px-3 pr-4">
       {
         click && (
           <p className="text-gray-500 text-[15px]">Send message </p>
         )
        }
        
    <div className="flex flex-row sm:flex-row gap-2 w-full mt-3 ">
      
      {/* Plus Button with Dropdown */}
      <div className="relative">
        <button type="button" onClick={() => setShowMediaOptions(!showMediaOptions)}>
          <FaPlus
            className="bg-blue-500 text-white rounded-full p-1 w-6 h-6
              hover:text-blue-500 border hover:border-blue-500
              hover:bg-white duration-200 transition-all cursor-pointer"
          />
        </button>

        {/* Dropdown icons above the plus */}
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
                      />
             <input type="file"
                id="uploadVideo"   
                 onChange={handleUploadVideo}         
                />         
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex-auto">
        <input
          type="text"
          className="bg-slate-200 rounded-full w-full border py-1 px-2 text-[15px] text-gray-500
          border-blue-500 focus:border-blue-500 outline-none"
          onChange={() => setClick(false)}
        />
      </div>

      {/* Send Button */}
      <div className="flex items-center">
        <button>
          <IoSend size={18} className="text-blue-500" />
        </button>
      </div>
      </div>
      
      </section>
    </div>
  );
};

export default SendMessage;
