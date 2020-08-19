import React, { useState } from "react"
import { Card, CardContent, Grid, List, ListItem, ListItemText } from "@material-ui/core"
import { Market, OpenOrders } from "@project-serum/serum"
import { makeStyles } from "@material-ui/core/styles"
import { PublicKey } from "@solana/web3.js"
import { useSolana } from "../context/solana"

const useStyles = makeStyles((theme) => ({
  root: {},
  section: {
    paddingRight: "5px",
    paddingLeft: "5px",
  },
}))

interface OrderListProp {
  market: Market | undefined
  owner: string | undefined
}

export const DexOrderList: React.FC<OrderListProp> = ({ market, owner }) => {
  const { connection } = useSolana()
  const classes = useStyles()
  const [openOrders, setOpenOrders] = useState<OpenOrders[]>([])

  if (!market || !owner || !connection) {
    return <p>nada</p>
  }

  market.findOpenOrdersAccountsForOwner(connection, new PublicKey(owner)).then((orders) => {
    setOpenOrders(orders)
  })

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={6} className={classes.section}>
            <h3>Market</h3>
            <p>{market.address.toBase58()}</p>
            <List disablePadding>
              {openOrders.map((order) => (
                <DexOrderListItem openOrders={order} />
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

interface DexOrderListItemProps {
  openOrders: OpenOrders
}

const DexOrderListItem: React.FC<DexOrderListItemProps> = ({ openOrders }) => {
  return (
    <>
      <ListItem>
        <ListItemText>{openOrders.address}</ListItemText>
      </ListItem>
    </>
  )
}
