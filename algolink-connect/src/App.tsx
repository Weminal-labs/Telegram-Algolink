import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { Connect } from './Connect'

import './App.css'

const walletManager = new WalletManager({
  wallets: [
    
    WalletId.PERA,
    
  ],
  network: NetworkId.TESTNET
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <h1>Algolink</h1>
      <Connect />
    </WalletProvider>
  )
}

export default App
