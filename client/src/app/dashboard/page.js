"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDetails from "@/components/UserDetails";

const page = () => {
    const router = useRouter();

    

    return <div>
            Welcome to the Dashboard
            <h1>Hello usser Detailsssssssssssssssssssss</h1>
            <UserDetails/>
            </div>;
};

export default page;
