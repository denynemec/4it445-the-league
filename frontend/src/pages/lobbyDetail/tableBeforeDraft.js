import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const {children,value,index,...other} = props;

  return ( 
  <Typography component = "div" role = "tabpanel"
    hidden = {value !== index}
    id = {`simple-tabpanel-${index}`}
    aria-labelledby = {`simple-tab-${index}`} {...other} >
    <Box p = {3} > {children}
    </Box>  
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return ( 
    <div className = {classes.root}>
    <AppBar position = "static">
    <Tabs value = {value}
    onChange = {handleChange}
    width = "50%"
    aria-label = "simple tabs example">
    <Tab label = "Před Draftem" {...a11yProps(0)}/>
      <Tab label = "Po Draftu" {...a11yProps(1)}/> 
       </Tabs> 
       </AppBar>  
       <TabPanel value = {value} index = {0} >
    <Box width = "25vw" display = "inline-block"m = {2} pr = {5} >
    <Box width = "25vw" fontWeight = "fontWeightBold" align = "center" py = {1}> Termín draftu </Box> 
    <Box border = {1} width = "25vw" align = "center" py = {1}> 1.06 .2020 </Box> 
    <Box width = "25vw" fontWeight = "fontWeightBold" align = "center" py = {1}> Lidí příhlášeno / Celkem příhlašeno </Box> 
    <Box border = {1} width = "25vw" align = "center" py = {1} > 4 / 6 </Box> 
    </Box>
     <Box width = "25vw" display = "inline-block" border = {1} m = {2} >
    <Box borderBottom = {1} width = "25vw" fontWeight = "fontWeightBold" align = "center" py = {1} > Příhlašeno lidí </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1}> Kirill </Box>
    <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > Daniel </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > Martín </Box> 
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > Juraj </Box>
      <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > --- </Box>
       <Box width = "25vw"align = "center" py = {1} > --- </Box> 
       </Box>
        <Box width = "25vw" display = "inline-block" border = {1} mr = {2} >
    <Box borderBottom = {1} width = "25vw" fontWeight = "fontWeightBold" align = "center" py = {1} > Čekame lidí </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > Ondřej </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > Matiáš </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > --- </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > --- </Box>
     <Box borderBottom = {1} width = "25vw" align = "center" py = {1} > --- </Box> 
     <Box width = "25vw" align = "center" py = {1} > --- </Box> 
     </Box>
     </TabPanel> 
     <AppBarTabPanel value = {value} index = {1} >

    </TabPanel>
    </div>
  );
}