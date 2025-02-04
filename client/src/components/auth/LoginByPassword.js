import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link'

const LoginByPassword = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser ] =  useState({});
    const [type, setType] = useState("password")

    //retrieve the email and userDetails 
    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);
    


const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";


 
console.log(user)
    const handleSubmit = async (e) => {
      e.preventDefault();
    try {
        const URL = process.env.NEXT_PUBLIC_BACK_END_URL;
        const resp = await axios.post(`${URL}/users/loginPass`, {
            email, // if email is not sending with request , it will not login
            password
        });

        toast.success(resp?.data?.message);
        console.log(resp);

        if (resp.data.token) {
            localStorage.setItem('token', resp.data.token);
        }

        setPassword('');
        router.push('/dashboard');
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
  };
  
  

    return (
        <div className="flex justify-center items-center w-screen">
            <div className="flex flex-col justify-center items-center py-5 mt-[5%] w-[30%] lg:w-[30%] p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-lg font-semibold mb-4 text-primary">Welcome {user.name} </h1>
                {
                    user && 

                    <Image 
                    src={profile_pic} 
                    alt="profile pic "
                    width={70}
                    height={70}
                    className="w-auto h-auto rounded-full"
                    priority
                />

                }
                
                <h1 className="text-md font-semibold mb-4 text-gray-700">Enter Your Password</h1>

                <form className="flex flex-col gap-4 w-full px-4" onSubmit={handleSubmit}>
                <div className="relative w-full mb-3">
                    <input 
                        type={type ? "password" : "text"}
                        value={password}
                        placeholder="Password..."
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border w-full rounded text-gray-500 focus:outline-primary-dark bg-primary-light pr-10" 
                    />
                    <span 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-[20px]"
                        onClick={() => setType(!type)}
                    >
                        {type ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                    <button type="submit" className="bg-primary text-white py-2 px-4 mb-3 rounded text-bold text-[20px]">
                        Login
                    </button>
                    <p className="text-[15px] text-primary mb-6 text-center">
                        <Link href="/auth/resetPassword" >Forgot password</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginByPassword;
