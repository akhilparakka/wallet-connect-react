import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClientContextProvider } from "./contexts/ClientContext.jsx";

createRoot(document.getElementById("root")).render(
  <ClientContextProvider>
    <App />
  </ClientContextProvider>
);
