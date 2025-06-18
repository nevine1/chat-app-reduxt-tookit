"use client"
import { useEffect , useRef } from 'react'
import { useSelector } from 'react-redux';
import Link from 'next/link';
const AllMessages = ({ allMessages, currentMsg }) => {
    const { user } = useSelector((state) => state.auth)
      // Ref for scrolling to the latest message
      const messagesEndRef = useRef(null);

    
  return (
    <div className="flex flex-col ">
          {
            allMessages.map((msg, index) => (
                <div
                    key={index}
                    ref={index === allMessages.length - 1 ? currentMsg : null}
                    className={`flex flex-col max-w-fit  m-2 rounded-lg shadow-sm
                    ${user?._id === msg.sender
                        ? ' bg-blue-400 text-right self-end'
                        : ' text-left self-start'
                    }`}
                >
                    {/*  after mapping messages and getting the imageUrls, then map imageUrl to show the uploaded images */}
                    {msg.imageUrls &&  msg.imageUrls.length > 0 && (

                    <div className="flex flex-wrap gap-2 my-1">
                        {msg.imageUrls.map((url, index) => (
                        <div key={index}>
                            <Link href={url}>
                                <img
                                    src={url}
                                    alt={`Uploaded image ${index}`}
                                    className="w-48 h-48 object-cover rounded-lg border cursor-pointer"
                                />     
                            </Link>
                        </div>
                        ))}
                    </div>
                    )}
                    
                    {msg.videoUrls && Array.isArray(msg.videoUrls) && msg.videoUrls.length > 0 && (

                    <div className="mt-2">
                        {msg.videoUrls.map((video, idx) => (
                        <video
                            key={idx}
                            src={video}
                            controls
                            className="aspect-video w-full max-w-sm rounded-lg "
                        />
                        ))}
                    </div>
                    )}
                    
                    {msg.text && <p className="text-white bg-blue-400 px-3 py-1 rounded-md">{msg.text}</p>}

                    <p className="text-white bg-blue-400 text-xs mt-1">
                    {/* {moment(msg.createdAt).format("hh:mm A")} */}
                    </p>
                </div>
                ))  
      }
    </div>
  )
}

export default AllMessages
