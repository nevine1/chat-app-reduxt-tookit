"use client";
import { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";

const SendMessage = ({ click, setClick }) => {
    const [showMediaOptions, setShowMediaOptions] = useState(false);
   const [uploadImage, setUploadImage ] = useState("")
    const [message, setMessage ] = useState({
        text: "", 
        imageUrL: "", 
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
        console.log("upload video")
    }
  return (
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
                  
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-5% flex flex-col gap-2 bg-slate-200 p-2 shadow rounded z-10">
            <label htmlFor="uploadImage" className="flex items-center gap-2 cursor-pointer hover:bg-white  rounded-sm">
              <AiFillPicture className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 hover:bg-white hover:text-blue-500 border hover:border-blue-500 transition" />
              <p className="text-[14px]">Image</p>
            </label>
            <label htmlFor="uploadVideo" className="flex items-center gap-2  rounded-sm cursor-pointer hover:bg-white ">
              <FaVideo className="bg-blue-500 text-white rounded-full p-2 w-7 h-7 hover:bg-white  hover:text-blue-500 border hover:border-blue-500 transition" />
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
  );
};

export default SendMessage;
