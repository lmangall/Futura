import React, { useState } from "react";
import { futura_backend } from "declarations/futura_backend";

const GreetComponent = () => {
  const [name, setName] = useState(""); // State for user input
  const [greetingResponse, setGreetingResponse] = useState("");

  const greetUser = async () => {
    const response = await futura_backend.greet(name); // Use the user's name
    console.log(response);
    setGreetingResponse(response); // Store the response in state
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update state on input change
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={greetUser}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Greet User
      </button>
      <p className="mt-2 text-gray-700">Check the console for the greeting response!</p>
      {greetingResponse && ( // Conditionally render the response
        <p className="mt-2 text-gray-800 font-semibold">Response: {greetingResponse}</p>
      )}
    </div>
  );
};

export default GreetComponent;
