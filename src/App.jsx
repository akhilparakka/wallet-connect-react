import "./App.css";
import { useWalletConnectClient } from "./contexts/ClientContext";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

function App() {
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { session, account, connect, disconnect } = useWalletConnectClient();

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
      console.error("Failed to connect to Polkadot:", error);
    }
  };

  const handleConnectStellar = async () => {
    try {
      await connect("stellar");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (userAddress) {
        await tonConnectUI.disconnect();
      } else {
        await disconnect();
      }
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>WalletConnect Integration</h1>
        {session || userAddress ? (
          <div>
            <p>Connected to WalletConnect</p>
            <p>Account: {account ? account : userAddress}</p>
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
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
