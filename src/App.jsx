// App.jsx
import React from "react";
import "./App.css";
import { useWalletConnectClient } from "./contexts/ClientContext";

function App() {
  const { client, session, account, connect, disconnect } =
    useWalletConnectClient();

  const handleConnectEth = async () => {
    try {
      await connect("eth");
    } catch (error) {
      console.error("Failed to connect to Ethereum:", error);
    }
  };

  const handleConnectSolana = async () => {
    try {
      await connect("solana");
    } catch (error) {
      console.error("Failed to connect to Solana:", error);
    }
  };

  const handleConnectPolkadot = async () => {
    try {
      await connect("polkadot");
    } catch (error) {
      console.error("Failed to connect to Polkadot:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WalletConnect Integration</h1>
        {session ? (
          <div>
            <p>Connected to WalletConnect</p>
            <p>Account: {account}</p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        ) : (
          <div>
            <button onClick={handleConnectEth}>Connect to Ethereum</button>
            <button onClick={handleConnectSolana}>Connect to Solana</button>
            <button onClick={handleConnectPolkadot}>Connect to Polkadot</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
