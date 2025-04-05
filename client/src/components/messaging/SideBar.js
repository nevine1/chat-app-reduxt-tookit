import { useState } from 'react';
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
import EditUserDetails from '../auth/EditUserDetails';
const SideBar = () => {
  const dispatch = useDispatch();
  const { user }  = useSelector((state) => state.auth)
  const router = useRouter();
  const [editUserOpen , setEditUserOpen ] = useState(false)
 
  const profilePic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";  
  
  const logout = () => {
    dispatch(logOut()); 
    const persistor = persistStore(store); 
    persistor.purge();
    router.push("/");
  };
 
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="flex flex-col w-full sm:w-1/6 bg-slate-200 items-center justify-between">
       
        <div className="flex flex-col items-center mx-3 mt-1">
          <Link href="/" className="bg-slate-200 hover:bg-slate-400 p-3 mb-2 rounded-md flex justify-center items-center">
            <BsChatDotsFill size={20} title="Chat" /> 
            
          </Link>
          <div title="Add friend" className="mb-4 flex justify-center items-center">
            <FaUserPlus size={25} />
        
          </div>
        </div>
        
        
        <div className="flex-grow"></div> 
        
        <div title="Logout" className="mb-4 flex flex-col items-center -mt-5">
          <button  onClick={() =>setEditUserOpen(true)}>
            <Image
              src={profilePic}
              width={35}
              height={35}
              alt={user?.name}
              className="rounded-full h-6 w-6"
              priority
              title={user?.name}
            />
          </button>
          <button 
            onClick={logout}
            className="p-2 rounded-md bg-slate-200 hover:bg-slate-400">
            <IoLogOut size={30} />
          </button>
        </div>
      </div>
      { /* edit user details */}
      {
        editUserOpen &&
        
        <EditUserDetails onClose={() =>setEditUserOpen(false)}  user={user} /> 
      }
    </div>
  );
};

export default SideBar;
