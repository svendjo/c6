import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    const blob = dataURLtoBlob(image);
    formData.append('file', blob, 'image.jpg');

    try {
      const response = await fetch('https://22y7kxtymk.us-west-2.awsapprunner.com:8080/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrediction(data.prediction); // Assuming the API returns a prediction in a 'prediction' field
    } catch (error) {
      console.error('Error:', error);
      setPrediction('Error in prediction');
    }
  };

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Image Upload and Prediction</h1>
      <input type="file" accept="image/jpeg" onChange={handleImageUpload} />
      {image && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
      <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px' }}>Get Prediction</button>
      {prediction !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2>Prediction:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;

