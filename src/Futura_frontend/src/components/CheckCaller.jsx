import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../../declarations/futura_backend"; // Adjusted path to your backend's Candid file

const CheckCaller = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkType, setCheckType] = useState("anonymous"); // Default to 'anonymous'
  const [actor, setActor] = useState(null);

  const createActor = (canisterId, options = {}) => {
    const agent = options.agent || new HttpAgent({ ...options.agentOptions });

    // Fetch root key for certificate validation during development
    if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }

    // Creates an actor using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
      ...options.actorOptions,
    });
  };

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        console.log("Checking if connected to Plug...");
        const connected = await window.ic.plug.isConnected();
        console.log("Connected to Plug:", connected);

        if (!connected) {
          console.log("Requesting connection to Plug...");
          await window.ic.plug.requestConnect(); // Request connection if not connected
          console.log("Connection requested.");
        } else {
          console.log("Already connected to Plug.");
        }

        console.log("Creating agent with Plug...");
        const agent = await window.ic.plug.createAgent(); // Create agent with Plug
        console.log("Agent created:", agent);

        // Check if the agent is an instance of HttpAgent
        if (agent instanceof HttpAgent) {
          // Fetch root key for certificate validation during development
          if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
            await agent.fetchRootKey().catch((err) => {
              console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
              console.error(err);
            });
          }
        } else {
          console.warn("The agent is not an instance of HttpAgent. Cannot fetch root key.");
        }

        // const actorInstance = Actor.createActor(idlFactory, { agent, canisterId });
        const actorInstance = createActor(canisterId); // Use the createActor function

        console.log("Actor instance created:", actorInstance);
        setActor(actorInstance); // Set the actor instance
      } catch (err) {
        console.error("Error initializing agent:", err);
        setError("Failed to initialize agent.");
      }
    };

    initializeAgent();
  }, []);

  const handleCheckCaller = async () => {
    if (!actor) {
      console.warn("Actor not initialized. Cannot make call.");
      setError("Actor not initialized.");
      return;
    }

    try {
      console.log("Calling check_caller...");
      const response = await actor.check_caller(); // Call the check_caller function
      console.log("Response from check_caller:", response);
      setResult(response);
      setError(null);
    } catch (err) {
      console.error("Error calling check_caller:", err);
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
