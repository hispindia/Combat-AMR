
import React, { useRef, useEffect, useState } from 'react'

import { useReactToPrint } from "react-to-print";
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box';
import moment from "moment";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  Typography,
} from "@material-ui/core";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow,{ tableRowClasses } from '@mui/material/TableRow';


import Grid from "@material-ui/core/Grid";
import { makeStyles,withStyles } from '@mui/styles';
import {
  SAMPLE_TYPEID,
  PATHOGEN_POSITIVE,
  PATHOGEN_NEGATIVE,
  CR_NUMBER,
  LAB_ID,
  LOCATION,
  DEPARTMENT,
  PATIENT_OUTCOME,
  NAME,
  SAMPLE_DATE,
  REGISTRATION_DATE,
  SAMPLE_TYPE,
  GENDER,
  AGE,
  PATHOGEN_G,
  PATHOGEN,
  AST,
  NOTES
} from './Entity/constants';
import './Entity/print.css';




const commonStyles = {
  bgcolor: 'background.paper',
  m: 1,
  borderColor: 'text.primary',
  width: '5rem',
  height: '5rem',
};

const useStyles = makeStyles({
  root: {},
    tableRightBorder: {
        borderWidth: 0,
        borderRightWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
    },
});


export default function EventPrint(props) {
    const classes = useStyles();
  var cliEvents = props.cliEve;

  var {	program,
        organism,
        sampleDate,
        programs
  } = useSelector(state => state.data.panel)

  const [open, setOpen] = React.useState(true);
  const ref = useRef();
  var allEntity = useSelector(state => state.data.entity.attributes)
  var entityValues = useSelector(state => state.data.entity.values)
  var eventVals = useSelector(state => state.data.event.values)
  var allEvent = useSelector(state => state.metadata.dataElements)
  const { programOrganisms, optionSets } = useSelector(state => state.metadata)
  var eventsList = useSelector(state => state.data.eventList);

  var clini = []

for (const [alkey, akeyvalue] of Object.entries(allEvent)) {
   if (akeyvalue.toLowerCase().includes("outcome".toLowerCase())|| akeyvalue.toLowerCase().includes("notes".toLowerCase())|| akeyvalue.toLowerCase().includes("ast".toLowerCase())) {
     clini.push(alkey)
   }
}


  var eventCliniVals = []

  eventsList.forEach((ev, index) => {
    var cliDvs = {}
    var isCliEves = false
    if (cliEvents.length !== 0) {
          isCliEves = cliEvents[0].includes(ev.event)
    }
    if (isCliEves) {
      for (let valueCli of ev.dataValues) {
        if (clini.includes(valueCli.dataElement)) {
          cliDvs[valueCli.dataElement] = valueCli.value.split("-")[0]
        }
      }
      eventCliniVals.push(cliDvs)
    }
  })

  var entityDict = {}
  var eventDict = {}
  var programDict = {}
  var antiBioDict = {}


    programs.forEach((pn, index) => {
      var label = pn.label
      if (program == pn.value) {
          programDict = {
            ...programDict,
            [program]:label
          }
      }
    });



  for (const [key, value] of Object.entries(entityValues)) {
    allEntity.forEach((n, index) => {
      var label = n.trackedEntityAttribute.displayName
      if (key == n.trackedEntityAttribute.id) {
        if (value) {
          entityDict = {
            ...entityDict,
            [label]: value
          }
        }
      }
    });
  }

  for (const [key, value] of Object.entries(eventVals)) {
    for (const [al, avalue] of Object.entries(allEvent)) {
      var label = avalue
      if (key == al) {
        if (value) {
          if (label.includes("Result")) {
            antiBioDict = {
              ...antiBioDict,
              [label.split("_")[0]]:value
            }
          }
        }
      }
    }
  }


  for (const [key, value] of Object.entries(eventVals)) {
    for (const [al, avalue] of Object.entries(allEvent)) {

      var label = avalue
      if (key == al) {
        if (value) {
          if (!label.includes("Result") && !label.includes("_DD") && !label.includes("_MIC") && !label.includes("Test")) {
            eventDict = {
            ...eventDict,
            [label]: value
          }
          }
        }
      }
    }
  }


  var eventCliDict = {}
  var eventClinical = []

  if (eventCliniVals.length !== 0) {
    for (let ekeycli of eventCliniVals) {
      for (const [key, value] of Object.entries(ekeycli)) {
        for (const [al, avalue] of Object.entries(allEvent)) {
          var label = avalue.replace(/['"]+/g, '').replace(/\s+$/, '');
          if (key == al) {
            if (value) {
              if (!label.includes("_DD") && !label.includes("_MIC") && !label.includes("Test")) {
                eventCliDict = {
                  ...eventCliDict,
                  [label]: value
                }
              }
            }
          }
        }
      }
      eventClinical.push(eventCliDict)
    }
  }

const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => handleClose()
});

  const handleClose = () => {
    setOpen(false);
    props.onPrint(false)
  };

  var hospitaldep = eventDict[DEPARTMENT];
  var labId = eventDict[LAB_ID]
  var pathogen = eventDict["Pathogen"]
  var location = eventDict[LOCATION]
  var sample = eventDict["Sample type"]

  optionSets[SAMPLE_TYPEID].forEach(o => {
    if (o.value == sample) {
          sample = o.label
      }
  });

  optionSets[PATHOGEN_POSITIVE].forEach(o => {
      if (o.value == pathogen) {
          pathogen = o.label
      }
  });

  optionSets[PATHOGEN_NEGATIVE].forEach(o => {
      if (o.value == pathogen) {
          pathogen = o.label
      }
  });


return (
<Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >

  <DialogContent dividers ref={ref}>
  <h2>Patient Report</h2>
    <Box sx={{ border:'1px solid black',fontSize: 12, m: 1 }}>
    <Box sx={{ border:2,fontSize: 12, ml: 6,mr:6,mt:1,mb:1}}>
      <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none"}}}>
          <TableBody>
            <TableRow>
              <TableCell style={{width: '30%'}}>
                <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{ CR_NUMBER } :&nbsp;&nbsp;&nbsp;&nbsp; { entityDict["Registration number"] }</Box>
                </Typography>
              </TableCell>

              <TableCell style={{width: '40%',textAlign:'center'}}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{ NAME } :&nbsp;&nbsp;&nbsp;&nbsp; { entityDict["First name"]}</Box></Typography>
              </TableCell>
                  <TableCell style={{ width: '30%',textAlign:'right'}}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{ REGISTRATION_DATE } :&nbsp;&nbsp;&nbsp;&nbsp; {moment(entityDict["Registration date"]).format('DD/MM/yyyy')}</Box></Typography>
              </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{width: '30%'}}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{ GENDER } :&nbsp;&nbsp;&nbsp;&nbsp; { entityDict[GENDER]}</Box></Typography>
                  </TableCell>
                  <TableCell style={{width: '30%',textAlign:'center'}}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{ AGE } :&nbsp;&nbsp;&nbsp;&nbsp; {moment().diff(entityDict["Age / DOB"],'years')} y</Box></Typography>
              </TableCell>
                </TableRow>
        </TableBody>
      </Table>
    </Box>

    <Box sx={{ border:1,fontSize: 10,  ml: 6,mr:6,mt:1,mb:1 }}>

        <Table sx={{
    [`& .${tableCellClasses.root}`]: {
      borderBottom: "none"
    }
  }}>
            <TableBody>

            <TableRow>
                <TableCell style={{width:'40%'}}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{DEPARTMENT } :&nbsp;&nbsp;{eventDict["Hospital department"]}</Box></Typography>
                </TableCell>
                <TableCell style={{width:'30%'}}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{SAMPLE_TYPE} :&nbsp;&nbsp;{sample}</Box></Typography>
              </TableCell>
              <TableCell style={{width:'30%',textAlign:'right'}}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{PATHOGEN_G} :&nbsp;&nbsp;{programDict[program]}</Box></Typography>
              </TableCell>
              </TableRow>

              <TableRow>

              <TableCell style={{width:'40%'}}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{LAB_ID} :&nbsp;&nbsp;{ eventDict[LAB_ID]}</Box></Typography>
              </TableCell>
              <TableCell style={{width:'30%'}}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{LOCATION} :&nbsp;&nbsp;{eventDict[LOCATION]}</Box>
                </Typography>
                </TableCell>
              <TableCell style={{width:'30%',textAlign:'right'}}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{SAMPLE_DATE }: :&nbsp;&nbsp;{moment(eventDict["Sample date"]).format("DD/MM/yyyy")}</Box></Typography>
              </TableCell>
              </TableRow>


              <TableRow>
              <TableCell style={{ width: '40%' }}>
                <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{PATHOGEN} :&nbsp;&nbsp;&nbsp;&nbsp;{ pathogen }</Box></Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>

            </TableBody>
          </Table>

          <Table sx={{
    [`& .${tableCellClasses.root}`]: {
      borderBottom: "none"
              }
            }}>
            <TableBody>
            <Box sx={{ border:1,fontSize: 10, ml: 20, mr: 20,mt:1,mb:1, borderBottom: 0,borderRight:0 }}>
              {
              Object.keys(antiBioDict).map((key, index) => (
                <TableRow >
                  <TableCell className={classes.tableRightBorder + ' ' + "antibio"} style={{width: '10%',borderBottom: '1px solid black'}}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 10, m: 1 }}>{ index + 1 }</Box>
                    </Typography>
                  </TableCell>

                  <TableCell className={classes.tableRightBorder + ' ' + "antibio"} style={{width: '60%',textAlign:'center',borderBottom: '1px solid black'}}>
                    <Typography>
                        <Box className="boxClass" sx={{ fontSize: 10, m: 1 }}>{key}</Box>
                    </Typography>
                  </TableCell>
                  <TableCell className="antibio" style={{borderBottom: '1px solid black'}}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 10, m: 1 }}></Box>
                    </Typography>
                  </TableCell>

                    <TableCell className={classes.tableRightBorder + ' ' + "antibio"} style={{width: '60%',textAlign:'left',borderBottom: '1px solid black'}}>
                      <Typography>
                      <Box  className="boxClass" sx={{ fontSize: 10, m: 1 }}>{ antiBioDict[key]}</Box>
                      </Typography>
                  </TableCell>

                </TableRow>
              ))
                }
                </Box>
                </TableBody>
              </Table>
        </Box>

        {eventClinical.length !==0 ?
          <Box sx={{ border: 2, fontSize: 12, ml: 6, mr: 6, mt: 1, mb: 1 }}>
            <Table sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none"
              }
            }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '30%' }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{AST}</Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" >
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{eventClinical[0][AST]}</Box>
                    </Typography>
                  </TableCell>

                  <TableCell style={{ width: '50%' }}>
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{PATIENT_OUTCOME}</Box></Typography>
                  </TableCell>
                  <TableCell >
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{eventClinical[0]["Patients outcome"]}</Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell >
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{NOTES}</Box></Typography>
                  </TableCell>
                  <TableCell style={{ width: '50%' }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>{eventClinical[0][NOTES]}</Box>
                    </Typography>
                  </TableCell>&emsp;&emsp;
                  <TableCell >
                    <Typography><Box className="boxClass" sx={{ fontSize: 12, m: 1 }}></Box></Typography>
                  </TableCell>
                  <TableCell >
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>

                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
: ""}
          </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
      );
    }
