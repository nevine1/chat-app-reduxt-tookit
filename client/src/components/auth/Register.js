"use client"
import { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { registerNewUser, setIsLoading, setSuccessMessage, setErrorMessage } from '../../store/slices/auth/authSlice';
import { useDispatch , useSelector } from 'react-redux';

const Register = () => { 
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, successMessage, errorMessage } = useSelector((state) => state.auth);
  const [data, setData ] = useState({
    name: "", 
    email: "", 
    profile_pic: "", 
    password: ""
  })
  const [uploadPhoto, setUploadPhoto] = useState("");

  const handleChange = (e) => {
    const { name, value }= e.target;
    setData((prev) => (
      { ...prev, [name] : value }
    )
    )}
    
    const handleUploadPhoto = (e) => {
      const file = e.target.files?.[0] || null; 
      setUploadPhoto(file);
      setData((prev) => ({
        ...prev,
        profile_pic: file?.name || "",
      }));
    };
    const handlePhotoClear = (e) =>{
      e.stopPropagation();
      setUploadPhoto(null)
  }
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    e.stopPropagation()
 
  
    const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/register`;

    try{
      const resp = await axios.post(URL, data); 
      console.log( " response is:" , resp)
      dispatch(registerNewUser(resp.data.data))
      dispatch(setSuccessMessage(resp?.data?.message))
      toast.success(resp?.data?.message)
      dispatch(setIsLoading(false))
      
     
        router.push('/auth/email');
      
          
    } catch (err) {
      console.log("Registeration error is:", err)
      dispatch(setErrorMessage(err.response?.data?.message || "Registration failed"));
      toast.error(err?.response?.data?.message  || "Something went wrong")
        dispatch(setIsLoading(false));
     
  
    }
  }
  return (
    <div className="flex justify-center items-center w-screen">
      <div className="flex flex-col justify-center items-center mt-[5%] sm:w-[60%]  lg:w-[30%] p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-lg font-semibold mb-4 text-primary">Welcome to chat-app </h1>
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
        <p className="text-gray-600 text-[16px] my-2">
          Already have account:   
          <Link href="/auth/email" className="text-primary"> Login</Link>
        </p>
      </div>
    </div>


  )
}

export default Register
