import { NetworkId, useWallet, type Wallet } from '@txnlab/use-wallet-react'
import * as React from 'react'
import algosdk from 'algosdk'

export function Connect() {
  const {
    algodClient,
    activeNetwork,
    activeAddress,
    setActiveNetwork,
    transactionSigner,
    wallets
  } = useWallet()

  const [isWebAppReady, setIsWebAppReady] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [isCustomAmount, setIsCustomAmount] = React.useState(false)
  const [isWanring, setIsWanring] = React.useState(false)
  const [amount, setAmount] = React.useState(0);

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

  const sendTransaction = async (amount: number) => {
    try {
      if (!activeAddress) {
        throw new Error('[App] No active account')
      }

      const atc = new algosdk.AtomicTransactionComposer()
      const suggestedParams = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: 'ORX7PDVSFMJ3RQLW5LWDQI66ZJAN3FAYYEBZYDKDCEQU33IPS3RKCNO64A',
        amount: amount*1000000,
        suggestedParams
      })

      atc.addTransaction({ txn: transaction, signer: transactionSigner })

      setIsSending(true)

      const result = await atc.execute(algodClient, 4)

      console.info(`[App] ✅ Successfully sent transaction!`, {
        confirmedRound: result.confirmedRound,
        txIDs: result.txIDs
      })

    } catch (error) {
      console.error('[App] Error signing transaction:', error)
    } finally {
      setIsSending(false)
    }
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
            {wallet.metadata.name} {wallet.isActive ? 'Wallet active' : ''}
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
          
          
          <div className='wallet-buttons'>
            {wallet.isActive && wallet.accounts.length > 0 && (
              <button 
                type="button"
                onClick={() => {
                  sendTransaction(1);
                }}
                disabled={!isConnectDisabled(wallet) || isSending}
              >
                {isSending ? 'Sending Transaction...' : 'Send 1 Algo'}
              </button>
            )}

            {wallet.isActive && wallet.accounts.length > 0 && (
              <button 
                type="button"
                onClick={() => {
                  sendTransaction(5);
                }}
                disabled={!isConnectDisabled(wallet) || isSending}
              >
                {isSending ? 'Sending Transaction...' : 'Send 5 Algo'}
              </button>
            )}
          </div>
          
          {/* Custom amount */}
          {wallet.isActive && wallet.accounts.length > 0  && !isCustomAmount && (
            <button 
              type="button"
              onClick={() => {
                setIsCustomAmount(!isCustomAmount)
              }}
            >
              Other amount
            </button>
          )}

          <div className='wallet-buttons'>
            {wallet.isActive && wallet.accounts.length > 0 && isCustomAmount && (
              <button 
                type="button"
                onClick={() => {
                  if (amount > 0) {
                    setIsWanring(false);
                    sendTransaction(amount);
                  } else {
                    setIsWanring(true);
                  }
                }}
                disabled={!isConnectDisabled(wallet) || isSending}
              >
                {isSending ? 'Sending Transaction...' : 'Send '+amount+' Algo'}
              </button>
            )}
            {wallet.isActive && wallet.accounts.length > 0 && isCustomAmount && (
              <input
                type="number"
                placeholder="Amount (in Algos)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={!isConnectDisabled(wallet) || isSending}
              ></input>
            )}
          </div>
          {wallet.isActive && wallet.accounts.length > 0 && isWanring && (  
            <div className='warning-text'>
              input amount not valid
            </div>
          )}

        </div>
      ))}
    </div>
  )
}
