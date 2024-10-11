import { useState } from "react";
import { futura_backend } from "declarations/futura_backend";

function MemoryForm() {
  const [memory, setMemory] = useState("");
  const [response, setResponse] = useState("");

  const handleStoreMemory = async (e) => {
    e.preventDefault();
    try {
      await futura_backend.store_memory(memory);
      setResponse("Memory stored successfully!");
    } catch (error) {
      setResponse("Failed to store memory.");
      console.error(error);
    }
  };

  const handleRetrieveMemory = async () => {
    try {
      const retrievedMemory = await futura_backend.retrieve_memory();
      setResponse(retrievedMemory ? `Your memory: ${retrievedMemory}` : "No memory found.");
    } catch (error) {
      setResponse("Failed to retrieve memory.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-7">
      <form onSubmit={handleStoreMemory} className="space-y-4">
        <label htmlFor="memory" className="block text-lg font-medium text-gray-700">
          Enter your memory:
        </label>
        <input
          type="text"
          id="memory"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type your memory here"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Store Memory
        </button>
      </form>
      <hr className="my-6" />
      <button
        onClick={handleRetrieveMemory}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Retrieve Memory
      </button>
      <p className="mt-4 text-center text-gray-700">{response}</p>
    </div>
  );
}

export default MemoryForm;
