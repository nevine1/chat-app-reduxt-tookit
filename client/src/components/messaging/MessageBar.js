import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const MessageBar = ({userId}) => {
  const { socketConnection } = useSelector(state => state.auth);
 return (
    <div className="w-full bg-slate-100">
      <h1 className="text-center h-14 text-xl bg-slate-100 font-semibold">
        Chatting with User: {userId}
      </h1>
      {/* chat messages here ------------------ */}
    </div>
  );
};

export default MessageBar;
