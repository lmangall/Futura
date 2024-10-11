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

    const principal = window.ic.plug.agent ? await window.ic.plug.agent.getPrincipal() : null;
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

  const shortenPrincipal = (principal) => {
    if (!principal) return "";
    const start = principal.slice(0, 3);
    const end = principal.slice(-3);
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
            console.log("PlugConnect onConnectCallback triggered.");

            const principal = window.ic.plug.agent.getPrincipal();

            if (principal) {
              console.log("User principal fetched successfully:", principal.toString());
              setPrincipal(principal.toString());
              setIsConnected(true);
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
      <ImageUploadForm />
    </main>
  );
}

export default App;
