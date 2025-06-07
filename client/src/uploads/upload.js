const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
    return data.fileUrl; // use this to show the image
  };
  