import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image to upload");
      return;
    }

    // Handle the file upload here
    const formData = new FormData();
    formData.append("image", selectedImage);

    // Example upload using fetch
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: "300px", marginTop: "10px" }} />
          </div>
        )}
        <button type="submit" style={{ marginTop: "10px" }}>
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;
