# WalletConnect Integration

This repository contains a basic implementation of WalletConnect integration in a React application. It allows users to connect to Ethereum, Solana, and Polkadot wallets using WalletConnect.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Connect to Ethereum, Solana, and Polkadot wallets using WalletConnect.
- Display the connected wallet address.
- Disconnect from the connected wallet.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/walletconnect-integration.git
   cd walletconnect-integration
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

## Usage

- Open your browser and navigate to http://localhost:5173.
- Click the "Connect to Ethereum", "Connect to Solana", or "Connect to Polkadot" buttons to generate the appropriate QR codes.
- Scan the QR code with a WalletConnect-compatible wallet (e.g., MetaMask, Trust Wallet) to establish the connection.
- Once connected, the wallet address will be displayed on the screen.
- Click the "Disconnect" button to disconnect the session.
