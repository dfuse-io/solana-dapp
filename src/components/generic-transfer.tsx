import React, { useState } from "react"
import { PublicKey, Transaction, TransactionSignature } from "@solana/web3.js"
import Alert from "@material-ui/lab/Alert"
// @ts-ignore
import bs58 from "bs58"
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"
import { useSolana } from "../context/solana"
import { TransferForm } from "./transfer-form"
import Button from "@material-ui/core/Button"

interface GenericTransferProp {
  froms: string[]
  createTransaction: (from: string, to: string, value: number) => Transaction | undefined
  getSigner: (from: string, to: string) => string
}

export const GenericTransfer: React.FC<GenericTransferProp> = ({
  froms,
  createTransaction,
  getSigner,
}) => {
  const { connection, signTransaction, network } = useSolana()
  const [error, setError] = useState()
  const [status, setStatus] = useState<string>()
  const [confirmation, setConfirmation] = useState<string>()
  const [signature, setSignature] = useState<TransactionSignature>()

  if (!connection) {
    return null
  }

  const handleTransfer = (from: string, to: string, amount: number) => {
    transfer(from, to, amount).catch((e) => {
      setError(e)
    })
  }

  const transfer = (from: string, to: string, amount: number): Promise<void> => {
    reset()
    return new Promise((resolve, reject) => {
      const transaction = createTransaction(from, to, amount)
      if (!transaction) {
        reject("Unable to create transaction")
        return
      }
      const signer = getSigner(from, to)

      connection.getRecentBlockhash("max").then((rep) => {
        transaction.recentBlockhash = rep.blockhash
        setStatus("Waiting for authorization")
        signTransaction(bs58.encode(transaction.serializeMessage()), [signer])
          .then((data) => {
            setStatus("Waiting for signature")

            data.result.signatureResults.forEach((signatureResult: any) => {
              console.log(
                "about to add signature: " + signatureResult.signature,
                " for pub key: " + new PublicKey(signatureResult.publicKey).toBase58()
              )
              transaction.addSignature(
                new PublicKey(signatureResult.publicKey),
                bs58.decode(signatureResult.signature)
              )
            })

            setStatus("Sending Transaction")
            connection
              .sendRawTransaction(transaction.serialize())
              .then((signature) => {
                setSignature(signature)
                setStatus("Waiting confirmation")
                connection
                  .confirmTransaction(signature, 1)
                  .then((status: any) => {
                    if (status.err) {
                      reject(`Raw transaction ${signature} failed (${JSON.stringify(status)})`)
                      return
                    }
                    setStatus("Confirmation received")
                    setConfirmation("" + status.context.slot)
                    resolve()
                  })
                  .catch((err) => {
                    console.log("Err: ", err)
                    reject(`Unable to confirm transaction: ${err}`)
                  })
              })
              .catch((err) => {
                console.log("Err: ", err)
                reject(`Unable send transaction: ${err}`)
              })
          })
          .catch((err) => {
            console.log("Err: ", err)
            reject(err.data.originalError)
          })
      })
    })
  }

  const reset = () => {
    setError(undefined)
    setStatus(undefined)
    setConfirmation(undefined)
    setSignature(undefined)
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TransferForm froms={froms} onTransfer={handleTransfer} />
          </Grid>
          <Grid item xs={6}>
            {error && <Alert severity="error">{error}</Alert>}
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem>
                <ListItemText primary="Status" /> {status}
              </ListItem>
              <ListItem>
                <ListItemText primary="First signature" />
                {signature && (
                  <Link
                    target="_blank"
                    href={
                      "https://explorer.solana.com/tx/" + signature + "?cluster=" + network?.cluster
                    }
                  >
                    <Button variant="contained" color="primary">
                      View on explorer
                    </Button>
                  </Link>
                )}
              </ListItem>
              <ListItem>
                <ListItemText primary="Confirmation Slot" />
                {confirmation && <Chip label={confirmation} />}
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
