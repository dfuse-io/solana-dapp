import React, { createContext, useContext, useEffect, useState } from "react"
import { Network, WalletActions, WalletState } from "../types"
import { Connection } from "@solana/web3.js"

interface SolanaContextType {
  requestAccounts: (promptAuthorization: boolean) => Promise<string[]>
  signTransaction: (message: string, signers: string[]) => Promise<any>
  connection: Connection | undefined
  state: WalletState | undefined
  network: Network | undefined
  accounts: string[] | undefined
}

export const SolanaContext = createContext<SolanaContextType | null>(null)

export function SolanaProvider(props: React.PropsWithChildren<{}>) {
  let [solana, setSolana] = useState<any>()
  const [state, setState] = useState<WalletState>()
  const [network, setNetwork] = useState<Network>()
  const [accounts, setAccounts] = useState<string[]>()
  const [connection, setConnection] = useState<Connection>()

  const onStateChanged = (state: WalletState) => {
    console.log("dapp onStateChanged:", state)
    setState(state)
    if (state.state === "unlocked") {
      requestCluster()
    }
  }

  const onClusterChange = (cluster: Network) => {
    console.log("dapp onClusterChange:", cluster)
    if (cluster) {
      setNetwork(cluster)
      setConnection(new Connection(cluster.endpoint))
      requestAccounts(false)
    }
  }

  const onAccountChange = (acts: string[]) => {
    console.log("dapp onAccountChange:", acts)
    setAccounts(acts)
  }

  const requestState = () => {
    request("wallet_getState", {}).then((resp) => {
      console.log("requestState response: ", resp)
      onStateChanged(resp.result)
    })
  }

  const requestCluster = () => {
    request("wallet_getCluster", {}).then((resp) => {
      console.log("requestCluster response: ", resp)
      onClusterChange(resp.result)
    })
  }

  // TODO: we need better typing
  const signTransaction = (message: string, signers: string[]): Promise<any> => {
    console.log("message ", message)
    return new Promise<string>(function (resolve, reject) {
      request("wallet_signTransaction", {
        message: message,
        signer: signers,
      })
        .then((resp) => {
          resolve(resp)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const requestAccounts = (promptAuthorization: boolean): Promise<string[]> => {
    return new Promise<string[]>(function (resolve, reject) {
      request("wallet_requestAccounts", {
        promptAuthorization: promptAuthorization,
      })
        .then((resp) => {
          const accounts = resp.result.accounts
          onAccountChange(accounts)
          resolve(accounts)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  useEffect(() => {
    let listenning = false
    // @ts-ignore
    if (window.solana) {
      // @ts-ignore
      setSolana(window.solana)
    } else {
      listenning = true
      window.addEventListener("solana#initialized", function (event) {
        // @ts-ignore
        setSolana(window.solana)
      })
    }
    return () => {
      if (listenning) {
        window.removeEventListener("solana#initialized", () => {})
      }
    }
  }, [])

  useEffect(() => {
    if (!solana) {
      console.log("solana not yet initialized: ")
      return
    }
    console.log("solana initialized")
    solana.on("accountsChanged", onAccountChange)
    solana.on("stateChanged", onStateChanged)
    solana.on("clusterChanged", onClusterChange)

    requestState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solana])

  const request = (method: WalletActions, params: any): Promise<any> => {
    return new Promise<any>(function (resolve, reject) {
      solana
        .request({
          method: method,
          params: params,
        })
        .then((resp: any) => {
          console.log("resp: ", resp)
          resolve(resp)
        })
        .catch((err: any) => {
          console.log("err: ", err)
          reject(err)
        })
    })
  }

  return (
    <SolanaContext.Provider
      value={{
        requestAccounts,
        signTransaction,
        state,
        network,
        accounts,
        connection,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  )
}

export function useSolana() {
  const context = useContext(SolanaContext)
  if (!context) {
    throw new Error("Solana not found, must be used within the SolanaProvider")
  }
  return context
}
