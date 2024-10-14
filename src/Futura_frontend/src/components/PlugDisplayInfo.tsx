import { useState, useEffect } from "react";
import { SessionData, Plug } from "../../types/plug";
// Define types for session data

const PlugConnection: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Function to check if the user is connected to Plug
  const checkConnection = async () => {
    if (window.ic?.plug) {
      const isConnected = await window.ic.plug.isConnected();
      setConnected(isConnected);

      if (isConnected) {
        const session = window.ic.plug.sessionManager.sessionData;
        setSessionData(session);
      }
    }
  };

  // Function to request connection to Plug
  const requestConnection = async () => {
    if (window.ic?.plug) {
      try {
        const publicKey = await window.ic.plug.requestConnect();
        console.log(`Connected! Public key:`, publicKey);
        checkConnection(); // Recheck connection after requesting
      } catch (e) {
        console.error("Failed to connect:", e);
      }
    }
  };

  // Check connection when component is mounted
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div>
      {connected ? (
        <div>
          <h2>You are connected with Plug</h2>
          <p>
            <strong>Principal ID:</strong> {sessionData?.principalId}
          </p>
          <p>
            <strong>Account ID:</strong> {sessionData?.accountId}
          </p>
          <p>
            <strong>Agent:</strong> {sessionData?.agent ? "Available" : "Not available"}
          </p>
        </div>
      ) : (
        <div>
          <h2>You are not connected with Plug</h2>
          <button onClick={requestConnection}>Connect to Plug</button>
        </div>
      )}
    </div>
  );
};

export default PlugConnection;
