import React from 'react';
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { logOut } from '../../store/slices/auth/authSlice';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'
import {store} from '../../store/store'
import { persistStore } from 'redux-persist';
import Image from 'next/image'
const SideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
 
 
  const logout = () => {
    dispatch(logOut()); 
    const persistor = persistStore(store); 
    persistor.purge();
    router.push("/");
  };
 
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="flex flex-col w-full sm:w-1/5 bg-slate-200 items-center justify-between">
        <div className="flex flex-col items-center">
          <Link href="/" className="bg-slate-200 hover:bg-slate-400 p-4 mb-4 rounded-md flex justify-center items-center">
            <BsChatDotsFill size={25} />
          </Link>
          <div title="Add friend" className="mb-4 flex justify-center items-center">
            <FaUserPlus size={30} />
        
          </div>
        </div>
        
        
        <div className="flex-grow"></div> 
        
        <div title="Logout" className="mb-4 flex justify-center items-center">
          <button>
            {/* <Image
              src=
              width={50}
              height={50}
              alt={user?.name}
            /> */}
          </button>
          <button 
            onClick={logout}
            className="p-2 rounded-md bg-slate-200 hover:bg-slate-400">
            <IoLogOut size={30} />
          </button>
        </div>
      </div>
      <div className="w-full sm:w-4/5 p-4">Messages</div>
    </div>
  );
};

export default SideBar;
