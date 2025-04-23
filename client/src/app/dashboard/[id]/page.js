"use client"
import React from 'react'
import { useParams } from 'next/navigation'
const page = () => {
    const params = useParams(); 
    const id = params.id;
    console.log(id)
  return (
      <div>
          <h1>new page</h1>
    </div>
  )
}

export default page