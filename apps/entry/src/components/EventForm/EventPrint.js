import React, { useRef } from "react";
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
import { SAMPLE_TYPEID, PATHOGEN_POSITIVE, PATHOGEN_NEGATIVE } from './Entity/constants';



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

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 10
  }
}))(TableRow);



export default function EventPrint(props) {
    const classes = useStyles();

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
  console.log(" OPTIONS SETSS ", optionSets);

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
      console.log(" All Eventsss :>>>>> ", allEvent);
      console.log(" All Eventsss VALSSS :>>>>> ", eventVals);

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


const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => handleClose()
});

  const handleClose = () => {
    setOpen(false);
    props.onPrint(false)
  };

  var hospitaldep = eventDict["Hospital department"];
  var labId = eventDict["Lab ID"]
  var pathogen = eventDict["Pathogen"]
  var location = eventDict["Patient Location"]
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
    <Box sx={{ border:1,fontSize: 12, m: 1 }}>
    <Box sx={{ border:1,fontSize: 12, m: 2 }}>
      <Table sx={{
    [`& .${tableCellClasses.root}`]: {
      borderBottom: "none"
    }
  }}>
          <TableBody>
            <StyledTableRow>
              <TableCell>
                <Typography>
                  <Box sx={{ fontSize: 12, m: 1 }}>CR NUMBER</Box>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" >
                  <Box sx={{ fontSize: 12, m: 1 }}>{ entityDict["Registration number"] }</Box>
                  </Typography>
              </TableCell>&emsp;&emsp;

              <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>GENDER</Box></Typography>
              </TableCell>
              <TableCell >
                    <Box sx={{ fontSize: 12, m: 1 }}>{ entityDict["Gender"].toUpperCase()}</Box>
              </TableCell>
              </StyledTableRow>

            <StyledTableRow>
              <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>PATIENT NAME</Box></Typography>
              </TableCell>
              <TableCell >
                    <Typography>
                      <Box sx={{ fontSize: 12, m: 1 }}>{ entityDict["First name"].toUpperCase()}</Box>
                </Typography>
              </TableCell>&emsp;&emsp;
              <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>AGE</Box></Typography>
              </TableCell>
              <TableCell >
                <Typography>
                   <Box sx={{ fontSize: 12, m: 1 }}>
                    {moment().diff(entityDict["Age / DOB"],'years')} y
                    </Box>
                </Typography>
              </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </Box>

    <Box sx={{ border:1,fontSize: 10, m: 2 }}>
            <Table sx={{
    [`& .${tableCellClasses.root}`]: {
      borderBottom: "none"
    }
  }}>
            <TableBody>
              <TableRow style={{height: 10}}>
                <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>LOCATION</Box></Typography>
                </TableCell>
                <TableCell>
                <Box sx={{ fontSize: 12, m: 1 }}>{location.toUpperCase()}</Box>
                </TableCell>

                <TableCell>
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>LAB ID</Box></Typography>
                </TableCell>
                <TableCell>
                <Typography>
                <Box sx={{ fontSize: 12, m: 1 }}>{ labId.toUpperCase() }</Box>
                </Typography>
                </TableCell>
              </TableRow>

              <TableRow style={{height: 10}}>
                <TableCell>
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>PATHOGEN GROUP</Box></Typography>
                </TableCell>
                <TableCell>
                <Typography>
                <Box sx={{ fontSize: 12, m: 1 }}>{ programDict[program].toUpperCase() }</Box>
                </Typography>
                </TableCell>

                <TableCell>
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>PATHOGEN</Box></Typography>
                </TableCell>
                <TableCell>
                <Typography>
                <Box sx={{ fontSize: 12, m: 1 }}>{ pathogen.toUpperCase() }</Box>
                </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>HOSPITAL DEPARTMENT</Box></Typography>
                </TableCell>
                <TableCell>
                <Box sx={{ fontSize: 12, m: 1 }}>{hospitaldep.toUpperCase()}</Box>
                </TableCell>
                <TableCell >
                <Typography><Box sx={{ fontSize: 12, m: 1 }}>SAMPLE TYPE</Box></Typography>
                </TableCell>
                <TableCell>
                <Box sx={{ fontSize: 12, m: 1 }}>{sample.toUpperCase()}</Box>
                </TableCell>
              </TableRow>

              <TableRow>
              <TableCell >
              <Typography><Box sx={{ fontSize: 12, m: 1 }}>SAMPLE DATE</Box></Typography>
              </TableCell>
              <TableCell>
              <Box sx={{ fontSize: 12, m: 1 }}>{moment(sampleDate).format("DD/MM/yyyy")}</Box>
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
            <Box sx={{ border:1,fontSize: 10, ml: 15, mr: 15, borderBottom: 0 }}>
              {
              Object.keys(antiBioDict).map((key, index) => (
                <StyledTableRow >
                  <TableCell>
                    <Typography><Box>{ index + 1 }</Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography><Box ></Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                        <Box sx={{ fontSize: 10, m: 1 }}>{key.toUpperCase()}</Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <Box sx={{ fontSize: 10, m: 1 }}></Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <Box sx={{ fontSize: 10, m: 1 }}></Box>
                    </Typography>
                  </TableCell>
                    <TableCell >
                      <Typography>
                      <Box sx={{ fontSize: 10, m: 1 }}>{ antiBioDict[key].toUpperCase()}</Box>
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography><Box></Box>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography><Box></Box>
                    </Typography>
                  </TableCell>

                </StyledTableRow>
              ))
                }
                </Box>
                </TableBody>
              </Table>
              </Box>
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
