import { useState } from "react";
import { Futura_backend } from "declarations/Futura_backend";
import PlugConnect from "@psychedelic/plug-connect";

function App() {
  const [greeting, setGreeting] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    Futura_backend.greet(name).then((greeting) => {
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
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      {!isConnected ? (
        <PlugConnect
          whitelist={[process.env.CANISTER_ID_FUTURA_BACKEND]}
          onConnectCallback={() => {
            console.log("PlugConnect onConnectCallback triggered."); // Log when the callback is triggered

            const principal = window.ic.plug.agent.getPrincipal(); //get user identity

            if (principal) {
              console.log("User principal fetched successfully:", principal.toString());
              setPrincipal(principal.toString());
              setIsConnected(true); // Update the connection status
            } else {
              console.log("Failed to fetch user principal.");
            }
          }}
        />
      ) : (
        <>
          <button disabled={true}>Connected to Plug</button>
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      )}

      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
