# 💰 Decentralized Donation Fundraising dApp (Soroban - Stellar)

## 📌 Project Description

This project is a decentralized donation fundraising platform built on the Stellar blockchain using Soroban smart contracts. It enables individuals, NGOs, and communities to create fundraising campaigns and receive contributions transparently without relying on centralized platforms.

By leveraging blockchain technology, this dApp ensures that all donations are immutable, publicly verifiable, and secure. It combines a Soroban smart contract backend with a modern, user-friendly frontend interface to deliver a seamless fundraising experience.

<img width="1920" height="1048" alt="dapp2" src="https://github.com/user-attachments/assets/1dfd6f4d-4c2f-4ebe-b6e3-c3a01426d5a0" />

---

## ⚙️ What It Does

The dApp provides a complete fundraising ecosystem:

* 🏁 **Create Campaigns**
  Users can launch fundraising campaigns with a target goal.

* 💸 **Donate Securely**
  Contributors can donate to active campaigns.

* 📊 **Track Progress**
  Real-time tracking of funds raised vs goal.

* 🏦 **Withdraw Funds**
  Campaign owners can withdraw funds after reaching the goal.

* 🔍 **View Campaign Details**
  Anyone can inspect campaign data directly from the blockchain.

---

## 🧩 Architecture Overview

### 🔗 Smart Contract Layer (Soroban)

* Handles campaign logic (create, donate, withdraw)
* Stores campaign data on-chain
* Enforces authorization and validation

### 🌐 Client Application (Improved UI)

* Built with modern frontend framework (React recommended)
* Connects to Stellar network using Soroban/ Stellar SDK
* Provides clean, responsive, and intuitive UI
* Handles wallet connection and transaction signing

---

## 🎨 UI/UX Improvements

This dApp focuses on delivering a **modern Web3 user experience**:

* 🎯 **Clean Dashboard UI**
  Displays all campaigns with progress bars

* 📈 **Live Progress Indicators**
  Visual representation of funds raised vs goal

* 🧾 **Campaign Cards**
  Each campaign shown with:

  * Title
  * Goal
  * Raised amount
  * Donate button

* 🔐 **Wallet Integration UI**
  Seamless connection with Freighter wallet

* ⚡ **Instant Feedback**
  Transaction status (pending, success, failed)

* 📱 **Responsive Design**
  Works across desktop and mobile

---

## 🔗 Deployed Smart Contract

**Contract Address:**

```id="cn8d2k"
CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ
```

---

## 🔌 Client ↔ Contract Integration

The frontend communicates with the deployed contract via the Stellar SDK.

### 🔄 Flow:

1. User connects wallet (Freighter)
2. Frontend calls contract functions:

   * `create_campaign`
   * `donate`
   * `withdraw`
   * `get_campaign`
3. User signs transaction
4. Transaction is submitted to Stellar network
5. UI updates based on blockchain state

---

## 🛠️ Tech Stack

* **Blockchain:** Stellar
* **Smart Contracts:** Soroban (Rust)
* **Frontend:** React.js / Next.js
* **SDK:** Soroban SDK / Stellar JS SDK
* **Wallet:** Freighter Wallet
* **Styling:** Tailwind CSS / Modern UI libraries

---

## 🚀 Example Contract Interaction

```bash id="m2x9qp"
# Create Campaign
stellar contract invoke \
  --id CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ \
  --fn create_campaign \
  --arg id=1 \
  --arg owner=<YOUR_ADDRESS> \
  --arg goal=1000

# Donate
stellar contract invoke \
  --id CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ \
  --fn donate \
  --arg id=1 \
  --arg donor=<YOUR_ADDRESS> \
  --arg amount=100
```

---

## 📂 Project Structure

```id="y4v8lz"
project/
│── contract/        # Soroban smart contract (Rust)
│── client/          # Frontend application (React)
│── components/      # UI components (cards, modals, buttons)
│── hooks/           # Wallet + contract interaction logic
│── utils/           # Stellar/Soroban helpers
│── README.md
```

---

## 🔮 Future Improvements

* 💰 Real XLM/token transfer integration
* 🧾 Donor history tracking
* 📅 Campaign deadlines
* 🎯 Milestone-based fund release
* 📊 Analytics dashboard
* 🌍 Multi-campaign categories

---

## 🧪 How to Run Locally

```bash id="l9p3rt"
# Clone repository
git clone <your-repo-url>

# Go to client
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📜 License

MIT License
