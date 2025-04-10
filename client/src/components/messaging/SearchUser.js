import { useState, useEffect  } from 'react'
import { IoIosSearch } from "react-icons/io";
import LoadingSpinner from './LoadingSpinner';
import SearchUserCard from './SearchUserCard';
import axios from 'axios'
import toast from 'react-hot-toast';
const SearchUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("")
  
  
  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const URL  = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/searchingUser`;
      const resp = await axios.post(URL, {
        searchQuery: search //search 
      }
      )

      setLoading(false)
      setSearchUser(resp?.data.data);
      toast.success(resp.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      console.log(error?.response?.data?.message);
    }
  }

 /*  useEffect(() => {
  if (search) {
    handleSearch();
  }
  }, [search]);  */
  
  /* useEffect(() => {
    
    setAllUsers(fetchAllUsers)
  }) */
console.log("search users are", allUsers)
  return (
    <div className="bg-gray-200 w-full">
      <div className="flex flex-row justify-center items-center">
      
        <input
          name="searchInput"
          placeholder='Search'
          className="rounded-full px-3 py-1 m-2 text-gray-500 text-[16px] focus:outline-red-400"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <IoIosSearch
          size="25"
          className="text-gray-500 cursor-pointer -ml-10 "
        />
      </div>
      { /* result of search users */}
      <div className="bg-white  p-3 m-3">
        {
          allUsers.length === 0 && !loading &&  (
            <span>No user found </span>
          )
        }
        {
          loading && (
            <div className="h-auto m-2 ">
              <div><LoadingSpinner/></div>
            </div>
          )
        }

        {
          allUsers.length !== 0 && !loading && (
            allUsers.map((user, index) => (
              <div key={index}
                className="m-4 "
                >
                <SearchUserCard user={user} />
              </div>
            ))
          )
        }
         
      </div>
    </div>
  )
}

export default SearchUser
