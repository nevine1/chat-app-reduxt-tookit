import { useState } from 'react'
import { LuArrowUpLeft } from "react-icons/lu";
import SearchFriend from './SearchUser';

const MessageBar = () => {
    const [allUsers, setAllUsers ] = useState([])
  return (
      <div className="w-full bg-slate-100">
          <h1 className="flex  justify-center items-center b w-[100%]  h-14 text-[20px] bg-slate-100">
              Chat
          </h1>
          <div className="flex justify-center shadow-md py-1">
             {/*  <SearchFriend/> */}
          </div>
         {/*  <div className=" w-full">
              {
              allUsers.length === 0 && (
                  <div className="flex flex-col justify-center gap-4">
                        <div>
                              <LuArrowUpLeft size={30} />
                        </div> 
                          <div>
                              <p className="text-gray-500 text-[18px]">Explore to Chat </p> 
                          </div>
                           
                  </div>
              )

          }
          </div> */}

    </div>
  )
}

export default MessageBar
