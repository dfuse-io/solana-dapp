
// **********************************************
// These types should be provided by our extensions
// **********************************************
export type Network   = {
  title: string
  endpoint: string
  cluster: string
}


export type WalletActions =
  | "wallet_requestPermissions"
  | "wallet_signTransaction"
  | "wallet_requestAccounts"
  | "wallet_getCluster"
  | "wallet_getState"

export type WalletState = {
  state: "locked" | "unlocked" | "uninitialized"
}

