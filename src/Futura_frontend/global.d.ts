import { Plug } from "./types/plug"; // Import the Plug type if you moved it to another file

declare global {
  interface Window {
    ic?: {
      plug: Plug;
    };
  }
}
