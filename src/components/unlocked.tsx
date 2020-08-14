import React from "react"
import { Paper, Tab, Tabs } from "@material-ui/core"

export const Unlocked: React.FC = () => {
  const [value, setValue] = React.useState(2)

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Paper square>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="SOL Transfer"></Tab>
        <Tab label="Disabled" disabled/>
        <Tab label="Active"/>
      </Tabs>
    </Paper>
  )
}