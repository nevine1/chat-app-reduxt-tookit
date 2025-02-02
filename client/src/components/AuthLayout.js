import React from 'react'
import Link from 'next/link'
const AuthLayout = ({children}) => {
  return (
    
      <nav className="flex flex-row gap-4">
        
            <Link href="/">logout</Link>
            <Link href="/">message</Link>
            <Link href="/">chat</Link>
       
      </nav>
   
  )
}

export default AuthLayout
