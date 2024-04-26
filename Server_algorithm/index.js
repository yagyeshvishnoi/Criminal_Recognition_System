const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = 8000;
const cors = require("cors");

app.use(cors());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    const fileName = 'received_image.jpg'; // Desired filename
    cb(null, fileName); // Set filename to 'received_image.jpg'
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') { // Only allow JPEG files
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type (only JPEG files allowed)'), false);
    }
  },
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is missing' });
  }

  const uploadedImagePath = req.file.path;
  console.log('Uploaded Image Path:', uploadedImagePath);



  // Execute the Python program to process the image
  const pythonProcess = exec('python process_image.py', (error, stdout, stderr) => {
    if (error) {
        console.error('Error executing Python script:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ error: 'Python script error' });
    }

    console.log('Python script output:', stdout);

    // Assuming stdout contains the JSON data
    
    const jsonData = JSON.parse(stdout);
    
    res.json(jsonData);
    
});

// Capture Python script stderr
pythonProcess.stderr.on('data', (data) => {
    console.error('Python script stderr (data event):', data.toString());
});
});


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
