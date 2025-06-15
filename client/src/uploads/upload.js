const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file); 

  const res = await fetch("http://localhost:5000/api/uploads", { 
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
 

  const uploadedUrl = `http://localhost:5000${data.filePath}`; 
  return uploadedUrl;
};

export default uploadFile;
