import React, { useEffect, useState } from "react"
import { useSolana } from "../context/solana"
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { Buffer } from "buffer"
import { GenericTransfer } from "./generic-transfer"
// @ts-ignore FIXME We need to add a mock definition of this library to the overall project
import BufferLayout from "buffer-layout"
import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: "10px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
}))


export const SPLTransfer: React.FC = () => {
  const classes = useStyles()
  const { accounts, connection } = useSolana()
  const [owner, setOwner] = useState<string>()
  const [keys, setKeys] = useState<string[]>([])

  const getOwnedAccounts = (accountKey: string, conn: Connection) => {
    console.log("fetching owned accounts for:", accountKey)
    const publicKey = new PublicKey(accountKey)
    conn.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    }).then(resp => {
      const k = resp.value.map(v => {
        return v.pubkey.toBase58()
      })
      setKeys(k)
    }).catch(err => {
      console.log("Unable to retrieve owner account:", err)
    })
  }

  useEffect(() => {
    if(owner && connection) {
      getOwnedAccounts(owner, connection)
    }
  }, [owner, connection])


  // useEffect(() => {
  //   if (owner){
  //     setOwner(accounts[2])
  //   }
  //
  // }, [owner])

  const getSigner = (from: string, to: string):string => {
    return owner || from
  }

  const createTransaction = (from: string, to: string, amount: number): (Transaction | undefined) => {
    if (!owner) {
      return undefined
    }

    const fromPubKey = new PublicKey(from)
    const toPubKey = new PublicKey(to)
    const ownerPubKey = new PublicKey(owner)
    const tokenProgramId = TOKEN_PROGRAM_ID
    const bufferLayout = BufferLayout.union(BufferLayout.u8('instruction'));
    bufferLayout.addVariant(
      3,
      BufferLayout.struct([
        BufferLayout.nu64('amount')
      ]),
      'transfer',
    );

    const instructionMaxSpan = Math.max(
      ...Object.values(bufferLayout.registry).map((r: any) => r.span),
    );
    let b = Buffer.alloc(instructionMaxSpan);
    let span = bufferLayout.encode({
      transfer: {amount: amount * Math.pow(10, 2)}
    }, b);
    const encodedData = b.slice(0, span);
    const transaction = new Transaction()
    transaction.add(new TransactionInstruction({
      keys: [
        { pubkey: fromPubKey, isSigner: false, isWritable: true },
        { pubkey: toPubKey, isSigner: false, isWritable: true },
        { pubkey: ownerPubKey, isSigner: true, isWritable: false },
      ],
      data: encodedData,
      programId: tokenProgramId,
    }))
    console.log("transaction: ", transaction.instructions[0])
    console.log("buff: ", encodedData.toString("hex"))
    return transaction
  }

  if (!accounts || !connection) {
    return null
  }

  if (!keys) {
    return null
  }

  return (
    <>
      <h3>SPL Transfer</h3>
      <Card>
        <Grid container spacing={3}>
          <Grid item xs={6} >
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel>Select am owner</InputLabel>
              <Select
                value={owner}
                onChange={(e) => {setOwner(e.target.value as string)}}
              >
                {accounts.map(account => {
                  return (<MenuItem key={`account-${account}`} value={account}>{account}</MenuItem>)
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} >
            <GenericTransfer
              froms={keys}
              createTransaction={createTransaction}
              getSigner={getSigner}
            />
          </Grid>
        </Grid>
      </Card>

    </>

  )
}