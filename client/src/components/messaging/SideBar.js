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
//import EditUserDetails from '../auth/EditUserDetails';
import MessageBar from './MessageBar';
import UserSearchingPage from './UserSearchingPage';
const SideBar = ({onSelectUser}) => {
  const dispatch = useDispatch();
  const { user }  = useSelector((state) => state.auth)
  const router = useRouter();
  //const [editUserOpen , setEditUserOpen ] = useState(false)
  const [ openSearchBar, setOpenSearchBar ] = useState(false)
  const profilePic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";  
   const [selectedUserId, setSelectedUserId ] = useState(null)
  const logout = () => {
    dispatch(logOut()); 
    const persistor = persistStore(store); 
    persistor.purge();
    router.push("/");
  };
 
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-slate-100">
      
      <div className="flex flex-col w-full sm:w-1/6 h-fll bg-slate-200 items-center justify-between">
        <div className="flex flex-col items-center mx-3 mt-1">
          <Link href="/" className="bg-slate-200 hover:bg-slate-400 p-3 mb-2 rounded-md flex justify-center items-center">
            <BsChatDotsFill size={20} title="Chat" /> 
          </Link>
          <div title="Find friend" className="mb-4 flex justify-center items-center">
              <FaUserPlus size={25}
              onClick={() => setOpenSearchBar(!openSearchBar)} 
                className="cursor-pointer"
              />
          </div>

          {openSearchBar && (
            <div >
              <UserSearchingPage onClose={() => setOpenSearchBar(!openSearchBar)}
                onSelectUser={selectedUserId}
              />
            </div>
          )}
        </div>
        
        
        
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
      

      <div className="w-full sm:w-4/5 md:3/5 p-4 shadow-md">
        {selectedUserId ? (
          <MessageBar selectedUserId={selectedUserId} />
        ) : (
          <div className="flex flex-col gap-5 justify-center items-center min-h-screen pb-24 mb-20">
            {/* <Image src={logoImg} alt="Logo" width={250} height={100} /> */}
            <h2 className="text-gray-600 text-[18px]">
              {user?.name}, you can select your friend to start chatting here.
            </h2>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default SideBar;
