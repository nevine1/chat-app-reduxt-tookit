import { useState } from 'react'


const MessageBar = ({selectedUserId}) => {
    
  return (
      <div className="w-full bg-slate-100">
          <h1 className="flex  justify-center items-center b w-[100%]  h-14 text-[20px] bg-slate-100">
              Chat
          </h1>
             <h1 className="text-xl p-4 text-center">Chatting with User ID: {selectedUserId}</h1>

    </div>
  )
}

export default MessageBar
