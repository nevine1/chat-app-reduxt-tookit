import React from 'react'
import { IoMdCloseCircle } from "react-icons/io"; 
import Image from 'next/image';
const EditUserDetails = ({ user, onClose }) => {
    const profilePic = user?.profile_pic ? `/assets/{user?.profile_pic}` : "/assets/flower.jpg"
  return (
      <div className="fixed top-0 right-0 left-0 bottom-0 bg-gray-700 bg-opacity-70  flex  justify-center items-center">
          <div className="fixed top-5 right-5 text-blue-800">
              <IoMdCloseCircle size={30} onClick={onClose} />
          </div>
          <div className="bg-white p-8 rounded-md">
              <h1 className="font-bold ">Profile Details</h1>
              <p>Edit user details:</p>
              <form className="flex flex-col gap-4 w-full px-4" onSubmit={handleSubmit}>
                        <input 
                          name="name" 
                          type="text" 
                          value={data.name}
                          onChange={handleChange}
                          className="p-3 border rounded mb-3 text-gray-500 text-[16px] focus:outline-primary-dark bg-primary-light" 
                          placeholder="Name..." 
                          
                          />
                        <input 
                          name="email" 
                          type="email" 
                          placeholder="Email..." 
                          value={data.email}
                          onChange={handleChange}
                          className="p-3 border rounded mb-3 text-gray-500 focus:outline-primary-dark bg-primary-light" 
                          autoComplete="off"
                          />
              
                        <div className="flex flex-col p-4 mb-3 border hover:border-primary-light
                                cursor-pointer bg-primary-light">
                          <label htmlFor="profile_pic" className="text-gray-500">
              
                            <div className="flex flex-row justify-between ">
              
                              <p className="flex flex-row gap-4">
                                { uploadPhoto ? uploadPhoto?.name : "Upload profile photo"}
                              </p>
              
                              {
                                uploadPhoto?.name && 
              
                                  <IoClose 
                                    onClick={handlePhotoClear}
                                    className="hover:text-red-500 cursor-pointer text-[21px] "
                                  />
                                
                              }
                              
                            </div>
                          </label>
              
                          <input
                            id="profile_pic"
                            name="profile_pic"
                            type="file"
                            onChange={handleUploadPhoto}
                            className="hidden bg-primary-light rounded"
                            autoComplete="off"
                              />
                        </div>
              
                        <input 
                          name="password" 
                          type="password" 
                          value={data.password}
                          placeholder="Password..."
                          autoComplete="new-password"
                          onChange={handleChange}
                          className="p-3 border rounded mb-3 text-gray-500 focus:outline-primary-dark bg-primary-light" 
                          />
              
                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-primary text-white py-3 px-4 mb-4 rounded text-bold text-[20px]">
                          { isLoading? "Loading..."  : "Register"}
                        </button>
                      </form>
              
          </div>
    
    </div>
  )
}

export default EditUserDetails
