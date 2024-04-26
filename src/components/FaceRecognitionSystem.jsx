import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css'; // Import the CSS file for styling

const FaceRecognitionSystem = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Get the navigate function

  const toggleMenu = () => {
    const menuList = document.getElementById('menuList');
    menuList.style.maxHeight =
      menuList.style.maxHeight === '0px'? '300px' : '0px';
  };

  const handleFiles = (files) => {
    // Handle file upload logic here
    console.log(files);
    setUploadedFile(files[0]);
  };

  const detectFaces = async () => {
    if (!uploadedFile) {
      alert('Please select an image file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const response = await fetch(
        'https://8010-182-72-39-9.ngrok-free.app/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Face detection request failed');
      }

      const data = await response.json();
      console.log('Response:', data);
      setError(null); // Reset error state if request is successful

      // Redirect to details page with data
      navigate('/details', { state: { data } });

    } catch (error) {
      console.error('Error detecting faces:', error);
      setError('Error detecting faces. Please try again.');
    }
  };

  return (
    <div>
      <nav>
        <div className="logo">
          <h1>Detection</h1>
        </div>
        <div className="menu-icon">
          <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
        </div>
      </nav>
      <div className="container">
        <p className="upload">Upload your file</p>
        <div id="drop-area">
          <form className="my-form">
            <p>
              Upload multiple files with the file dialog or by dragging and
              dropping images onto the dashed region
            </p>
            <input
              type="file"
              id="fileElem"
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label className="button" htmlFor="fileElem">
              Select file
            </label>
          </form>
          {uploadedFile && (
            <div className="uploaded-image-container">
              <img src={URL.createObjectURL(uploadedFile)} alt="Uploaded" className='containers img'/>
              <p>{uploadedFile.name}</p>
            </div>
          )}
        </div>
        <button className="detect-button" onClick={detectFaces}>
          Detect Faces
        </button>
        
      </div>
      <div className="containers">
        <h1>Face Detection System</h1>
        <div className="gif-container">
          <img src="gif.gif" alt="Face Detection GIF" />
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionSystem;