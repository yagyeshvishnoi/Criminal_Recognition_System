import React from 'react';

const DetectedFaces = ({ detectedFaces }) => {
  return (
    <div>
      <h1>Detected Faces</h1>
      <ul>
        {detectedFaces.map((face, index) => (
          <li key={index}>
            Face {index + 1}: {face}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetectedFaces;
