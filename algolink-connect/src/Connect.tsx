import { NetworkId, useWallet, type Wallet } from '@txnlab/use-wallet-react'
import * as React from 'react'

export function Connect() {
  const {
    activeNetwork,
    setActiveNetwork,
    wallets
  } = useWallet()

  const [isWebAppReady, setIsWebAppReady] = React.useState(false)

  React.useEffect(() => {
    if (window.Telegram?.WebApp) {
      // Initialize Telegram WebApp
      console.log("Initializing Telegram Web App");
      window.Telegram.WebApp.ready();
      setIsWebAppReady(true);

      
    } else {
      console.warn("Telegram WebApp is not available");
    }
  }, []);

  // Effect to watch for wallet connection changes
  React.useEffect(() => {
    wallets.forEach(wallet => {
      if (wallet.isConnected && wallet.accounts.length > 0) {
        const activeAccount = wallet.accounts[0];
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'wallet_connected',
            address: activeAccount.address
          }));
        }
      }
    });
  }, [wallets]);

  const isConnectDisabled = (wallet: Wallet) => {
    if (wallet.isConnected) {
      return true
    }
    return false
  }

  const getConnectArgs = (wallet: Wallet) => {
    return undefined
  }

  const setActiveAccount = (event: React.ChangeEvent<HTMLSelectElement>, wallet: Wallet) => {
    const target = event.target
    wallet.setActiveAccount(target.value)
  }
  
  if (!isWebAppReady) {
    return <div>Loading Telegram Web App...</div>;
  }

  return (
    <div>
      <div className="network-group">
        <h4>
          Current Network: <span className="active-network">{activeNetwork}</span>
        </h4>
        <div className="network-buttons">
          <button
            type="button"
            onClick={() => setActiveNetwork(NetworkId.BETANET)}
            disabled={activeNetwork === NetworkId.BETANET}
          >
            Set to Betanet
          </button>
          <button
            type="button"
            onClick={() => setActiveNetwork(NetworkId.TESTNET)}
            disabled={activeNetwork === NetworkId.TESTNET}
          >
            Set to Testnet
          </button>
          <button
            type="button"
            onClick={() => setActiveNetwork(NetworkId.MAINNET)}
            disabled={activeNetwork === NetworkId.MAINNET}
          >
            Set to Mainnet
          </button>
        </div>
      </div>

      {wallets.map((wallet) => (
        <div key={wallet.id} className="wallet-group">
          <h4>
            {wallet.metadata.name} {wallet.isActive ? 'active' : ''}
          </h4>

          <div className="wallet-buttons">
            <button 
              type="button"
              onClick={() => {wallet.connect(getConnectArgs(wallet))}}
              disabled={isConnectDisabled(wallet)}
            >
              Connect
            </button>
            
            <button
              type="button"
              onClick={() => {
                wallet.disconnect();
                if (window.Telegram?.WebApp) {
                  window.Telegram.WebApp.sendData(JSON.stringify({
                    action: 'wallet_disconnected'
                  }));
                }
              }}>
              Disconnect
            </button>
          </div>

          {wallet.isActive && wallet.accounts.length > 0 && (
            <select onChange={(e) => setActiveAccount(e, wallet)}>
              {wallet.accounts.map((account) => (
                <option key={account.address} value={account.address}>
                  {account.address.slice(0, 4)}...{account.address.slice(-4)}
                </option>
              ))}
            </select>
          )}
          {/* <button 
              type="button"
              onClick={() => {
                if (window.Telegram?.WebApp) {
                  window.Telegram.WebApp.sendData(JSON.stringify({
                    action: 'wallet_connected',
                    address: wallet.accounts[0].address
                  }));
                  
                }
                
              }}
              disabled={!isConnectDisabled(wallet)}
            >
              send Data
            </button> */}
        </div>
      ))}
    </div>
  )
}
