import React from "react"
import { useSolana } from "../context/solana"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import { TransferPage } from "./transfer"
import Alert from "@material-ui/lab/Alert"

const HomePageBase: React.FC = () => {
  const { state, accounts, requestAccounts } = useSolana()
  const handleConnectClick = () => {
    requestAccounts()
      .then((accounts) => {
        console.log("got accounts:", accounts)
      })
      .catch((err: any) => {
        console.log("promised returned err: ", err)
      })
  }

  if (!state) {
    return (
      <Box my={4} display="flex" flexDirection="column" alignItems="center">
        <Alert severity="warning">
          Solana wallet extension is NOT detected! First make sure it is installed.
        </Alert>
      </Box>
    )
  }

  switch (state.state) {
    case "uninitialized":
      return (
        <Box my={4} display="flex" flexDirection="column" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleConnectClick}>
            Connect to wallet
          </Button>
        </Box>
      )
    case "locked":
      return (
        <Box my={4} display="flex" flexDirection="column" alignItems="center">
          <Alert severity="warning">Solana wallet is locked!</Alert>
        </Box>
      )
    case "unlocked":
      if (!accounts) {
        return (
          <Box my={4} display="flex" flexDirection="column" alignItems="center">
            <Alert severity="warning">Make sure you authorized the application</Alert>
            <Button variant="contained" color="primary" onClick={handleConnectClick}>
              Authorize Application
            </Button>
          </Box>
        )
      }
      return (
        <Box my={4} display="flex" flexDirection="column" alignItems="center">
          <TransferPage />
        </Box>
      )
  }
}

export const HomePage = HomePageBase
