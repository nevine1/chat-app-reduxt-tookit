
"use client"
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'
import { FaUserTie } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { setIsLoading, 
  passwordLogin,
  setErrorMessage,
  setSuccessMessage,
  logOut  } from '../../store/slices/auth/authSlice.js';
  import { dispatch } from 'react-redux'
const LoginByEmail = () => {
    const router = useRouter();
    const [email, setEmail] = useState("")

    /* const handleSubmit = async (e) => {
        e.preventDefault();
     
        try{
            const URL = process.env.NEXT_PUBLIC_BACK_END_URL
            const resp = await axios.post(`${URL}/users/loginEmail`, {email} );
            toast.success(resp?.data?.message);

            if(resp?.data?.message){
              localStorage.setItem("email", email);
              localStorage.setItem("user", JSON.stringify(resp?.data?.data.user))
              setEmail('');
              router.push('/auth/password')
            }
                
            console.log(resp?.data?.data.user)
           
        }catch(err){
            toast.error(err?.response?.data?.message)
        }
    } */
    const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(setIsLoading(true));
      try {
        const URL = process.env.NEXT_PUBLIC_BACK_END_URL
        const response = await axios.post(``${URL}/users/loginEmail``, { email });
        dispatch(emailLogin(response.data)); 
      } catch (error) {
        dispatch(setErrorMessage(error.response?.data?.message || "Invalid email"));
      } finally {
        dispatch(setIsLoading(false));
      }
    };
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
            className="bg-primary text-white py-2 px-4 mb-4 rounded text-bold text-[20px]">
            Check Password
          </button>
        </form>
        <p className="text-gray-600 text-[16px] my-2">
          New User:   
          <Link href="/auth/register" className="text-primary"> SignUp</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginByEmail
