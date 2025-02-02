"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import LoginByPassword from '@/components/auth/LoginByPassword'
const page = () => {
  return (
    <div>
      <h1>hello login by password</h1>
      <LoginByPassword/>
    </div>
  )
}

export default page
