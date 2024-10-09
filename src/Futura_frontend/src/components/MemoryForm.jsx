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
    <div>
      <form onSubmit={handleStoreMemory}>
        <label htmlFor="memory">Enter your memory:</label>
        <input type="text" id="memory" value={memory} onChange={(e) => setMemory(e.target.value)} />
        <button type="submit">Store Memory</button>
      </form>
      <br />
      <button onClick={handleRetrieveMemory}>Retrieve Memory</button>
      <p>{response}</p>
    </div>
  );
}

export default MemoryForm;
