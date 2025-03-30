import { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import Image from 'next/image';
import { updateUser } from '@/store/slices/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const EditUserDetails = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const profilePic = user?.profile_pic ? `/assets/${user?.profile_pic}` : "/assets/flower.jpg";
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [data, setData] = useState({
    profile_pic: user?.profile_pic ,
    name: user?.name ,
  });

  console.log("Token from Redux:", token);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/updateUserDetails`;
      console.log("Sending request to:", URL);

      const resp = await axios.put(URL, data, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure token is passed
          },
        });

      console.log("Updated data:", resp.data);
      dispatch(updateUser({ user: resp.data }));

    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      console.error("Response Data:", err.response?.data);
      if (err.response?.data?.logout) {
        console.log("Session expired, logging out.");
        // Handle logout
      }
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
          className="flex flex-col gap-4 sm:w-[30vw] rounded-sm mb-4 px-3 border-2"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            type="text"
            value={data.name || " "}
            onChange={handleChange}
            className="p-2 border rounded mb-3 mt-3 text-gray-500 text-[15px] focus:outline-primary-dark bg-primary-light"
          />
          <div className="flex flex-row gap-4 items-center justify-center">
            <Image
              src={uploadPhoto ? `/assets/${uploadPhoto?.name}` : profilePic}
              width={50}
              height={50}
              alt={uploadPhoto ? `Uploaded profile picture` : `Profile picture of ${user?.name || "User"}`}
              className="rounded-full shadow-md h-15 w-15"
            />
            <label htmlFor="profile_pic" className="text-gray-500 font-semibold">
              {uploadPhoto ? uploadPhoto?.name : "Upload pic"}
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
