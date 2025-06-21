"use client";
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';


const AllMessages = ({ allMessages }) => {
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
      {allMessages.map((msg, index) =>  (
          <div
            key={msg._id || index}
            ref={index === allMessages.length - 1 ? messagesEndRef : null}
            className={`flex ${user?._id ? 'justify-end ' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-xs sm:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md flex flex-col
                ${user?._id
                  ? 'bg-blue-500 text-white  justify-end'
                  : 'bg-gray-200 text-gray-800 items-start'
                }
              `}
            >
              {/* Images */}
              {msg.imageUrls?.length > 0 && (
                <div className="flex flex-wrap gap-2 my-1">
                  {msg.imageUrls.map((url, i) => (
                    <Link key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        alt={`image-${i}`}
                        className="w-48 max-h-48 object-cover rounded-lg border"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* Videos */}
              {msg.videoUrls?.length > 0 && (
                <div className="mt-2">
                  {msg.videoUrls.map((video, i) => (
                    <video
                      key={i}
                      src={video}
                      controls
                      className="aspect-video w-full max-w-sm rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Text */}
              {msg.text && (
                <p className="whitespace-pre-wrap break-words">
                  {msg.text}
                </p>
              )}

              {/* Timestamp */}
              {msg.createdAt && (
                <p className={`text-xs mt-1 ${user?._id ? 'text-blue-100 ' : ' text-gray-500 '}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AllMessages;
