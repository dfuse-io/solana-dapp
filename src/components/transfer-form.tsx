import React, { useState } from "react"
// @ts-ignore
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "10px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

interface TransferProps {
  froms: string[]
  onTransfer: (from: string, to: string, value: number) => void
}

export const TransferForm: React.FC<TransferProps> = ({ froms, onTransfer }) => {
  const classes = useStyles()
  const [from, setFrom] = useState<string>("")
  const [to, setTo] = useState<string>("")
  const [amount, setAmount] = useState("")

  const handleFromChange = (event: any) => {
    setFrom(event.target.value)
  }

  const canSubmit = (): boolean => {
    const amt = parseFloat(amount)
    if (from && (from != "") && to && (to != "") && (amt >= 0)) {
      return true
    }
    return false
  }

  const submit = () => {
    const amt = parseFloat(amount)
    onTransfer(from, to, amt)
  }

  return (
    <>
      <Grid item xs={12} className={classes.form}>
        <FormControl className={classes.formControl} fullWidth={true}>
          <InputLabel>From</InputLabel>
          <Select
            value={from}
            onChange={handleFromChange}
          >
            {froms.map(from => {
              return (<MenuItem key={`from-${from}`} value={from}>{from}</MenuItem>)
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
      <Grid item xs={12} className={classes.form}>
        <Button variant="contained" disabled={!canSubmit()} color="primary" onClick={submit}>
          Transfer
        </Button>
      </Grid>
    </>
  )
}