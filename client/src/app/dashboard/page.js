"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        }
    }, []);

    return <h1>Welcome to the Dashboard</h1>;
};

export default page;
