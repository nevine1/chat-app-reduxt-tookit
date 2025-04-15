import { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import LoadingSpinner from './LoadingSpinner';
import SearchUserCard from './SearchUserCard';
import axios from 'axios';
import toast from 'react-hot-toast';

let debounceTimeout = null;
const SearchUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAllUsers = async () => {
    try {

      setLoading(true);
      const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/searchingUser`;
      const resp = await axios.post(URL, { searchQuery: search });
      
      setAllUsers(resp?.data.data);
      toast.success(resp.data.message);
    } catch (error) {

      toast.error(error?.response?.data?.message || "An error occurred");
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (search.length >= 3) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        fetchAllUsers();
      }, 500); // debounce delay
    } else {
      setAllUsers([]);
    }

    // Cleanup on unmount
    return () => clearTimeout(debounceTimeout);
  }, [search]);


 
  
  return (
    <div className="bg-gray-300 w-[50%] mx-auto p-10 overflow-y-scroll rounded-md">
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-center items-center">
          <input
            name="searchInput"
            placeholder="Search"
            className="rounded-full px-3 py-2 m-2 text-gray-500 text-[16px] focus:outline-gray-400"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <IoIosSearch
            size="25"
            className="text-gray-500 cursor-pointer -ml-10"
            onClick={fetchAllUsers}
          />
        </div>
          {!loading && allUsers.length === 0 && search.length >= 3 && (
            <span className="text-red-600">No user found</span>
          )}
                  <div className={`${allUsers.length > 0 ? " m-3 p-5 " : "bg-red-500 "}  `}>
         
          { !loading &&
            allUsers.map((user, index) => (
              <div key={index} className="mx-4 my-2 bg-white rounded-md w-full">
                <SearchUserCard user={user} />
              </div>
          
            
            ))}
        </div>
      </div>

      
    </div>
  );
};

export default SearchUser;
