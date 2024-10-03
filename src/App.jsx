import "./App.css";

import React, { useState, useCallback } from "react";
import "./App.css";
import { useWalletConnectClient } from "./contexts/ClientContext";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@lobstrco/signer-extension-api";
// async function setup() {
//   const provider = await detectEthereumProvider();

//   if (provider && provider === window.ethereum) {
//     console.log("MetaMask is available!");
//     startApp(provider); // Initialize your dapp with MetaMask.
//   } else {
//     console.log("Please install MetaMask!");
//   }
// }

// function startApp(provider) {
//   if (provider !== window.ethereum) {
//     console.error("Do you have multiple wallets installed?");
//   }
// }

// window.addEventListener("load", setup);
function App() {
  const [userAddress, setUserAddress] = useState("");
  const { session, account, connect, disconnect } = useWalletConnectClient();

  const handleConnectEth = async () => {
    const provider = await detectEthereumProvider();

    try {
      if (provider && provider.isMetaMask) {
        console.log(provider, "YSAAAAAAAAAAAAAA");
        console.log("in if");

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log("Connected to MetaMask with address:", account);
      } else {
        console.log("in else");
        await connect("eth");
        console.log("Connected via WalletConnect");
      }
    } catch (error) {
      console.error("Failed to connect to Ethereum:", error);
    }
  };

  const handleConnectSolana = async () => {
    const provider = window.solana; // Check for the Solana provider (e.g., Phantom)

    try {
      if (provider && provider.isPhantom) {
        // Ensure the provider is Phantom or any Solana wallet
        console.log("Solana wallet found:", provider);
        const response = await provider.connect(); // Request connection to the wallet
        const account = response.publicKey.toString(); // Get the connected account address
        console.log("Connected to Solana with address:", account);
        setUserAddress(account); // Update the user address state
      } else {
        console.log("No Solana wallet found. Connecting via WalletConnect...");
        await connect("solana"); // Fallback to WalletConnect if no wallet is available
        console.log("Connected via WalletConnect");
      }
    } catch (error) {
      console.error("Failed to connect to Solana:", error);
    }
  };

  const handleConnectPolkadot = async () => {
    try {
      if (window.injectedWeb3 && window.injectedWeb3["subwallet-js"]) {
        console.log("SubWallet found:", window.injectedWeb3);
        const SubWalletExtension = window.injectedWeb3["subwallet-js"];
        const extension = await SubWalletExtension.enable();
        console.log("extension", extension);
        // Get the accounts from the extension
        const accounts = await extension.accounts.get();
        const address = accounts[0].address;

        setUserAddress(address); // Update the user address state
      } else {
        console.log("No SubWallet found. Connecting via WalletConnect...");
        await connect("polkadot"); // Fallback to WalletConnect if no wallet is available
        console.log("Connected via WalletConnect");
      }
    } catch (error) {
      console.error("Failed to connect to Polkadot:", error);
    }
  };

  const handleConnectTron = async () => {
    try {
      // Check if TronLink and tronWeb are available
      if (
        typeof window.tronWeb !== "undefined" &&
        typeof window.tronLink !== "undefined"
      ) {
        tronWeb["installed"] = true;

        // Check if the TronLink wallet is ready
        if (window.tronWeb.ready || window.tronLink.ready) {
          let conexion;
          try {
            // Request account access
            conexion = (
              await window.tronLink.request({ method: "tron_requestAccounts" })
            ).code;
          } catch (e) {
            conexion = 0;
          }

          if (conexion === 200) {
            tronWeb["loggedIn"] = true;
            const wallet = window.tronLink.tronWeb.defaultAddress.base58; // Get the connected account address
            console.log("Connected to Tron with address:", wallet);
            setUserAddress(wallet);
          } else {
            console.log(
              "Failed to connect to TronLink, connecting via WalletConnect..."
            );
            // await connect("tron"); // Fallback to WalletConnect if no wallet is available
            console.log("Connected via WalletConnect");
          }
        } else {
          console.log("TronLink is not ready. Connecting via WalletConnect...");

          window.alert("kindly unlcok ur wallet ra venna");
          console.log("Connected via WalletConnect");
        }
      } else {
        console.log("No Tron wallet found. Connecting via WalletConnect...");
        await connect("tron"); // Fallback to WalletConnect if the wallet is not ready

        // await connect("tron"); // Fallback to WalletConnect if no wallet is available
        console.log("Connected via WalletConnect");
      }
    } catch (error) {
      console.error("Failed to connect to Tron:", error);
    }
  };

  const handleConnectStellar = async () => {
    try {
      // Check if the LOBSTR signer extension is available
      if (await isConnected()) {
        console.log("LOBSTR signer extension found");

        // Get the public key of the connected account
        const publicKey = await getPublicKey();
        console.log("Connected to Stellar with public key:", publicKey);

        // Set the user address in your state
        setUserAddress(publicKey);
      } else {
        console.log(
          "LOBSTR extension not connected. Please connect your wallet."
        );

        await connect("stellar");
      }
    } catch (error) {
      console.error("Failed to connect to Stellar via LOBSTR signer:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setUserAddress("");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  React.useEffect(() => {
    if (account) {
      setUserAddress(account);
    }
  }, [account]);

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
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
