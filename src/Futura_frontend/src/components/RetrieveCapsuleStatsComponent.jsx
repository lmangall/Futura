import React, { useState, useEffect } from "react";
import { futura_backend } from "declarations/futura_backend";

const RetrieveCapsuleStatsComponent = () => {
  const [capsuleStats, setCapsuleStats] = useState(null);
  const [error, setError] = useState("");

  const fetchCapsuleStats = async () => {
    try {
      const stats = await futura_backend.retrieve_capsule_stats();
      setCapsuleStats(stats);
      console.log("Capsule Statistics:", stats); // Log the stats to the console
    } catch (error) {
      console.error("Error retrieving capsule stats:", error);
      setError("Failed to retrieve capsule stats.");
    }
  };

  useEffect(() => {
    fetchCapsuleStats(); // Fetch stats on component mount
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Capsule Statistics</h2>
      {error && <p className="text-red-500">{error}</p>}
      {capsuleStats ? (
        <div className="mt-2">
          <p>Total Images: {capsuleStats.total_images}</p>
          <p>Total Texts: {capsuleStats.total_texts}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button
        onClick={fetchCapsuleStats} // Fetch stats when button is clicked
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Refresh Stats
      </button>
    </div>
  );
};

export default RetrieveCapsuleStatsComponent;
