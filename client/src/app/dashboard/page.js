"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from '../../components/messaging/SideBar'
//import UserDetails from "@/components/UserDetails";

const page = () => {
    const router = useRouter();

    /* useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        }
    }, []); */

    return (
        <div className="flex flex-col sm:flex-row  h-screen gap-4">
            <div className="w-full sm:w-1/3 bg-slate-100 p-4 shadow-md">
                <SideBar/>
            </div>
            <div className="w-full sm:w-2/3 bg-blue-500 p-4 shadow-md">right side</div>
           
        </div>
    )
};

export default page;
