import React from "react"
import { Paper, Tab, Tabs, AppBar, Theme } from "@material-ui/core"
import { SolTransfer } from "../components/sol-transfer"
import { SPLTransfer } from "../components/spl-transfer"
import { DexTransfer } from "../components/dex-transfer"
import { makeStyles } from "@material-ui/core/styles"

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{padding: "25px"}}
      {...other}
    >
      {value === index && children }
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1200,
  },
}));


const TransferPageBase: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0)

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
    <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="SOL Transfer" {...a11yProps(0)} />
          <Tab label="SPL Transfer" {...a11yProps(1)} />
          <Tab label="Dex Order" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SolTransfer/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SPLTransfer/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DexTransfer/>
      </TabPanel>
    </div>
  )
}

export const TransferPage = TransferPageBase
