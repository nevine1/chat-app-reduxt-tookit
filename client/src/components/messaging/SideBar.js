
"use client"
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { persistStore } from "redux-persist";
import { store } from "../../store/store";
import { logOut } from "../../store/slices/auth/authSlice";
import Image from "next/image";
import UserSearchingPage from "./UserSearchingPage";
import Link from 'next/link'
const SideBar = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [allUsers, setAllUsers ] = useState([])
  const profilePic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
console.log("hello here is all users:", allUsers)
  const logout = () => {
    dispatch(logOut());
    const persistor = persistStore(store);
    persistor.purge();
    router.push("/");
  };
  const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users`;
  //console.log(`backend url is: `, URL)
  //getting all users when log in to ur chat page
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/fetchAllUer`;
      const resp = await fetch('http://localhost:5000/api/users/fetchAllUer');
  
      const data = await resp.json();
  
      console.log('data is : ', data)
      if (resp.data.success) {
        setAllUsers(resp.data.data);
        
      } else {
        
        setAllUsers([]);
      }
  
    } catch (error) {
      setAllUsers([]);
      console.log( "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/fetchAllUer");
        const data = await res.json();
        console.log("All users:", data.data);
        setAllUsers(data.data)
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
  
    fetchUsers();
  }, []);
  
  return (
    <div className="flex flex-row bg-blue-300 h-full ">
      <div className="flex flex-col p-4 sm:p-5 sm:w-[40px] justify-between items-center h-full bg-slate-300 py-3">
        <div className="flex flex-col items-center ">
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
      <div className="mt-4">
       
        {
          allUsers.length > 0 &&
          allUsers.map(user => (
            <div key={user._id}>
              <Link
                href={`/dashboard/${user._id}`}  
                className="text-[17px] text-gray-600 py-2 pl-4"
              >
                {user.name}
              </Link>
            </div>
          ))
        }
      </div>
    </div>
    
  );
};

export default SideBar;

