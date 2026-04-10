# FundFlow - Soroban Fundraising Smart Contract

A Soroban smart contract for decentralized donation fundraising on Stellar.

## Overview

This contract enables:
- **Campaign Creation** — Users can create fundraising campaigns with a goal amount
- **Donations** — Anyone can donate XLM to active campaigns
- **Withdrawal** — Campaign owners can withdraw funds once the goal is reached

## Contract Structure

```
contract/
├── Cargo.toml              # Workspace config (soroban-sdk v25)
└── contracts/contract/
    ├── Cargo.toml         # Contract dependencies
    └── src/
        ├── lib.rs       # Contract code
        └── test.rs     # Unit tests
```

## Contract Data

### Campaign Struct

```rust
struct Campaign {
    id: u32,         // Campaign ID
    owner: Address,   // Campaign creator
    goal: i128,     // Target amount (in stroops)
    raised: i128,    // Amount raised
    active: bool,    // Campaign status
}
```

## Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create_campaign` | `id: u32`, `owner: Address`, `goal: i128` | - | Create new campaign |
| `donate` | `id: u32`, `donor: Address`, `amount: i128` | - | Donate to campaign |
| `withdraw` | `id: u32`, `owner: Address` | - | Withdraw raised funds |
| `get_campaign` | `id: u32` | `Campaign` | Get campaign details |

## Error Handling

- `Invalid goal` — Goal must be positive
- `Campaign already exists` — ID already taken
- `Campaign not found` — ID doesn't exist
- `Campaign inactive` — Campaign closed
- `Unauthorized` — Not the campaign owner
- `Goal not reached` — Cannot withdraw until goal met

## Building & Testing

```bash
# Build the contract
cd contract
cargo build --release

# Run tests
cargo test
```

## Deployment

```bash
# Build WASM
stellar contract build

# Generate keys
stellar keys generate dev --network testnet --fund

# Deploy
stellar contract deploy \
  --wasm target/wasm32v1-none/release/contract.wasm \
  --source-account dev \
  --network testnet
```

The deployed contract address:
```
CCEG5OCIXMVF73CFGI52AOTTPTCIN46QBK2CF7HC7TMSO4YJFU7ZQRPQ
```

## Usage Notes

- All amounts are in **stroops** (1 XLM = 10,000,000 stroops)
- Campaign owners must be funded Stellar accounts
- Donors must have XLM balance to donate
- Once withdrawn, the campaign is marked inactive

## License

MIT