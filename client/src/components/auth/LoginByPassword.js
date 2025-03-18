import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link'
import { setIsLoading, 
    setErrorMessage,
    setSuccessMessage,
    passwordToLogin
 } from '../../store/slices/auth/authSlice.js';
    import { useDispatch, useSelector } from 'react-redux'
    import store from '../../store/store.js'

const LoginByPassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
    //const [user, setUser ] =  useState({});
    const [type, setType] = useState("password")
    const {isLoading,  successMessage, errorMessage, user, token } = useSelector((state) => state.auth)
    console.log(user)
    
    const profile_pic = user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg";
    const storedEmail = user?.email || " "

    const handleSubmit = async (e) => {

        e.preventDefault();
        dispatch(setIsLoading(true));

        try {
            const URL = process.env.NEXT_PUBLIC_BACK_END_URL;
            const resp = await axios.post(`${URL}/users/loginPass`, {
                email: storedEmail, 
                password
            });
            console.log("Response from Login By Password API:", resp.data);
            dispatch(setSuccessMessage("Logged in successfully"));
            toast.success("Logged in successfully");
            
            if (resp.data.token) {
                dispatch(passwordToLogin({
                    email: storedEmail,
                    password,
                    token: resp.data.token,
                    user: {
                        name: resp.data.user.name, 
                        profile_pic: resp.data.user.profile_pic,
                    },
                }));
                }

            router.push('/dashboard');
            
        } catch (err) {
            toast.error(err?.response?.data?.message);
            dispatch(setErrorMessage(err?.response?.data?.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };
  
 

    return (
        <div className="flex justify-center items-center w-screen">
            <div className="flex flex-col justify-center items-center py-5 mt-[5%] w-[30%] lg:w-[30%] p-6 bg-white shadow-lg rounded-lg">
            {
                 user && <h1 className="text-lg font-semibold mb-4 text-primary">Welcome {user.name } </h1>
            }
                
                {
                    user && 

                    <Image 
                    src={profile_pic} 
                    alt="profile pic "
                    width={70}
                    height={70}
                    className="rounded-full h-8 w-8"
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

                    <button type="submit"
                        disabled={isLoading}
                        className="bg-primary text-white py-2 px-4 mb-3 rounded text-bold text-[20px]">
                        { isLoading? "Loading..." : "Login"}
                    </button>
                    {/* <p className="text-[15px] text-primary mb-6 text-center">
                        <Link href="/auth/resetPassword" >Forgot password</Link>
                    </p> */}
                </form>
            </div>
        </div>
    );
};

export default LoginByPassword;
