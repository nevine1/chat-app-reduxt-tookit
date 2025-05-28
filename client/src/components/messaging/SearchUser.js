import { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import LoadingSpinner from './LoadingSpinner';
import SearchUserCard from './SearchUserCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

let getAllUsers = null;
const SearchUser = ({ onClose }) => {
  const { onlineUsers, user } = useSelector(state => state.auth)
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const isOnline = onlineUsers.includes(user?._id)

  const fetchAllUsers = async () => {
  if (search.trim().length < 3) {
    toast.error("Search name should not be less than 3 characters");
    setAllUsers([]);
    return;
  }

  try {
    setLoading(true);
    const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/searchingUser`;
    const resp = await axios.post(URL, { searchQuery: search });

    if (resp.data.success) {
      setAllUsers(resp.data.data);
      
    } else {
      
      setAllUsers([]);
      //toast.error(resp.data.message || `${search} not found`);
    }

  } catch (error) {
    setAllUsers([]);
    toast.error(error?.response?.data?.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
      
    if (search.length >= 3) {
     
      getAllUsers = setTimeout(() => {
        fetchAllUsers();
      }, 500); 

    } else {

      setAllUsers([]);
    }
    
      return () => clearTimeout(getAllUsers);
      
  }, [search]); 


 

  return (
    <div className="bg-gray-300 w-[50%] mx-auto p-10 overflow-y-scroll rounded-md">
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-center items-center w-[60%]">
          <input
            name="searchInput"
            placeholder="Search"
            className="rounded-full px-4 py-3 m-2 w-full text-gray-500 text-[16px] focus:outline-gray-400"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <IoIosSearch
            size="25"
            className="text-gray-500 cursor-pointer -ml-10"
            onClick={fetchAllUsers}
          />
        </div>
        
          {!loading && search.length >= 3  && allUsers.length === 0 && (
            <span className="text-red-600">{search} not found</span>
        )}
        
         <div className={`flex flex-col items-center  ${allUsers.length > 0 ? " m-4 " : "bg-red-500 "}  `}>
         
          { !loading &&
            allUsers.map((user, index) => (
              <div key={index} className="mx-4 my-2 bg-white shadow-sm shadow-black rounded-md w-full">
                <SearchUserCard user={user} onClose={onClose}  />
              </div>
          
            
            ))}
        </div>
      </div>
      {/* {
        isOnline && <p>{user?.name} is <span className="text-red text-[30px]">online</span></p>
      } */}
      
    </div>
  );
};

export default SearchUser;
