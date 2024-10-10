import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

    const connected = await window.ic.plug.isConnected();

    if (!connected) {
      await window.ic.plug.requestConnect({ whitelist, host });
    }

    if (connected && !window.ic.plug.agent) {
      await window.ic.plug.createAgent({ whitelist, host });
    }

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
    setPrincipal(null);
    setIsConnected(false);
    window.ic.plug.agent = null;
    console.log("Disconnected from Plug");
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Route for the Home  */}
        <Route
          path="/"
          element={
            <main>
              <img src="/logo2.svg" alt="DFINITY logo" />
              <br />
              <br />
              {!isConnected ? (
                <PlugConnect
                  whitelist={[process.env.VITE_CANISTER_ID_FUTURA_BACKEND]}
                  onConnectCallback={() => {
                    console.log("PlugConnect onConnectCallback triggered.");
                    const principal = window.ic.plug.agent.getPrincipal();
                    if (principal) {
                      console.log(
                        "User principal fetched successfully:",
                        principal.toString()
                      );
                      setPrincipal(principal.toString());
                      setIsConnected(true);
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
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
