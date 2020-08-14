import React, { useEffect, useState } from "react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js"
import Alert from '@material-ui/lab/Alert';

// @ts-ignore
import bs58 from "bs58"
import {
  Button,
  Card,
  CardActions,
  CardContent, Chip,
  FormControl, Grid,
  InputLabel, List, ListItem, ListItemText,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useSolana } from "../context/solana"
import { truncate } from "../utils"

const useStyles = makeStyles((theme) => ({
  root: {

  },
  form: {
    marginTop: "10px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const SolTransfer: React.FC = () => {
  const { accounts, connection, signTransaction, network } = useSolana()
  const classes = useStyles();
  const [from, setFrom] = useState<string>("")
  const [to, setTo] = useState<string>("")
  const [amount, setAmount] = useState("")
  // transaction lifecycle
  const [error, setError] = useState()
  const [status, setStatus] = useState()
  const [confirmation, setConfirmation] = useState()
  const [signature, setSignature] = useState()

  if (!connection) {
    return null
  }

  const transfer = (from: string, to: string, amount: number): Promise<void> => {
    const fromPubKey = new PublicKey(from)
    const transaction = SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL
    })

    return new Promise((resolve, reject) => {
      connection.getRecentBlockhash("max").then(rep => {
        transaction.recentBlockhash = rep.blockhash
        signTransaction(bs58.encode(transaction.serializeMessage())).then(data => {
          transaction.addSignature(fromPubKey, bs58.decode(data.result.signature))
          setStatus("Waiting for signature")
          connection.sendRawTransaction(transaction.serialize()).then(signature => {
            setSignature(signature)
            setStatus("Waiting confirmation")

            connection.confirmTransaction(signature, 1).then((status:any) => {
              if (status.err) {
                reject(`Raw transaction ${signature} failed (${JSON.stringify(status)})`)
                return
              }
              setStatus("Confirmation received")
              setConfirmation("" + status.context.slot)
              resolve()
            }).catch(err => {
              reject(`Unable to confirm transaction: ${err}`)
            })
          }).catch(err => {
            reject(`Unable send transaction: ${err}`)
          })
        }).catch(err => {
          reject(err.data.originalError)
        })
      })
    })
  }

  const handleFromChange = (event: any) => {
    setFrom(event.target.value)
  };

  const canSubmit = ():boolean => {
    const amt = parseFloat(amount)
    if (from && (from != "") && to && (to != "") && (amt >= 0)) {
      return true
    }
    return false
  }

  const submit = () => {
    const amt = parseFloat(amount)
    reset()
    transfer(from, to, amt).catch(err => {
      console.log("erere: ", err)
      setError(err)
    })
  }

  const reset = () => {
    setError(undefined)
    setStatus(undefined)
    setConfirmation(undefined)
    setSignature(undefined)
  }

  if (!accounts) {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              asdfasfasd
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid item xs={12} className={classes.form}>
              <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel>From</InputLabel>
                <Select
                  value={from}
                  onChange={handleFromChange}
                >
                  { accounts.map(account => {
                    return (<MenuItem key={`from-${account}`} value={account}>{account}</MenuItem>)
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.form}>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                label="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} className={classes.form}>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {
              error &&
              <Alert severity="error">{error}</Alert>
            }
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem>
                <ListItemText primary="Status" /> {status}
              </ListItem>
              <ListItem>
                <ListItemText primary="First signature" /> {
                signature &&
                <a target="_blank" href={"https://explorer.solana.com/tx/" + signature + "?cluster=" + network}>
                  {truncate(signature,20)}
                </a>
              }
              </ListItem>
              <ListItem>
                <ListItemText primary="Confirmation Slot" />
                { confirmation && <Chip label={confirmation} />}
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ justifyContent: "flex-end" }}>
        <Button  disabled={!canSubmit()} color="primary" onClick={submit}>
          Transfer
        </Button>
      </CardActions>
    </Card>
  )
}