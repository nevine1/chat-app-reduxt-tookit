import { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io"; 
import Image from 'next/image';
import { IoCloseCircle } from "react-icons/io5";
const EditUserDetails = ({ user, onClose }) => {
  const profilePic = user?.profile_pic ? `/assets/{user?.profile_pic}` : "/assets/flower.jpg"
   const [uploadPhoto, setUploadPhoto] = useState("");
  const [data, setData] = useState({
    profile_pic: user.profile_pic, 
    name: user.name
  })
   //const NewProfilePic = uploadPhoto ? `assets/${uploadPhoto?.name}` 
  const handleChange = () => {
    const { name, value } = e.target

    setData((prev) => ({ ...prev , [name]: value}))
  }
 
  const handleUploadPhoto = (e) => {
      const file = e.target.files?.[0] || null; 
      setUploadPhoto(file);
      setData((prev) => ({
        ...prev,
        profile_pic: file?.name || "",
      }));
  };

  const handleSubmit = () => {
    console.log(data)
  }
  return (
      <div className="fixed top-0 right-0 left-0 bottom-0 bg-gray-700 bg-opacity-70  flex  justify-center items-center">
          <div className="fixed top-5 right-5 text-blue-800">
              <IoMdCloseCircle size={30} onClick={onClose} />
          </div>
          <div className="bg-white p-8 rounded-md">
              <h1 className="font-bold text-center mb-4 ">Profile Details</h1>
              <p className="py-3">Edit user details:</p>
            <form className="flex flex-col gap-4 sm:w-[30vw] rounded-sm mb-4  px-3 border-2"
              onSubmit={handleSubmit}>
                <input 
                  name="name" 
                  type="text" 
                  value={user.name}
                  onChange={handleChange}
                  className="p-2 border rounded mb-3 mt-3 text-gray-500 text-[15px] focus:outline-primary-dark bg-primary-light"         
                />
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Image
                    src={uploadPhoto ? `/assets/${uploadPhoto?.name}` : profilePic}
                    width={50}
                    height={50}
                    alt={`profile pic for ${user.name}`}
                    title={`profile pic for ${user.name}`}
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
              
                        {/* <input 
                          name="password" 
                          type="password" 
                          value={data.password}
                          placeholder="Password..."
                          autoComplete="new-password"
                          onChange={handleChange}
                          className="p-3 border rounded mb-3 text-gray-500 focus:outline-primary-dark bg-primary-light" 
                          /> */}
              
                        <button 
                          type="submit" 
                          className="bg-primary text-white py-2 px-4 mb-4 rounded text-bold text-[18px]">
                          Save
                        </button>
              </form>
              
          </div>
    
    </div>
  )
}

export default EditUserDetails
