
"use client"
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'
import { FaUserTie } from "react-icons/fa";
import { useRouter , usePathname } from 'next/navigation';
const LoginByPassword = () => {
    const router = useRouter(); 
    const path = usePathname();
    const [password, setPassword] = useState("")
console.log('path', path.state)
    const handleSubmit = async (e) => {
        e.preventDefault();
     
        try{
            const URL = process.env.NEXT_PUBLIC_BACK_END_URL
            const resp = await axios.post(`${URL}/users/loginPass`, {password} );
            toast.success(resp?.data?.message);
            console.log(resp);
            setPassword('');
            
            router.push('/dashboard')
        }catch(err){
            toast.error(err?.response?.data?.message)
        }
    }


  return (
    <div className="flex justify-center items-center w-screen">
      <div className="flex flex-col justify-center items-center mt-[5%] w-[30%] lg:w-[30%] p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col gap-4 items-center mt-3">
            <FaUserTie className="text-[50px] text-gray-500"/>
            <h1 className="text-lg font-semibold mb-4 text-primary">Welcome to chat-app</h1>
        </div>
        
        <form className="flex flex-col gap-4 w-full px-4" onSubmit={handleSubmit}>
          
            <input 
                name="password" 
                type="password" 
                value={password}
                placeholder="Password..."
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border rounded mb-3 text-gray-500 focus:outline-primary-dark bg-primary-light" 
                />

          <button 
            type="submit" 
            className="bg-primary text-white py-2 px-4 mb-4 rounded text-bold text-[20px]">
            Login
          </button>
        </form>
        <p className="text-gray-600 text-[16px] my-2">
          New User:   
          <Link href="/auth/register" className="text-primary"> Sign-up</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginByPassword
