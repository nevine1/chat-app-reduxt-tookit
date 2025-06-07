"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { FaPlus, FaVideo } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import moment from "moment";

const SendMessage = ({ userId, allMessages }) => {
  const backendUrl = "http://localhost:5000";
  const { user, token } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [message, setMessage] = useState({ text: "", imageUrl: "", videoUrl: "" });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Socket.IO connection
  useEffect(() => {
    if (!token) return;
    const newSocket = io(backendUrl, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { authToken: token },
    });
    setSocket(newSocket);
    newSocket.on("connect", () => console.log("Socket connected"));
    newSocket.on("disconnect", () => console.log("Socket disconnected"));
    return () => newSocket.disconnect();
  }, [token]);

  const handleTextChange = (e) => {
    setMessage((prev) => ({ ...prev, text: e.target.value }));
  };

  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      return data.fileUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      setLoading(false);
      return null;
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewImageUrl(localUrl);
    setImageFile(file);
    setVideoFile(null);
    setPreviewVideoUrl("");
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setMessage((prev) => ({ ...prev, imageUrl: uploadedUrl, videoUrl: "" }));
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewVideoUrl(localUrl);
    setVideoFile(file);
    setImageFile(null);
    setPreviewImageUrl("");
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setMessage((prev) => ({ ...prev, videoUrl: uploadedUrl, imageUrl: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket || (!message.text && !message.imageUrl && !message.videoUrl)) return;

    const newMessage = {
      sender: user._id,
      receiver: userId,
      text: message.text,
      imageUrl: message.imageUrl,
      videoUrl: message.videoUrl,
      msgByUserId: user._id,
      createdAt: new Date().toISOString(),
    };

    socket.emit("new message", newMessage);
    setMessage({ text: "", imageUrl: "", videoUrl: "" });
    setImageFile(null);
    setVideoFile(null);
    setPreviewImageUrl("");
    setPreviewVideoUrl("");
  };

  return (
    <div>
      {/* Messages */}
      <section className="p-4 h-[calc(100vh-17rem)] overflow-y-scroll bg-slate-300">
        {previewImageUrl && (
          <div className="relative w-fit mx-auto mb-4">
            <IoMdCloseCircle
              size={22}
              className="absolute top-1 right-1 text-blue-500 cursor-pointer"
              onClick={() => {
                setPreviewImageUrl("");
                setMessage((prev) => ({ ...prev, imageUrl: "" }));
              }}
            />
            <Image src={previewImageUrl} alt="Preview" width={150} height={150} className="rounded" />
          </div>
        )}

        {previewVideoUrl && (
          <div className="relative w-fit mx-auto mb-4">
            <IoMdCloseCircle
              size={22}
              className="absolute top-1 right-1 text-blue-500 cursor-pointer"
              onClick={() => {
                setPreviewVideoUrl("");
                setMessage((prev) => ({ ...prev, videoUrl: "" }));
              }}
            />
            <video src={previewVideoUrl} controls className="rounded w-64" />
          </div>
        )}

        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 m-2 rounded-lg ${
              user._id === msg.msgByUserId ? "bg-blue-400 text-white self-end ml-auto" : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.imageUrl && (
              <Image src={msg.imageUrl} alt="Sent" width={150} height={150} className="rounded mb-2" />
            )}
            {msg.videoUrl && (
              <video src={msg.videoUrl} controls className="rounded w-64 mb-2" />
            )}
            {msg.text && <p>{msg.text}</p>}
            <p className="text-xs mt-1">{moment(msg.createdAt).format("hh:mm A")}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      {/* Send Message */}
      <section className="bg-white p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Media Options */}
          <div className="relative">
            <button type="button" onClick={() => setShowMediaOptions(!showMediaOptions)}>
              <FaPlus className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 hover:bg-white hover:text-blue-500 border transition" />
            </button>
            {showMediaOptions && (
              <div className="absolute left-0 bottom-8 flex flex-col gap-2 bg-slate-200 p-2 rounded shadow z-10">
                <label htmlFor="uploadImage" className="flex items-center gap-2 cursor-pointer">
                  <AiFillPicture className="text-blue-500" />
                  Image
                </label>
                <label htmlFor="uploadVideo" className="flex items-center gap-2 cursor-pointer">
                  <FaVideo className="text-blue-500" />
                  Video
                </label>
                <input id="uploadImage" type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                <input id="uploadVideo" type="file" accept="video/*" className="hidden" onChange={handleUploadVideo} />
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={message.text}
            onChange={handleTextChange}
            placeholder="Type a message"
            className="flex-grow border border-blue-400 rounded-full px-3 py-1 text-sm"
          />

          {/* Send Button */}
          <button type="submit" disabled={loading}>
            <IoSend size={20} className="text-blue-500" />
          </button>
        </form>
      </section>
    </div>
  );
};

export default SendMessage;
