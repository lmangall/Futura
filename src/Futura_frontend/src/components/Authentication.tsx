import { useState, useEffect } from "react";
import PlugConnect from "@psychedelic/plug-connect";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthenticationPage() {
  const [view, setView] = useState("auth");
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState(null);

  const privacyPolicyContent = `
    You know, it's just a hackathon.
  `;

  const termsOfServiceContent = `
    We don't have any of those.
  `;

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

  function handleDisconnect() {
    setPrincipal(null);
    setIsConnected(false);
    window.ic.plug.agent = null;
    console.log("Disconnected from Plug");
  }

  const shortenPrincipal = (principal) => {
    if (!principal) return "";
    const start = principal.slice(0, 15);
    const end = principal.slice(-3);
    return `${start}...${end}`;
  };

  return (
    <>
      {view === "auth" && (
        <div className="h-screen flex items-center justify-center">
          {" "}
          {/* Full screen container */}
          <div className="md:hidden">
            <img
              src="/image.jpg"
              width={1280}
              height={843}
              alt="Authentication"
              className="block dark:hidden"
            />
            <img
              src="/image.jpg"
              width={1280}
              height={843}
              alt="Authentication"
              className="hidden dark:block"
            />
          </div>
          <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
              <div className="absolute inset-0 bg-zinc-900" />
              <div className="relative z-20 flex items-center text-lg font-medium">
                Futura Inc
              </div>
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg">
                    &ldquo;happiness only real when shared.&rdquo;
                  </p>
                  <footer className="text-sm">Chris - Into The Wild</footer>
                </blockquote>
              </div>
            </div>
            <div className="lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Log-in with Plug
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Authenticate with your account to access the platform.
                  </p>
                </div>
                {isConnected ? (
                  <div className="flex flex-col justify-center items-center space-y-4 mt-5">
                    <div className="flex items-center p-1 bg-green-500 text-white rounded-full transition-colors duration-300 cursor-pointer">
                      <img
                        src="/Pluglogo.svg"
                        alt="Plug logo"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="">{shortenPrincipal(principal)}</span>
                      <button
                        onClick={handleDisconnect}
                        className="bg-transparent border-none text-white cursor-pointer text-sm p-2 transition-colors hover:text-red-400 ml-3"
                      >
                        Logout
                      </button>
                    </div>
                    <Button>
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <PlugConnect
                      whitelist={[process.env.CANISTER_ID_FUTURA_BACKEND]}
                      onConnectCallback={() => {
                        console.log("PlugConnect onConnectCallback triggered.");
                        verifyConnectionAndAgent();
                      }}
                    />
                  </div>
                )}
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{" "}
                  <span
                    onClick={() => setView("terms")}
                    className="underline cursor-pointer underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => setView("privacy")}
                    className="underline cursor-pointer underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "privacy" && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p>{privacyPolicyContent}</p>
          <button onClick={() => setView("auth")} className="mt-4 underline">
            Back to Authentication
          </button>
        </div>
      )}

      {view === "terms" && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          <p>{termsOfServiceContent}</p>
          <button onClick={() => setView("auth")} className="mt-4 underline">
            Back to Authentication
          </button>
        </div>
      )}
    </>
  );
}
