import { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import LoadingSpinner from './LoadingSpinner';
import UserSearchResult from './UserSearchResult';
const SearchFriend = () => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading ] = useState(true)
  return (
    <div className="bg-gray-200 w-full">
      <div className="flex flex-row justify-center items-center">
      
        <input
          name="search"
          placeholder='Search'
          className="rounded-full px-3 py-1 m-2 text-gray-500 text-[16px] focus:outline-red-400"
          
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
