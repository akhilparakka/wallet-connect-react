import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Client from "@walletconnect/sign-client";
import { Web3Modal } from "@web3modal/standalone";
import { RELAYER_EVENTS } from "@walletconnect/core";

// Create the context
export const ClientContext = createContext();

// Initialize Web3Modal
const web3Modal = new Web3Modal({
  projectId: "421a0579705e440536ac9fd845379f2c",
  themeMode: "light",
  walletConnectVersion: 2,
});

// Provider component
export function ClientContextProvider({ children }) {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [account, setAccount] = useState(null);

  const initializeClient = useCallback(async () => {
    try {
      const _client = await Client.init({
        projectId: "421a0579705e440536ac9fd845379f2c",
        relayUrl: "wss://relay.walletconnect.com",
      });

      setClient(_client);

      // Subscribe to events
      _client.on("session_ping", (args) => {
        console.log("EVENT", "session_ping", args);
      });

      _client.on("session_event", (args) => {
        console.log("EVENT", "session_event", args);
      });

      _client.on("session_update", ({ topic, params }) => {
        console.log("EVENT", "session_update", { topic, params });
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        setSession(updatedSession);
        setAccount(updatedSession.namespaces.eip155.accounts[0].split(":")[2]);
      });

      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete");
        setSession(null);
        setAccount(null);
      });

      // Check for persisted state
      setPairings(_client.pairing.getAll({ active: true }));
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(
          _client.session.keys[lastKeyIndex]
        );
        setSession(_session);
        setAccount(_session.namespaces.eip155.accounts[0].split(":")[2]);
      }
    } catch (error) {
      console.error("Failed to initialize WalletConnect client:", error);
    }
  }, []);

  useEffect(() => {
    if (!client) {
      initializeClient();
    }
  }, [client, initializeClient]);

  useEffect(() => {
    if (client) {
      client.core.relayer.on(RELAYER_EVENTS.connect, () => {
        console.log("Network connection is restored!");
      });

      client.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
        console.log("Network connection lost.");
      });
    }
  }, [client]);

  const connect = useCallback(
    async (chain) => {
      if (!client) {
        throw new Error("WalletConnect is not initialized");
      }

      try {
        const requiredNamespaces =
          chain === "eth"
            ? {
                eip155: {
                  methods: [
                    "eth_sendTransaction",
                    "eth_signTransaction",
                    "eth_sign",
                    "personal_sign",
                    "eth_signTypedData",
                  ],
                  chains: ["eip155:1"],
                  events: ["chainChanged", "accountsChanged"],
                },
              }
            : chain === "solana"
            ? {
                solana: {
                  methods: ["solana_signTransaction", "solana_signMessage"],
                  chains: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"],
                  events: ["accountChanged"],
                },
              }
            : {
                polkadot: {
                  methods: ["polkadot_signTransaction", "polkadot_signMessage"],
                  chains: ["polkadot:91b171bb158e2d3848fa23a9f1c25182"],
                  events: ["accountChanged"],
                },
              };

        const { uri, approval } = await client.connect({
          requiredNamespaces,
        });

        if (uri) {
          web3Modal.openModal({ uri });
        }

        const session = await approval();
        setSession(session);
        setAccount(
          session.namespaces.eip155?.accounts[0]?.split(":")[2] ||
            session.namespaces.solana?.accounts[0]?.split(":")[2] ||
            session.namespaces.polkadot?.accounts[0]?.split(":")[2]
        );
        setPairings(client.pairing.getAll({ active: true }));
      } catch (error) {
        console.error("Failed to connect:", error);
        throw error;
      } finally {
        web3Modal.closeModal();
      }
    },
    [client]
  );

  const disconnect = useCallback(async () => {
    if (!client || !session) {
      throw new Error(
        "WalletConnect is not initialized or session is not connected"
      );
    }

    try {
      await client.disconnect({
        topic: session.topic,
        reason: { code: 0, message: "USER_DISCONNECTED" },
      });

      setSession(null);
      setAccount(null);
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  }, [client, session]);

  const value = {
    client,
    session,
    pairings,
    account,
    connect,
    disconnect,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

// Custom hook to use the context
export function useWalletConnectClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnectClient must be used within a ClientContextProvider"
    );
  }
  return context;
}
