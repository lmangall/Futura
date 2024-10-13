import { useState } from "react";
import { futura_backend } from "../../../declarations/futura_backend";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function GreetComponent() {
  const [name, setName] = useState("");
  const [greetingResponse, setGreetingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const greetUser = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const response = await futura_backend.greet(name);
      console.log(response);
      setGreetingResponse(response);
      setName(""); // Clear the input field
    } catch (error) {
      console.error("Error greeting user:", error);
      setGreetingResponse("An error occurred while greeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Greet User</CardTitle>
        <CardDescription>Enter your name and get a personalized greeting.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && greetUser()}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button onClick={greetUser} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Greet User"
          )}
        </Button>
        {greetingResponse && (
          <Alert className="w-full">
            <AlertTitle>Greeting Response</AlertTitle>
            <AlertDescription>{greetingResponse}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
