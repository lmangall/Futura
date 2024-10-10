import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Import Router and Route
import { futura_backend } from "declarations/futura_backend";
import PlugConnect from "@psychedelic/plug-connect";
import MemoryForm from "./components/MemoryForm";
import { Button } from "./components/ui/button";
import Dashboard from "./components/Dashborad";

function App() {
  const [greeting, setGreeting] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState(null);

  // Persistence check to ensure connection and agent are available
  const verifyConnectionAndAgent = async () => {
    const whitelist = [process.env.VITE_CANISTER_ID_FUTURA_BACKEND];
    const host = "https://mainnet.dfinity.network"; // Adjust the host if necessary

    // Check if the user is still connected to Plug
    const connected = await window.ic.plug.isConnected();

    if (!connected) {
      // If not connected, request connection again
      await window.ic.plug.requestConnect({ whitelist, host });
    }

    // If connected, ensure the Plug agent is created
    if (connected && !window.ic.plug.agent) {
      await window.ic.plug.createAgent({ whitelist, host });
    }

    // Get the user's principal if they are connected
    const principal = window.ic.plug.agent
      ? await window.ic.plug.agent.getPrincipal()
      : null;
    if (principal) {
      console.log("User principal fetched successfully:", principal.toString());
      setPrincipal(principal.toString());
      setIsConnected(true);
    }
  };

  useEffect(() => {
    // Run the persistence check on component mount
    verifyConnectionAndAgent();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    futura_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  function handleDisconnect() {
    // Clear the Plug connection
    setPrincipal(null);
    setIsConnected(false);

    // Optionally, clear the Plug agent (reset the window.ic.plug)
    window.ic.plug.agent = null;
    console.log("Disconnected from Plug");
  }

  return (
    <Router>
      <main>
        <img src="/logo2.svg" alt="DFINITY logo" />
        <br />
        <br />
        {!isConnected ? (
          <PlugConnect
            whitelist={[process.env.VITE_CANISTER_ID_FUTURA_BACKEND]}
            onConnectCallback={() => {
              console.log("PlugConnect onConnectCallback triggered."); // Log when the callback is triggered

              const principal = window.ic.plug.agent.getPrincipal(); // get user identity

              if (principal) {
                console.log(
                  "User principal fetched successfully:",
                  principal.toString()
                );
                setPrincipal(principal.toString());
                setIsConnected(true); // Update the connection status
              } else {
                console.log("Failed to fetch user principal.");
              }
            }}
          />
        ) : (
          <>
            <Button disabled={true}>Connected to Plug</Button>
            <Button onClick={handleDisconnect}>Disconnect</Button>
            <MemoryForm />
          </>
        )}

        <form action="#" onSubmit={handleSubmit}>
          <label htmlFor="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <Button type="submit">Click Me!</Button>
        </form>
        <section id="greeting">{greeting}</section>

        {/* Button to navigate to the Dashboard */}
        <div>
          <Button>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        <Button>Button</Button>
        <h1 className="text-3xl font-bold underline">test tailwind!</h1>
      </main>

      {/* Define the routes for the application */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        {/* Route for Dashboard */}
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
