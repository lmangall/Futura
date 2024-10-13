import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../../declarations/futura_backend"; // Adjusted path to your backend's Candid file

const agent = HttpAgent.create({ host: import.meta.env.VITE_CANISTER_HOST }); // Use the host from .env
const actor = Actor.createActor(idlFactory, { agent, canisterId: canisterId }); // Use the canister ID from .env

const CheckCaller = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkType, setCheckType] = useState("anonymous"); // Default to 'anonymous'

  const handleCheckCaller = async () => {
    try {
      const response = await actor.check_caller(); // Call the check_caller function
      setResult(response);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-semibold mb-4">Choose Caller Type</h3>
      <div className="flex flex-col space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            value="anonymous"
            checked={checkType === "anonymous"}
            onChange={() => setCheckType("anonymous")}
            className="mr-2"
          />
          <span className="text-gray-700">Check for Anonymous Caller</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="not_anonymous"
            checked={checkType === "not_anonymous"}
            onChange={() => setCheckType("not_anonymous")}
            className="mr-2"
          />
          <span className="text-gray-700">Check for Non-Anonymous Caller</span>
        </label>
      </div>
      <button
        onClick={handleCheckCaller}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
      >
        Check Caller
      </button>
      {result !== null && <p className="mt-4 text-green-600">Caller is valid: {result.toString()}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  );
};

export default CheckCaller;
