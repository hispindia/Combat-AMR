import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
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
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

// import Grid from "@material-ui/core/Grid";
import Grid from "@mui/material/Grid";

// import EAS from '../../../asssts/EAS.jpg';
// import JIMA from "../../../asssts/JIMA.jpg";

import { EAS } from "../../../asssts/index";
import { JIMA } from "../../../asssts/index";

import { makeStyles, withStyles } from "@mui/styles";
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
  REASON_FOR_REJECTION,
  AST,
  NOTES,
} from "./constants";
import "./print.css";

const useStyles = makeStyles({
  root: {},
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
});

const EXCEPTION_CONDITION = [
  "AFB staining",
  "KOH staining",
  "Indian Ink (Negative staining)",
  "Giemsa Staining",
];

export default function EventListPrint(props) {
  var eventVals2 = [];
  var eventCliniVals = [];
  var eventLDict = [];
  var eventClinical = [];
  var clini = [];
  var entityDict = {};
  var programDict = {};
  var antiBioDict = {};
  var eventCliDict = {};

  const classes = useStyles();
  var eventIDs = props.eve;
  var cliEvents = props.cliEve;
  var { program, organism, sampleDate, programs } = useSelector(
    (state) => state.data.panel
  );

  const [open, setOpen] = React.useState(true);
  const ref = useRef();
  var allEntity = useSelector((state) => state.data.entity.attributes);
  var entityValues = useSelector((state) => state.data.entity.values);
  var eventVals = useSelector((state) => state.data.event.values);

  var allEvent = useSelector((state) => state.metadata.dataElements);
  const { programOrganisms, optionSets } = useSelector(
    (state) => state.metadata
  );
  var eventsList = useSelector((state) => state.data.eventList);
  const [eventSpe, setEventSpe] = React.useState([]);

  for (const [alkey, akeyvalue] of Object.entries(allEvent)) {
    if (
      akeyvalue.toLowerCase().includes("outcome".toLowerCase()) ||
      akeyvalue.toLowerCase().includes("notes".toLowerCase()) ||
      akeyvalue.toLowerCase().includes("ast".toLowerCase())
    ) {
      clini.push(alkey);
    }
  }

  eventsList.forEach((ev, index) => {
    var dVs = {};
    var cliDvs = {};
    var isEve = eventIDs[0].includes(ev.event);
    console.log("ev===============", ev);
    var isCliEves = false;
    if (cliEvents.length !== 0) {
      isCliEves = cliEvents[0].includes(ev.event);
    }
    if (isEve) {
      for (let value of ev.dataValues) {
        dVs[value.dataElement] = value.value;
      }
      dVs[SAMPLE_DATE] = ev.eventDate;
      dVs[PATHOGEN_G] = ev.program;
      dVs[REGISTRATION_DATE] = ev.created;
      eventVals2.push(dVs);
    }
    if (isCliEves) {
      for (let valueCli of ev.dataValues) {
        if (clini.includes(valueCli.dataElement)) {
          cliDvs[valueCli.dataElement] = valueCli.value.split("-")[0];
        }
      }
      eventCliniVals.push(cliDvs);
    }
  });
  console.log("eventCliniVals============", eventCliniVals);
  programs.forEach((pn, index) => {
    var label = pn.label;
    if (program == pn.value) {
      programDict = {
        ...programDict,
        [program]: label,
      };
    }
  });

  for (const [key, value] of Object.entries(entityValues)) {
    allEntity.forEach((n, index) => {
      var label = n.trackedEntityAttribute.displayName;
      if (key == n.trackedEntityAttribute.id) {
        if (value) {
          entityDict = {
            ...entityDict,
            [label]: value,
          };
        }
      }
    });
  }

  function getProgram(proId) {
    var name = "";
    for (let program of programs) {
      if (program.value == proId) {
        name = program.label;
      }
    }
    return name;
  }

  for (let ekey of eventVals2) {
    var eventDict = {};

    for (const [key, value] of Object.entries(ekey)) {
      if (key == SAMPLE_DATE) {
        eventDict = {
          ...eventDict,
          [key]: value,
        };
      }
      if (key == PATHOGEN_G) {
        var pvalue = getProgram(value);
        eventDict = {
          ...eventDict,
          [key]: pvalue,
        };
      }
      if (key == REGISTRATION_DATE) {
        entityDict = {
          ...entityDict,
          [key]: value,
        };
      }
      for (const [al, avalue] of Object.entries(allEvent)) {
        // console.log("al, avalue=====", [al, avalue]);
        var label = avalue;
        if (key == al) {
          if (value) {
            if (
              !label.includes("_DD") &&
              !label.includes("_MIC") &&
              !label.includes("Test")
            ) {
              eventDict = {
                ...eventDict,
                [label]: value,
              };
            }
          }
        }
      }
    }
    eventLDict.push(eventDict);
  }

  if (eventCliniVals.length !== 0) {
    for (let ekeycli of eventCliniVals) {
      for (const [key, value] of Object.entries(ekeycli)) {
        for (const [al, avalue] of Object.entries(allEvent)) {
          var label = avalue.replace(/['"]+/g, "").replace(/\s+$/, "");
          if (key == al) {
            if (value) {
              if (
                !label.includes("_DD") &&
                !label.includes("_MIC") &&
                !label.includes("Test")
              ) {
                eventCliDict = {
                  ...eventCliDict,
                  [label]: value,
                };
              }
            }
          }
        }
      }
      if (Object.keys(eventCliDict).length !== 0) {
        eventClinical.push(eventCliDict);
      }
    }
  }
  // completeEvent.forEach((event) => {
  //   if (event.status === "COMPLETED") {
  //     let obj = {
  //       "Hospital department": "",
  //       "Lab ID": "",
  //       Pathogen: "",
  //       "Patient Location": "",
  //       "Sample type": "",
  //       EventDate: "",
  //       "AMR ID": "",
  //       Organism: "",
  //       "Reason for Testing": "",
  //       "Purpose of sample": "",
  //       Syndrome: "",
  //       "Isolate / coloniser": "",
  //       dataValue: [],
  //     };
  //     let arr = [];
  //     // let program = programs.filter((p) => p.id == event.program);
  //     obj["EventDate"] = event.eventDate.split("T")[0];
  //     registrationDate["Reg Date"] = event.created.split("T")[0];
  //     // obj["program"] = program[0].name;
  //     event.dataValues.forEach((dv) => {
  //       let deObj = metaDataDataElement.filter((de) => {
  //         if (de.id === dv.dataElement) {
  //           de["value"] = dv.value;
  //           return de;
  //         }
  //       });
  //       if (
  //         deObj[0].id !== "B7XuDaXPv10" &&
  //         deObj[0].id !== "GpAu5HjWAEz" &&
  //         deObj[0].id !== "mp5MeJ2dFQz" &&
  //         deObj[0].id !== "dRKIjwIDab4" &&
  //         deObj[0].id !== "SaQe2REkGVw" &&
  //         deObj[0].id !== "dRKIjwIDab4" &&
  //         deObj[0].id !== "lIkk661BLpG" &&
  //         deObj[0].id !== "WxuMCW0sdbT" &&
  //         deObj[0].id !== "lJm7JZvPQxA" &&
  //         deObj[0].id !== "mOMWw59PvKU" &&
  //         deObj[0].id !== "MOsgkq0ptBm"
  //       ) {
  //         arr.push(deObj[0]);
  //       }
  //       if (dv.dataElement === "B7XuDaXPv10") {
  //         obj["Patient Location"] = dv.value;
  //       }
  //       if (dv.dataElement === "dRKIjwIDab4") {
  //         obj["Hospital department"] = dv.value;
  //       }
  //       if (dv.dataElement === "GpAu5HjWAEz") {
  //         obj["Lab ID"] = dv.value;
  //       }
  //       if (dv.dataElement === "mp5MeJ2dFQz") {
  //         obj["Sample type"] = dv.value;
  //       }
  //       if (dv.dataElement === "dRKIjwIDab4") {
  //         obj["Hospital department"] = dv.value;
  //       }
  //       if (dv.dataElement === "SaQe2REkGVw") {
  //         // let tempDeName= tempDataElements.filter(de=> de.code === dv.value)
  //         //   obj["Organism"] = tempDeName[0].name;
  //         obj["Organism"] = dv.value;
  //       }
  //       if (dv.dataElement === "lIkk661BLpG") {
  //         obj["AMR ID"] = dv.value;
  //       }
  //       if (dv.dataElement === "WxuMCW0sdbT") {
  //         obj["Reason for Testing"] = dv.value;
  //       }
  //       if (dv.dataElement === "lJm7JZvPQxA") {
  //         obj["Purpose of sample"] = dv.value;
  //       }
  //       if (dv.dataElement === "mOMWw59PvKU") {
  //         obj["Syndrome"] = dv.value;
  //       }
  //       if (dv.dataElement === "MOsgkq0ptBm") {
  //         obj["Isolate / coloniser"] = dv.value;
  //       }
  //     });
  //     let oarr = [];
  //     for (let ele of arr) {
  //       let val = parseInt(ele.value);
  //       let isNumber = Number.isInteger(val);
  //       if (!isNumber) {
  //         if (
  //           ele.id !== "DeFdBFxsFcj" &&
  //           ele.id !== "tQa6uU1t6s3" &&
  //           ele.id !== "YoCmEMUlZxb"
  //         ) {
  //           oarr.push(ele);
  //         }
  //       }
  //     }
  //     obj["dataValue"] = oarr;
  //     eventL.push(obj);
  //   }
  // });
  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => handleClose(),
  });

  const handleClose = () => {
    setOpen(false);
    props.onPrint(false);
  };

  var hospitaldep = eventDict["Hospital department"];
  var labId = eventDict["Lab ID"];
  var pathogen = eventDict["Pathogen"];
  var location = eventDict["Patient Location"];
  var sample = eventDict["Sample type"];
  var gramstain = eventDict["Gram stain"];

  optionSets[SAMPLE_TYPEID].forEach((o) => {
    if (o.value == sample) {
      sample = o.label;
    }
  });

  optionSets[PATHOGEN_POSITIVE].forEach((o) => {
    if (o.value == pathogen) {
      pathogen = o.label;
    }
  });

  optionSets[PATHOGEN_NEGATIVE].forEach((o) => {
    if (o.value == pathogen) {
      pathogen = o.label;
    }
  });

  function getPlayersByPosition(link, position) {
    return Object.keys(link).filter((key) => key.includes(position));
  }

  const dob = moment(entityDict["Age / DOB"]);
  const currentDate = moment();

  // Calculate the difference
  const yearsDiff = currentDate.diff(dob, "years");
  dob.add(yearsDiff, "years");
  const monthsDiff = currentDate.diff(dob, "months");
  dob.add(monthsDiff, "months");
  const daysDiff = currentDate.diff(dob, "days");
  let count = 0;
  const listItems = eventLDict.map((link) => {
    count = 0;
    return (
      <Box sx={{ border: 1, fontSize: 12, ml: 6, mr: 6, mt: 1, mb: 1 }}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "30%" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    <span>{DEPARTMENT}</span> :&nbsp;&nbsp;
                    <span>{link["Hospital department"]}</span>
                  </Box>
                </Typography>
              </TableCell>
              <TableCell style={{ width: "40%", textAlign: "center" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {/* {SAMPLE_TYPE} :&nbsp;&nbsp;{link["Sample type"]} */}
                    <span>{SAMPLE_TYPE}</span> :&nbsp;&nbsp;
                    <span>{link["Sample type"]}</span>
                  </Box>
                </Typography>
              </TableCell>
              {/* <TableCell style={{ width: "30%", textAlign: "right" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {PATHOGEN_G} :&nbsp;&nbsp;{link[PATHOGEN_G]}
                  </Box>
                </Typography>
              </TableCell> */}
              <TableCell style={{ width: "30%", textAlign: "right" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {/* {LAB_ID} :&nbsp;&nbsp;{link[LAB_ID]} */}
                    <span> {LAB_ID} </span> :&nbsp;&nbsp;
                    <span>{link[LAB_ID]}</span>
                  </Box>
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ width: "30%" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {/* {LOCATION} :&nbsp;&nbsp;{link[LOCATION]} */}
                    <span> {LOCATION} </span> :&nbsp;&nbsp;
                    <span>{link[LOCATION]}</span>
                  </Box>
                </Typography>
              </TableCell>
              <TableCell style={{ width: "40%", textAlign: "center" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {/* {SAMPLE_DATE} :&nbsp;&nbsp;
                    {moment(link[SAMPLE_DATE]).format("DD/MM/yyyy")} */}
                    <span> {SAMPLE_DATE} </span> :&nbsp;&nbsp;
                    <span>
                      {moment(link[SAMPLE_DATE]).format("DD/MM/yyyy")}
                    </span>
                  </Box>
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box
          sx={
            {
              // display: "flex",
              // justifyContent: "space-around",
            }
          }
        >
          <>
            {Object.values(link).includes("true") ||
            Object.keys(link).includes("Others") ||
            Object.keys(link).some((key) => key.includes("staining")) ? (
              <Table
              // sx={{
              //   width: "40%",
              //   minWidth: 150,
              //   // width: { xs: "100%", md: "40%" },
              //   "@media screen and (max-width: 600px)": {
              //     width: "100%",
              //   },
              // }}
              >
                <TableBody>
                  <Box
                    sx={{
                      border: 1,
                      fontSize: 10,
                      ml: 20,
                      mr: 20,
                      mt: 1,
                      mb: 1,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        className={classes.tableRightBorder + " " + "antibio"}
                        style={{
                          fontWeight: "bold",
                          borderBottom: "1px solid black ",
                          fontSize: "13px",
                          borderRight: "1px solid black",
                        }}
                      >
                        Preliminary tests
                      </TableCell>
                    </TableRow>

                    {[
                      ...getPlayersByPosition(link, "").filter(
                        (player) => link[player] == "true" || player == "Others"
                      ),
                      ...getPlayersByPosition(link, "").filter(
                        (player) =>
                          !(link[player] == "true" || player == "Others")
                      ),
                    ].map((player, index) => {
                      console.log(
                        "link[player] == ",
                        (link[player] == "true").length
                      );
                      return (
                        <>
                          {link[player] == "true" ||
                          player == "Others" ||
                          EXCEPTION_CONDITION.includes(player) ? (
                            <TableRow key={index}>
                              <TableCell
                                className={
                                  classes.tableRightBorder + " " + "antibio"
                                }
                                style={{
                                  borderBottom: "1px solid black",
                                  textAlign: "center",
                                }}
                                sx={{
                                  width: "300px",
                                }}
                              >
                                <Typography>
                                  <Box
                                    className="boxClass"
                                    sx={{ fontSize: 12, m: 1 }}
                                  >
                                    {player}
                                    {/* {player.split("_")[0]} */}
                                  </Box>
                                </Typography>
                              </TableCell>

                              <TableCell
                                className={
                                  classes.tableRightBorder + " " + "antibio"
                                }
                                style={{
                                  borderBottom: "1px solid black",
                                  textAlign: "center",
                                }}
                                sx={{
                                  width: "300px",
                                }}
                              >
                                <Typography>
                                  <Box
                                    className="boxClass"
                                    sx={{ fontSize: 12, m: 1 }}
                                  >
                                    {player == "Others"
                                      ? link[player]
                                      : link[player] == "true"
                                      ? "Yes"
                                      : link[player]}
                                  </Box>
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })}
                  </Box>
                </TableBody>
              </Table>
            ) : (
              ""
            )}
          </>
        </Box>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableBody>
            <TableRow>
              {(link["Sample Result"] !== "Rejected") && (link["Sample Result"] !== "No aerobic growth") && (link["Sample Result"] !== "Sterile") ? (
                 <TableCell style={{ width: "30%" }}>
                 <Typography>
                   <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                     {/* {PATHOGEN_G} :&nbsp;&nbsp;{link[PATHOGEN_G]} */}
                     <span>{PATHOGEN_G}</span> :&nbsp;&nbsp;
                     <span style={{ fontWeight: "bold" }}>
                       {link[PATHOGEN_G]}
                     </span>
                   </Box>
                 </Typography>
               </TableCell>
              ) : null}
             
              <TableCell style={{ width: "40%" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    {/* {PATHOGEN} :&nbsp;&nbsp;&nbsp;&nbsp;{link["Pathogen"]} */}
                    <span>{PATHOGEN}</span> :&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: "bold" }}>
                      {/* {link["Pathogen"]} */}
                      {link["Pathogen Group"] == "Sample testing" ? link["Sample Result"] : link["Pathogen"]}
                    </span>
                  </Box>
                </Typography>
              </TableCell>
              {(link["Sample Result"] == "Rejected")  ?(
                 <TableCell >
                 <Typography>
                   <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                     {/* {PATHOGEN_G} :&nbsp;&nbsp;{link[PATHOGEN_G]} */}
                     <span>{REASON_FOR_REJECTION}</span> :&nbsp;&nbsp;
                     <span style={{ fontWeight: "bold" }}>
                       {link['Reason for rejection']}
                     </span>
                   </Box>
                 </Typography>
               </TableCell>
              ):null}

            </TableRow>
          </TableBody>
        </Table>

        {Object.keys(link).some((key) => key.includes("_Result")) ? (
          <Table>
            <TableBody>
              <Box
                sx={{
                  border: 1,
                  fontSize: 10,
                  ml: 20,
                  mr: 20,
                  mt: 1,
                  mb: 1,
                  borderBottom: 0,
                  borderRight: 0,
                }}
              >
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    className={classes.tableRightBorder + " " + "antibio"}
                    style={{
                      fontWeight: "bold",
                      borderBottom: "1px solid black ",
                      fontSize: "13px",
                      borderRight: "1px solid black",
                    }}
                  >
                    Susceptibility tests
                  </TableCell>
                </TableRow>
                {getPlayersByPosition(link, "_Result").map((player, index) => (
                  <TableRow>
                    <TableCell
                      className={classes.tableRightBorder + " " + "antibio"}
                      style={{ width: "10%", borderBottom: "1px solid black" }}
                    >
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {index + 1}
                        </Box>
                      </Typography>
                    </TableCell>

                    <TableCell
                      className={classes.tableRightBorder + " " + "antibio"}
                      style={{
                        width: "60%",
                        textAlign: "center",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {player.split("_")[0]}
                        </Box>
                      </Typography>
                    </TableCell>

                    <TableCell
                      className={classes.tableRightBorder + " " + "antibio"}
                      style={{
                        width: "60%",
                        textAlign: "center",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {link[player]}
                        </Box>
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </Box>
            </TableBody>
          </Table>
        ) : (
          ""
        )}
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "40%" }}>
                <Typography>
                  <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                    Additional comments :&nbsp;&nbsp;
                    {link["Additional comments"]}
                  </Box>
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  });
  console.log("eventLDict", eventLDict);

  let contentDisplayed = false;

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
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        > */}
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <img style={{ width: "130px" }} src={EAS} alt="Left Logo" />
          <div style={{ marginRight: "50px", marginLeft: "50px" }}>
            <h2>JIMMA UNIVERSITY MEDICAL CENTER LABORATORY</h2>
            <h4>Document No: JUMCL/MIC/F7.4-004</h4>
            <h5>Version No: 5.0</h5>
          </div>
          <img style={{ height: "80px" }} src={JIMA} alt="Right Logo" />
        </div>
        {/* <h2>JIMMA UNIVERSITY MEDICAL CENTER LABORATORY</h2>
          <h4>Document Number: JUMCL-REC-F-103</h4>
          <h5>Version Number:5.0</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <img
              style={{ width: "130px", padding: "5px 0px 0px 16px" }}
              src={EAS}
              alt="Left Logo"
            />
            <span style={{ flex: "1" }}></span>{" "}
          
            <img style={{ height: "80px" }} src={JIMA} alt="Right Logo" />
          </div>
        </div> */}

        <Box sx={{ border: "1px solid black", fontSize: 12, m: 1 }}>
          <Box sx={{ border: 2, fontSize: 12, ml: 6, mr: 6, mt: 1, mb: 1 }}>
            <Table
              sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}
            >
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {CR_NUMBER} :&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        {entityDict["Registration number"]}
                      </Box>
                    </Typography>
                  </TableCell>

                  <TableCell style={{ width: "40%", textAlign: "center" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {NAME} :&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        {entityDict["First name"]} {entityDict["Middle name"]}{" "}
                        {entityDict["Last name"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "right" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {REGISTRATION_DATE} :&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        {moment(entityDict[REGISTRATION_DATE]).format(
                          "DD/MM/yyyy"
                        )}
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {GENDER} :&nbsp;&nbsp;&nbsp;&nbsp; {entityDict[GENDER]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "center" }}>
                    <Typography>
                      {/* <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {AGE} :&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        {moment().diff(entityDict["Age / DOB"], "years")} years{" "}
                        {moment().diff(entityDict["Age / DOB"], "months") % 12}{" "}
                        months {moment().diff(entityDict["Age / DOB"], "days")}{" "}
                        days
                      </Box> */}
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {AGE} :&nbsp;&nbsp;&nbsp;&nbsp; {yearsDiff} years{" "}
                        {monthsDiff} months {daysDiff} days
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          {/* {listItemTable} */}

          {listItems}
          {console.log("entityDict===================", entityDict)}

          {/* {eventClinical.length !== 0 ? (
            <Box sx={{ border: 2, fontSize: 12, ml: 6, mr: 6, mt: 1, mb: 1 }}>
              <Table
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                  },
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell style={{ width: "30%" }}>
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {AST}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {eventClinical[0][AST]}
                        </Box>
                      </Typography>
                    </TableCell>

                    <TableCell style={{ width: "50%" }}>
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {PATIENT_OUTCOME}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {eventClinical[0]["Patients outcome"]}
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {NOTES}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "50%" }}>
                      <Typography>
                        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                          {eventClinical[0][NOTES]}
                        </Box>
                      </Typography>
                    </TableCell>
                    &emsp;&emsp;
                    <TableCell>
                      <Typography>
                        <Box
                          className="boxClass"
                          sx={{ fontSize: 12, m: 1 }}
                        ></Box>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        <Box
                          className="boxClass"
                          sx={{ fontSize: 12, m: 1 }}
                        ></Box>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          ) : (
            ""
          )} */}
        </Box>

        {eventLDict.map((link, index) => (
          <React.Fragment key={index}>
            {!contentDisplayed && (
              // <Box sx={{ fontSize: 12, p: 1 }}>
              //   <Table
              //     sx={{
              //       [`& .${tableCellClasses.root}`]: {
              //         borderBottom: "none",
              //       },
              //     }}
              //     style={{ marginTop: "5px" }}
              //   >
              //     <TableBody>
              //       <TableRow
              //         style={{
              //           fontWeight: "bold",
              //           borderBottom: "1px solid black ",
              //           fontSize: "13px",
              //           borderTop: "1px solid black",
              //         }}
              //       >
              //         <TableCell
              //           style={{
              //             borderLeft: "1px solid black",
              //             borderRight: "1px solid black",
              //           }}
              //         >
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Reported By:{link["Final report released by"]}
              //             </Box>
              //           </Typography>
              //         </TableCell>

              //         <TableCell style={{ borderRight: "1px solid black" }}>
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Reported Date:{link["Report release date"]}
              //             </Box>
              //           </Typography>
              //         </TableCell>
              //         <TableCell style={{ borderRight: "1px solid black" }}>
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Signature:
              //             </Box>
              //           </Typography>
              //         </TableCell>
              //       </TableRow>
              //     </TableBody>
              //   </Table>

              //   <Table
              //     sx={{
              //       [`& .${tableCellClasses.root}`]: {
              //         borderBottom: "none",
              //       },
              //     }}
              //     style={{ marginTop: "5px" }}
              //   >
              //     <TableBody>
              //       <TableRow
              //         style={{
              //           fontWeight: "bold",
              //           borderBottom: "1px solid black ",
              //           fontSize: "13px",
              //           borderTop: "1px solid black",
              //         }}
              //       >
              //         <TableCell
              //           style={{
              //             borderLeft: "1px solid black",
              //             borderRight: "1px solid black",
              //           }}
              //         >
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Reviewed By:{link["Report reviewed by"]}
              //             </Box>
              //           </Typography>
              //         </TableCell>

              //         <TableCell style={{ borderRight: "1px solid black" }}>
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Reviewed Date:{link["Report review date"]}
              //             </Box>
              //           </Typography>
              //         </TableCell>
              //         <TableCell style={{ borderRight: "1px solid black" }}>
              //           <Typography>
              //             <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //               Signature:
              //             </Box>
              //           </Typography>
              //         </TableCell>
              //       </TableRow>
              //     </TableBody>
              //   </Table>

              //   <div
              //     style={{
              //       display: "flex",
              //       alignItems: "center",
              //       justifyContent: "center",
              //       flexDirection: "column",
              //     }}
              //   >
              //     {/* <span style={{ fontWeight: "bold" }}> INTERNAL USE ONLY</span> */}
              //     <span style={{ fontWeight: "bold" }}>
              //       This is Controlled Document For Internal Use Only
              //     </span>
              //   </div>
              // </Box>

              // <Table
              //   sx={{
              //     [`& .${tableCellClasses.root}`]: {
              //       borderBottom: "none",
              //     },
              //   }}
              // >
              //   <TableBody>
              //     <TableRow>
              //       <TableCell style={{ width: "30%" }}>
              //         {/* <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Reported By:&nbsp;&nbsp;
              //             {link["Final report released by"]}
              //           </Box>
              //         </Typography> */}
              //        <Typography>Reported By:</Typography>
              //        <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>

              //             {link["Final report released by"]}
              //           </Box>
              //       </TableCell>
              //       <TableCell style={{ width: "30%", textAlign: "center" }}>
              //         <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Reported Date:&nbsp;&nbsp;
              //             {link["Report release date"]}
              //           </Box>
              //         </Typography>
              //       </TableCell>

              //       <TableCell style={{ width: "40%", textAlign: "center" }}>
              //         <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Signature:
              //           </Box>
              //         </Typography>
              //       </TableCell>
              //     </TableRow>

              //     <TableRow>
              //       <TableCell style={{ width: "30%" }}>
              //         <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Reviewed By:&nbsp;&nbsp;{link["Report reviewed by"]}
              //           </Box>
              //         </Typography>
              //       </TableCell>
              //       <TableCell style={{ width: "30%", textAlign: "center" }}>
              //         <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Reviewed Date::&nbsp;&nbsp;
              //             {link["Report review date"]}
              //           </Box>
              //         </Typography>
              //       </TableCell>

              //       <TableCell style={{ width: "40%", textAlign: "center" }}>
              //         <Typography>
              //           <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
              //             Signature:
              //           </Box>
              //         </Typography>
              //       </TableCell>
              //     </TableRow>
              //   </TableBody>
              // </Table>
              <div
                class="container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  margin: "0px",
                  marginLeft: "70px",
                }}
              >
                <div
                  class="row"
                  style={{
                    display: "flex",
                    width: "100%",
                    borderBottom: "none",
                  }}
                >
                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Reported By:&nbsp;&nbsp;
                      {link["Final report released by"]}
                    </div>
                  </div>

                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Reported Date:&nbsp;&nbsp;
                      {link["Report release date"]}
                    </div>
                  </div>
                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Signature:
                    </div>
                  </div>
                </div>
                <div
                  class="row"
                  style={{
                    display: "flex",
                    width: "100%",
                    borderBottom: "none",
                  }}
                >
                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Reviewed By:&nbsp;&nbsp;
                      {link["Report reviewed by"]}
                    </div>
                  </div>
                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Reviewed Date:&nbsp;&nbsp;
                      {link["Report review date"]}
                    </div>
                  </div>
                  <div class="cell" style={{ flex: "1" }}>
                    <div class="boxClass" style={{ fontSize: "12px" }}>
                      Signature:
                    </div>
                  </div>
                </div>
              </div>
            )}
           
            {(contentDisplayed = true)}
          </React.Fragment>
        ))}
         <div style={{fontWeight:'bold',textAlign:'center',padding:'20px'}}>JUMC Laboratory is accredited in Microbiology Test by Ethiopian Accreditation Service Since 2023</div>
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
