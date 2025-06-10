const backendUrl = "http://localhost:5000";

 const uploadFile = async (file, token) => {
    
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
     
      return data.fileUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
};
  
export default uploadFile;