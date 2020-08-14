import React from "react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { GenericTransfer } from "./generic-transfer"
import { useSolana } from "../context/solana"


export const SolTransfer: React.FC = () => {
  const { accounts } = useSolana()

  const getSigner = (from: string, to: string):string => {
    return from
  }

  const createTransaction = (from: string, to: string, amount: number): (Transaction | undefined) => {
    return SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL
    })
  }

  if (!accounts) {
    return null
  }

  return (
    <>
      <h3>SOL Transfer</h3>
      <GenericTransfer
        froms={accounts}
        createTransaction={createTransaction}
        getSigner={getSigner}
      />
    </>
  )
}