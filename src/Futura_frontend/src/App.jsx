import { useState, useEffect } from "react";
import { futura_backend } from "declarations/futura_backend";
import PlugConnect from "@psychedelic/plug-connect";
import MemoryForm from "./components/MemoryForm";
import ImageUploadForm from "./components/ImageUploadForm";
import Greeting from "./components/Greeting";

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
    const principal = window.ic.plug.agent ? await window.ic.plug.agent.getPrincipal() : null;
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

  const shortenPrincipal = (principal) => {
    if (!principal) return "";
    const start = principal.slice(0, 3); // Get first 3 characters
    const end = principal.slice(-3); // Get last 3 characters
    return `${start}...${end}`;
  };

  return (
    <main className="flex flex-col items-center p-6 bg-pink-100">
      <img src="/logo2.svg" alt="DFINITY logo" className="max-w-[50vw] max-h-[25vw] block m-auto" />

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
          <button className="flex items-center p-3 bg-green-600 text-white rounded-full mt-5 transition-colors duration-300 hover:bg-green-700 cursor-pointer">
            <img src="/Pluglogo.svg" alt="Plug logo" className="w-8 h-8 rounded-full mr-3" />
            <span className="font-bold">{shortenPrincipal(principal.toString())}</span>
            <button
              onClick={handleDisconnect}
              className="ml-3 bg-transparent border-none text-white cursor-pointer text-sm p-2 transition-colors hover:text-red-400"
            >
              Logout
            </button>
          </button>
          <MemoryForm />
        </>
      )}
      <Greeting />
      {/* <form onSubmit={handleSubmit} className="flex justify-center gap-2 flex-wrap max-w-[40vw] mx-auto items-baseline">
        <label htmlFor="name" className="text-lg font-semibold">
          Enter your name: &nbsp;
        </label>
        <input
          id="name"
          alt="Name"
          type="text"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="px-5 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Click Me!
        </button>
      </form>
      {greeting && (
        <section id="greeting" className="mt-4 p-4 mx-auto border border-gray-900 text-center">
          {greeting}
        </section>
      )} */}
      <ImageUploadForm />
    </main>
  );
}

export default App;
