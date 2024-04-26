import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FaceRecognitionSystem from './FaceRecognitionSystem';
import Details from './DetailsPage';

import '../style.css'; // Import the CSS file for styling


function App() {
  return (
    <Router>
      <div >
        <Routes>
          <Route exact path="/" element={<FaceRecognitionSystem />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;