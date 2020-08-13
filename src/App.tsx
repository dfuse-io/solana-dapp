import React from "react"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core/styles"
import { createMuiTheme } from "@material-ui/core/styles"
// import ProTip from "./ProTip"

export const App: React.FC = () => {
  // TODO: add toggle for dark mode
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#25c2a0",
        contrastText: "#fff",
      },
      secondary: {
        main: "#86b8b6",
        contrastText: "#fff",
      },
      success: {
        main: "#25c2a0",
        contrastText: "#fff",
      },
      info: {
        main: "#43b5c5",
        contrastText: "#fff",
      },
      error: {
        main: "#fa62fc",
        contrastText: "#fff",
      },
    },
  })

  function login() {
    // @ts-ignore
    window.solana
      .request({
        method: "wallet_requestAccounts",
      })
      .then((resp: any) => {
        if (resp.err) {
          console.log("error", resp.err)
          return
        }

        console.log("got accounts:", resp.result.accounts)
      })
      .catch((err: any) => {
        console.log("promised returned err: ", err)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="sm">
        <Box my={4} display="flex" flexDirection="column" alignItems="center">
          <Typography color="primary" variant="h4" component="h1" align="center" gutterBottom>
            Welcome to MegaDapp
          </Typography>
          <Button variant="contained" color="primary" onClick={login}>
            Login
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
