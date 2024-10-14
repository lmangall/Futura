import { useState, useEffect } from "react";
import { SessionData } from "../../types/plug";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function PlugConnection() {
  const [connected, setConnected] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const requestConnection = async () => {
    if (window.ic?.plug) {
      setIsLoading(true);
      try {
        const publicKey = await window.ic.plug.requestConnect();
        console.log(`Connected! Public key:`, publicKey);
        await checkConnection();
      } catch (e) {
        console.error("Failed to connect:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Plug Connection</CardTitle>
        <CardDescription>Connect your Internet Computer wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Connected with Plug</AlertTitle>
            <AlertDescription>
              <p>
                <strong>Principal ID:</strong> {sessionData?.principalId}
              </p>
              <p>
                <strong>Account ID:</strong> {sessionData?.accountId}
              </p>
              <p>
                <strong>Agent:</strong> {sessionData?.agent ? "Available" : "Not available"}
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Not connected</AlertTitle>
            <AlertDescription>You are not connected with Plug. Click the button below to connect.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {!connected && (
          <Button onClick={requestConnection} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to Plug"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
