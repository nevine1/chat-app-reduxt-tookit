"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import LoginByEmail from '@/components/auth/LoginByEmail';
const page = () => {
    const router = useRouter();
    

    
  return (
    <div>
      
      <LoginByEmail/>
    </div>
  )
}

export default page
