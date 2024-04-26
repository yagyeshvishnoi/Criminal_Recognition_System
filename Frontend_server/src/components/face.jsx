import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const FaceRecognitionSystem = () => {
  // State to store the binary data of the uploaded image
  const [imageBinaryData, setImageBinaryData] = useState(null);

  // Function to handle file upload
  const handleFiles = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const binaryData = reader.result;
      setImageBinaryData(binaryData);
    };
    reader.readAsBinaryString(file);
  };

  // Function to send image data to the backend API using Axios
  const sendImageToAPI = async () => {
    if (!imageBinaryData) {
      alert('Please select an image file.');
      return;
    }

    try {
      // Convert binary data to Blob
      const blob = new Blob([imageBinaryData]);

      const formData = new FormData();
      formData.append('image', blob);

      const response = await axios.post(
        'https://62ac-45-125-118-86.ngrok-free.app/process-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('API Response:', response.data);
      // Process API response here
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
  };

  return (
    <div className="container">
      <h1>Face Recognition System</h1>
      <p>Upload your file</p>
      <input
        type="file"
        id="fileElem"
        accept="image/*"
        onChange={handleFiles} // Call handleFiles when file selected
      />
      <label className="button" htmlFor="fileElem">
        Select a file
      </label>
      <button className="detect-button" onClick={sendImageToAPI}>
        Detect Face
      </button>
    </div>
  );
};

export default FaceRecognitionSystem;
