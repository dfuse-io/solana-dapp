import React from "react"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core/styles"
import { createMuiTheme } from "@material-ui/core/styles"
import { NavigationFrame } from "../components/navigation"
import { SolanaContext, SolanaProvider } from "../context/solana"
import { HomePage } from "./home"
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
        main: "rgb(220, 0, 78)",
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

  return (
    <ThemeProvider theme={theme}>
      <SolanaProvider>
        <CssBaseline />
        <NavigationFrame>
          <HomePage />
        </NavigationFrame>
      </SolanaProvider>
    </ThemeProvider>
  )
}
