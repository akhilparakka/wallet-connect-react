import "./App.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import React, { useState, useCallback } from "react";
import "./App.css";
import { useWalletConnectClient } from "./contexts/ClientContext";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { session, account, connect, disconnect } = useWalletConnectClient();
  const {
    connect: connectAptos,
    account: aptosAccount,
    disconnect: disconnectAptos,
  } = useWallet();

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

  const handleConnectTron = async () => {
    try {
      await connect("tron");
    } catch (error) {
      console.error("Failed to connect to Tron:", error);
    }
  };

  const handleConnectStellar = async () => {
    try {
      await connect("stellar");
    } catch (error) {
      console.error("Failed to connect to Stellar:", error);
    }
  };

  const handleConnectAptos = useCallback(async () => {
    try {
      await connectAptos();
    } catch (error) {
      console.error("Failed to connect to Aptos:", error);
    }
  }, [connectAptos]);

  const handleDisconnect = async () => {
    try {
      if (tonAddress) {
        await tonConnectUI.disconnect();
      } else if (aptosAccount) {
        await disconnectAptos();
      } else {
        await disconnect();
      }
      setUserAddress("");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleConnectTon = async () => {
    try {
      tonConnectUI.openModal();
    } catch (error) {
      console.error("Failed to connect to TON:", error);
    }
  };

  React.useEffect(() => {
    if (account) {
      setUserAddress(account);
    } else if (tonAddress) {
      setUserAddress(tonAddress);
    } else if (aptosAccount?.address) {
      setUserAddress(aptosAccount.address.toString());
    }
  }, [account, tonAddress, aptosAccount]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>WalletConnect Integration</h1>
        {userAddress ? (
          <div>
            <p>Connected to Wallet</p>
            <p>Account: {userAddress}</p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        ) : (
          <div>
            <button onClick={handleConnectEth}>Connect to Ethereum</button>
            <button onClick={handleConnectSolana}>Connect to Solana</button>
            <button onClick={handleConnectPolkadot}>Connect to Polkadot</button>
            <button onClick={handleConnectTron}>Connect to Tron</button>
            <button onClick={handleConnectStellar}>Connect to Stellar</button>
            <button onClick={handleConnectTon}>Connect to TON</button>
            <button onClick={handleConnectAptos}>Connect to Aptos</button>
            <div>
              <WalletSelector />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
