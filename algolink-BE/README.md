# ActionsX-BE
### Introduction
This example demonstrates a Aptos Action built with Node.js using the Express framework. It provides an API endpoint for transferring APT , mint NFT , voting.

### Setup 
Install dependencies:
```
pnpm install
```
Start the application ( dev ) :
```
pnpm run dev
```
The server will start running on `http://localhost:3001`

The endpoint for the Action is: `http://localhost:3001/api/actions/{actions_endpoint}?{param}`

Currently in this example will have 3 endpoint :
- transfer-apt
- mint-nft
- voting

You can test the link to check the display on devnet via the link, test actions at: https://actionxapt.com/actions/devnet
