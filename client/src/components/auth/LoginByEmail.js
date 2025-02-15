
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'
import { FaUserTie } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { 
  setIsLoading, 
  setErrorMessage,
  setSuccessMessage,
  emailToLogin,
  } from '../../store/slices/auth/authSlice.js';
  import { useDispatch, useSelector } from 'react-redux'
  import store from '../../store/store.js'
const LoginByEmail = () => {
  const {isLoading, error, successMessage, errorMessage, user} = useSelector((state) => state.auth)
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("")
    
    const handleSubmit = async (e) => {

      e.preventDefault();
      dispatch(setIsLoading(true));
    
      try {

        const URL = process.env.NEXT_PUBLIC_BACK_END_URL;
        const response = await axios.post(`${URL}/users/loginEmail`, { email });
    
        if (response.status !== 200) {
            throw new Error("API did not return success"); 
        }
    
        dispatch(setErrorMessage("")); // Clear previous errors
        dispatch(setSuccessMessage("Email verified! Proceed to password login"));
        dispatch(emailToLogin(response.data.data.user.email));
        router.push("/auth/password")
        } catch (error) {
            console.log("Caught Error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            dispatch(setErrorMessage(errorMsg));
            toast.error(errorMsg);
    
    
      } finally {
        dispatch(setIsLoading(false));
      }
    };
   useEffect(() =>{
    console.log(user)
   }, []) 
  return (
    <div className="flex justify-center items-center w-screen">
      <div className="flex flex-col justify-center items-center mt-[5%] w-[30%] lg:w-[30%] sm:w-[50%] p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col gap-4 items-center mt-3">
            <FaUserTie className="text-[50px] text-gray-500"/>
            <h1 className="text-lg font-semibold mb-4 text-primary">Welcome to chat-app</h1>
        </div>
        
        <form className="flex flex-col gap-4 w-full px-4" onSubmit={handleSubmit}>
          
          <input 
            name="email" 
            type="email" 
            placeholder="Email..." 
          
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded mb-3 text-gray-500 focus:outline-primary-dark bg-primary-light" 
            autoComplete="off"
            />

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary text-white py-2 px-4 mb-4 rounded text-bold text-[20px]">
            { isLoading ? "Loading" : "Let's Check Password" }
          </button>
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>} 
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <p className="text-gray-600 text-[16px] my-2">
          New User:   
          <Link href="/auth/register" className="text-primary"> SignUp</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginByEmail
