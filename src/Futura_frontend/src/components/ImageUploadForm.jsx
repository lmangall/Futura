import React, { useState } from "react";
import { futura_backend } from "declarations/futura_backend";
import { IDL } from "@dfinity/candid";

const Metadata = IDL.Record({
  description: IDL.Opt(IDL.Text),
  date: IDL.Opt(IDL.Text),
  place: IDL.Opt(IDL.Text),
  tags: IDL.Opt(IDL.Vec(IDL.Text)),
  visibility: IDL.Opt(IDL.Vec(IDL.Principal)),
  people: IDL.Opt(IDL.Vec(IDL.Text)),
});

const TextType = IDL.Record({
  content: IDL.Text,
  metadata: IDL.Opt(Metadata),
});

const ImageType = IDL.Record({
  content: IDL.Vec(IDL.Nat8),
  metadata: IDL.Opt(Metadata),
});

const MemoryType = IDL.Record({
  texts: IDL.Opt(IDL.Vec(TextType)),
  images: IDL.Opt(IDL.Vec(ImageType)),
});

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [response, setResponse] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select an image to upload");
      return;
    }
    try {
      // Read the image file as an ArrayBuffer
      const imageArrayBuffer = await selectedImage.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);

      // Construct the memory object
      const memory = {
        texts: [
          {
            content: "Sample text",
            metadata: [
              {
                description: ["Text description"],
                date: ["2024-10-10"],
                place: ["Test Location"],
                tags: [["test", "text"]],
                visibility: [],
                people: [],
              },
            ],
          },
        ],
        images: [
          {
            content: imageUint8Array,
            metadata: [
              {
                description: ["Sample Image"],
                date: ["2024-10-10"],
                place: ["Berlin"],
                tags: [["test", "image"]],
                visibility: [],
                people: [],
              },
            ],
          },
        ],
      };

      console.log(JSON.stringify(memory, null, 2)); // Log the data structure

      // Encode the memory object using IDL
      const encodedMemory = IDL.encode([MemoryType], [memory]);

      // Call the 'store_memory' function on the backend canister
      await futura_backend.store_memory(encodedMemory);

      setResponse("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setResponse("Failed to upload image.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Image Upload</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Upload Image
        </button>
      </form>
      <p className="mt-4 text-center text-gray-700">{response}</p>
    </div>
  );
};

export default ImageUpload;
