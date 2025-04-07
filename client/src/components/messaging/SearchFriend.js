import { useState, useEffect  } from 'react'
import { IoIosSearch } from "react-icons/io";
import LoadingSpinner from './LoadingSpinner';
import UserSearchResult from './UserSearchResult';
import axios from 'axios'
import toast from 'react-hot-toast';
const SearchFriend = () => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput ] = useState("")
  
  const handleSearch = async () => {
    try {
      const URL  = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/searchingUser`;
      const resp = await axios.post(URL, {
        search: search
      }
      )

      setSearchInput(resp?.data.data);
      toast.success(resp.data.message)
    } catch (error) {
      toast.error(error?.resp?.data?.error)
    }
  }

  useEffect(() => {
    handleSearch();
  }, [])
  return (
    <div className="bg-gray-200 w-full">
      <div className="flex flex-row justify-center items-center">
      
        <input
          name="searchInput"
          placeholder='Search'
          className="rounded-full px-3 py-1 m-2 text-gray-500 text-[16px] focus:outline-red-400"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <IoIosSearch
          size="25"
          className="text-gray-500 cursor-pointer -ml-10 "
        />
      </div>
      { /* result of search users */}
      <div className="bg-white  p-3 m-3">
        {
          searchUser.length === 0 && !loading &&  (
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
          searchUser.length !== 0 && !loading && (
            searchUser.map((user, index) => (
              <div key={index}>
                <UserSearchResult/>
              </div>
            ))
          )
        }
         
      </div>
    </div>
  )
}

export default SearchFriend
