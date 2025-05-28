"use client"
import { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoSend } from "react-icons/io5";

const SendMessage = ({click, setClick}) => {
    
  return (
      <div className="flex flex-row sm:flex-row gap-2 w-full mt-3">
        
        <div className="flex flex-row gap-2">
              <button >
                  <FaPlus 
                      className="bg-blue-500 text-white rounded-full p-1 w-6 h-6
                        hover:text-blue-500 border hover:border-blue-500
                        hover:bg-white duration-200 transition-all "/>
            </button>
            <button>
                  <AiFillPicture
                      className="bg-blue-500 text-white rounded-full p-1 w-6 h-6
                      hover:text-blue-500 border hover:border-blue-500
                      hover:bg-white duration-200 transition-all "
                  />    
            </button>
          </div>
          <div className="">
              <input type="text"
                  className="bg-slate-200 rounded-full   w-[100%] border py-1 px-2 text-[15px] text-gray-500
                    border-blue-500 focus:border-blue-500 outline-none"
                  onChange={() =>setClick(false)}
              />  
             
          </div>
          <div className="flex  items-center">
              <button>
                  <IoSend
                      size={18}
                    className="text-blue-500 "
                    />
              </button>
              
          </div>
    </div>
  )
}

export default SendMessage
