import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import AppBar from "@material-ui/core/AppBar"
import Typography from "@material-ui/core/Typography"
import { Chip } from "@material-ui/core"
import WifiOutlinedIcon from "@material-ui/icons/WifiOutlined"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { makeStyles } from "@material-ui/core/styles"
import { useSolana } from "../context/solana"

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))

export const NavigationFrame: React.FC = ({ children }) => {
  const { state, network } = useSolana()
  const classes = useStyles()

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Solana Wallet Demo
          </Typography>
          <div className={classes.grow} />
          {state?.state === "locked" && (
            <Chip icon={<LockOutlinedIcon />} label="wallet locked" color="secondary" />
          )}
          {state?.state === "unlocked" && (
            <Chip icon={<WifiOutlinedIcon />} label={network?.endpoint} color="secondary" />
          )}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{children}</main>
    </>
  )
}
