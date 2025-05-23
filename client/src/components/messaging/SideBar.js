/* import { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { persistStore } from "redux-persist";
import { store } from "../../store/store";
import { logOut } from "../../store/slices/auth/authSlice";
import Image from "next/image";
import UserSearchingPage from "./UserSearchingPage";

const SideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user , onlineUsers} = useSelector((state) => state.auth);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const profilePic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
  
  const logout = () => {
    dispatch(logOut());
    const persistor = persistStore(store);
    persistor.purge();
    router.push("/");
  };

  console.log('there is online users are', user)
  const isOnline =user?._id && onlineUsers.includes(user?._id)
  console.log('user id is: ', user?._id)
  return (
    <div className="flex  w-full items-center  h-full bg-slate-200">
      <div className="flex flex-col justify-between items-center mt-4 w-1/6 h-full">
        <div className="py-4 ">
          <FaUserPlus
            size={25}
            onClick={() => setOpenSearchBar(!openSearchBar)}
            className="cursor-pointer mb-4"
            title="Find friend" 
          />
          {openSearchBar && (

            <UserSearchingPage
              onClose={() => setOpenSearchBar(false)}
            />
          )}

        </div>

        <div className="mb-4 flex flex-col items-center">
          <div className="relative">
            <Image
              src={profilePic}
              width={35}
              height={35}
              alt={user?.name}
              className="rounded-full h-6 w-6"
            />
            {isOnline && (
              <span className='absolute bottom-1 -right-1 bg-green-500   rounded-full p-1'></span>
            )}
          </div>
          <button
            onClick={logout}
            className="p-2 mt-2 rounded-md bg-slate-200 hover:bg-slate-400 text-[15px]"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex bg-slate-100 w-5/6 h-full shadow-lg p-10">
        <h1>Messages</h1>
      </div>
    </div>
  );
};

export default SideBar; */



"use client"
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { persistStore } from "redux-persist";
import { store } from "../../store/store";
import { logOut } from "../../store/slices/auth/authSlice";
import Image from "next/image";
import UserSearchingPage from "./UserSearchingPage";

const SideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  const profilePic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";

  const logout = () => {
    dispatch(logOut());
    const persistor = persistStore(store);
    persistor.purge();
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-between items-center h-full py-4">
      <div className="flex flex-col items-center">
        <FaUserPlus
          size={25}
          onClick={() => setOpenSearchBar(true)}
          className="cursor-pointer mb-4"
          title="Find friend"
        />
        {openSearchBar && (
          <UserSearchingPage onClose={() => setOpenSearchBar(false)} />
        )}
      </div>

      <div className="mb-4 flex flex-col items-center">
        <div className="relative">
          <Image
            src={profilePic}
            width={35}
            height={35}
            alt={user?.name}
            className="rounded-full"
          />
          <span className="p-1 bg-green-300 absolute right-0 bottom-1"></span>
        </div>
        <button
          onClick={logout}
          className="p-2 mt-2 rounded-md bg-slate-200 hover:bg-slate-400 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;

