import axios from "axios";

export const handleUpload = (selectedFile,apiUrl,nameId, id) => {
    if (selectedFile && id ) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append(nameId, id);
    
      axios.post(apiUrl, formData)
        .then((response) => {
         return response
          // Handle the response or perform any necessary actions
        })
        .catch((error) => {
          return error;
        });
    }
  };