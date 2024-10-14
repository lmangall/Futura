// src/types/plug.d.ts

// Define types for the session data
export interface SessionData {
  agent: any; // Replace with stricter type if available
  principalId: string;
  accountId: string;
}

export interface Plug {
  isConnected: () => Promise<boolean>;
  requestConnect: (params?: {
    whitelist?: string[];
    host?: string;
    onConnectionUpdate?: () => void;
    timeout?: number;
  }) => Promise<string>;
  sessionManager: {
    sessionData: SessionData | null;
  };
}
