import { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast'
const EditUserDetails = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",  // Ensure we store the current profile pic
  });
console.log("form dat isssssssssssssss", data)
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profile_pic ? `/assets/${user.profile_pic}` : "/assets/flower.jpg");

  // Handle text input changes
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadPhoto(file);
      setPreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!data.name.trim()) {
    console.error("Error: Name is required.");
    return;
  }

  try {
    const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/update-userInfo`;

    const resp = await axios.put(URL, data, {  
      withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
    })
     
      /* {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      } */
   
    toast.success(resp?.data?.message);
    console.log("Updated user data:", resp.data);
    if (resp?.data.success) {
      dispatch(updateUser({ user: resp.data.data }));
    }
    

  } catch (err) {
    console.error("Error updating user:", err.response?.data || err.message);
  }
};


  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-gray-700 bg-opacity-70 flex justify-center items-center">
      <div className="fixed top-5 right-5 text-blue-800">
        <IoMdCloseCircle size={30} onClick={onClose} />
      </div>
      <div className="bg-white p-8 rounded-md">
        <h1 className="font-bold text-center mb-4">Profile Details</h1>
        <p className="py-3">Edit user details:</p>
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-4 sm:w-[30vw] rounded-sm mb-4 px-3 border-2"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            type="text"
            value={data.name}
            onChange={handleChange}
            className="p-2 border rounded mb-3 mt-3 text-gray-500 text-[15px] focus:outline-primary-dark bg-primary-light"
          />
          
          <div className="flex flex-row gap-4 items-center justify-center">
            <Image
              src={preview}
              width={50}
              height={50}
              className="rounded-full shadow-md h-15 w-15"
              alt={user?.name}
            />
            <label htmlFor="profile_pic" className="text-gray-500 font-semibold">
              {uploadPhoto ? uploadPhoto.name : "Upload pic"}
            </label>
            <input
              id="profile_pic"
              name="profile_pic"
              type="file"
              onChange={handleUploadPhoto}
              className="hidden bg-primary-light rounded"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-row gap-5 justify-center">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 mb-4 rounded text-bold text-[18px]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-primary text-primary py-2 px-4 mb-4 rounded text-bold text-[18px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
