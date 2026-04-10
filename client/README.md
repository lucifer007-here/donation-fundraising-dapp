# FundFlow - Soroban Fundraising DApp

A decentralized donation fundraising platform built on Stellar using Soroban smart contracts and Next.js.

## Overview

FundFlow allows users to:
- **Create** fundraising campaigns with a goal amount
- **Donate** XLM to campaigns  
- **Withdraw** funds when the goal is reached (campaign owner only)

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Blockchain**: Stellar Soroban
- **Smart Contract**: Rust (Soroban SDK v25)
- **Wallet**: Freighter

## Getting Started

### Prerequisites

- [Freighter Wallet](https://freighter wallet) browser extension installed
- Stellar testnet XLM for testing

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
bun run build
```

## Project Structure

```
client/
├── app/                  # Next.js app router pages
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React components
│   ├── Contract.tsx      # Main contract UI
│   ├── Navbar.tsx
│   └── ui/            # Reusable UI components
├── hooks/              # Contract interaction hooks
│   └── contract.ts
├── packages/            # Local packages
│   └── contract/       # TypeScript bindings
└── lib/               # Utilities
```

## Contract Integration

The contract is deployed at:
```
CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ
```

TypeScript bindings are auto-generated in `packages/contract/`.

## Contract Methods

| Method | Description | Auth Required |
|--------|------------|---------------|
| `create_campaign(id, owner, goal)` | Create new campaign | Yes (owner) |
| `donate(id, donor, amount)` | Donate XLM | Yes (donor) |
| `withdraw(id, owner)` | Withdraw funds | Yes (owner) |
| `get_campaign(id)` | Get campaign details | No |

## Environment

- **Network**: Stellar Testnet
- **RPC**: https://soroban-testnet.stellar.org
- **Horizon**: https://horizon-testnet.stellar.org

## License

MIT