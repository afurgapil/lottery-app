# Lottery-App

This project allows you to conduct a lottery using a smart contract on EVM-based blockchains. The Manager contract can be managed dynamically through the dashboard. Users can participate in the lottery by paying a fee, and they will be added to the participant list. When the Manager executes the lottery function, a winner is randomly selected, and the contract's balance is transferred to them.

## Getting Started

To use the project, you need to deploy the contract from your own account; otherwise, you won't have access to the manager functions.

### Requirements

The required packages used in the project are listed in the package.json file, but it is worth mentioning some important packages:

- Ethers
- Metamask

Ethers version 5.7 has been used in this project. Since it doesn't support other wallets, it is recommended to perform transactions through Metamask. The project is built on the Polygon Mumbai testnet.

## Contributing

As this is my first project interacting with smart contracts, there may be some optimization and security issues in both the Solidity and React sides. Your feedback on these matters would be greatly appreciated.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more information.
