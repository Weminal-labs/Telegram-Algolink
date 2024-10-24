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

  const [isWebAppReady, setIsWebAppReady] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSuccessTranfer, setIsSuccessTranfer] = React.useState(false);
  const [isCustomAmount, setIsCustomAmount] = React.useState(false);
  const [isCreateLink, setIsCreateLink] = React.useState(false);
  const [isWanring, setIsWanring] = React.useState(false);
  const [amount, setAmount] = React.useState(0.0);
  const [link, setLink] = React.useState("");
  const [receiveAddress, setReceiveAddress] = React.useState("ORX7PDVSFMJ3RQLW5LWDQI66ZJAN3FAYYEBZYDKDCEQU33IPS3RKCNO64A");
  const [txIDs, setTxIDs] = React.useState("");

  React.useEffect(() => {
    if (window.Telegram?.WebApp) {
      // Initialize Telegram WebApp
      
      window.Telegram.WebApp.ready();
      setIsWebAppReady(true);
      setReceiveAddress(window.location.search.slice(1));

      
    } else {
      console.warn("Telegram WebApp is not available");
    }
  }, []);

  // Effect to watch for wallet connection changes
  React.useEffect(() => {
    wallets.forEach(wallet => {
      if (wallet.isConnected && wallet.accounts.length > 0 && wallet.activeAccount) {
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'wallet_connected',
            address: wallet.activeAccount.address
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

  const createAlgolink = () => {
    return "https://rare-dodo-frank.ngrok-free.app"+"/algolink?"+activeAddress;
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
        to: receiveAddress,
        amount: amount*1000000,
        suggestedParams
      })

      atc.addTransaction({ txn: transaction, signer: transactionSigner })

      setIsSending(true);
      setIsSuccessTranfer(false);

      const result = await atc.execute(algodClient, 2)

      console.info(`[App] ✅ Successfully sent transaction!`, {
        confirmedRound: result.confirmedRound,
        txIDs: result.txIDs
      })
      setTxIDs(result.txIDs.toString())
      setIsSuccessTranfer(true);

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
                <option key={account.address} value={account.address} selected={account.address==wallet.activeAccount?.address}>
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
              disabled={isSending}
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
                placeholder="Sending Transaction..."
                value={isSending ? "": amount.toString()}
                step="0.01"
                
                onChange={(val) => {
                  if (Number.isInteger(Number(val.target.value)*1000000)) {
                    setAmount(Number(val.target.value));
                  }
                    
                  

                }}
                disabled={!isConnectDisabled(wallet) || isSending}
              ></input>
            )}
          </div>
          {wallet.isActive && wallet.accounts.length > 0 && isWanring && (  
            <div className='warning-text'>
              input amount not valid
            </div>
          )}
          {/* <div className='warning-text'>
              {(wallet.activeAccount?.address)} 
          </div> */}

          {/* Create view transaction */}
          {wallet.isActive && wallet.accounts.length > 0  && isSuccessTranfer && (
            <button 
              type="button"
              onClick={() => {
                
                window.open('https://testnet.explorer.perawallet.app/tx/'+txIDs,'_blank')
              }}
              disabled={isSending}
            >
              View Details Transaction
            </button>
          )}

          {/* Create algolink */}
          {wallet.isActive && wallet.accounts.length > 0  && !isCreateLink && (
            <button 
              type="button"
              onClick={() => {
                setIsCreateLink(!isCreateLink);
                setLink(createAlgolink());
              }}
              disabled={isSending}
            >
              Create my Algolink
            </button>
          )}

          <div className='wallet-buttons'>
            {wallet.isActive && wallet.accounts.length > 0 && isCreateLink && (
              <h5>
                {link.slice(0,10)}..{link.slice(-10)}
              </h5>
            )}
            {wallet.isActive && wallet.accounts.length > 0 && isCreateLink && (
              <button 
                type="button"
                onClick={ async () => {
                  try {
                    await navigator.clipboard.writeText(link);
                    console.log('Content copied to clipboard');
                  } catch (err) {
                    console.error('Failed to copy: ', err);
                  }
                }}
                disabled={isSending}
              >
                Copy
              </button>
            )}
            
          </div>
        </div>

      ))}
    </div>
  )
}
