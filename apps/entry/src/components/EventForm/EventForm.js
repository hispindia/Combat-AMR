import React, { useEffect, useState } from "react";

import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MainSection,
  TitleRow,
  Event,
  Panel,
  addExistingEvent,
  getExistingEvent,
  initNewEvent,
  createNewEvent,
  resetData,
  ERROR,
  addEntity,
  resetPreviousEntity,
  setEventValue,
  setAggregationProgress,
} from "@hisp-amr/app";
import { Button } from "@dhis2/ui-core";
import { Entity } from "./Entity";
import { EventButtons } from "./EventButtons";
import Events from "./Entity/EventList";
import $ from "jquery";
import { Aggregate } from "../../api/helpers/aggregate";
import { deleteEvent } from "@hisp-amr/api";
import SweetAlert from "react-bootstrap-sweetalert";
import EventPrint from "./EventPrint";
import {
  PATHOGEN_DETECTED,
  SAMPLE_RESULT_ID,
  PATHOGEN_ID,
} from "./Entity/constants";

export const EventForm = ({ history, match }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  var [dialog, setDialog] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.data.status) === ERROR;
  const panelValid = useSelector((state) => state.data.panel.valid);
  const pageFirst = useSelector((state) => state.data.pageFirst);
  var eventEditable = useSelector((state) => state.data.eventEditable);
  var editable = useSelector((state) => state.data.editable);
  const event = useSelector((state) => state.data.event);
  const dataElementObjects = useSelector(
    (state) => state.metadata.dataElementObjects
  );
  const programs = useSelector((state) => state.metadata.programs);
  const categoryCombos = useSelector((state) => state.metadata.categoryCombos);
  const dataSets = useSelector((state) => state.metadata.dataSets);
  const eventIDs = useSelector((state) => state.data.event.id);
  const previousValues = useSelector((state) => state.data.previousValues);
  const prevValues = Object.keys(previousValues).length ? true : false;
  var aggregationOnProgress = useSelector(
    (state) => state.data.aggregationOnProgress
  );
  var printValues = useSelector((state) => state.data.printValues);
  const isCompleteClicked = useSelector((state) => state.data.completeClicked);
  const status = useSelector((state) => state.data.event.status);
  var { sampleDate } = useSelector((state) => state.data.panel);
  var [eventCliShow, setEventCliShow] = useState([]);
  var clinicianPsList = useSelector((state) => state.metadata.clinicianPsList);
  var events = useSelector((state) => state.data.eventList);
  const { programOrganisms, optionSets } = useSelector(
    (state) => state.metadata
  );

  const onPrint = (check) => {
    if (!check) {
      setDialog(check);
    } else {
      setDialog(true);
    }
  };

  var orgUnit = match.params.orgUnit;
  const teiId = match.params.teiId;

  var userAccess = false;
  programs.forEach((p) => {
    p.programStages.forEach((ps) => {
      userAccess = ps.access.data.write;
    });
  });
  useEffect(() => {
    if (pageFirst) {
      $("#a").hide();
    } else {
      $("#a").show();
      $("#panel").hide();
    }
    $("#btn").hide();
    if (eventEditable === true) {
      $("#btn").show();
      $("#popup").show();
    }
    $("#msg").hide();
    $("#success").hide();
  });
  useEffect(() => {
    const eveCliValue = () => {
      var eventClini = [];
      if (events != undefined) {
        const v = events.map((ele, index) => {
          if (clinicianPsList.includes(ele.programStage)) {
            var proId = ele.program;
            var name = [],
              dataValue = [],
              data = [],
              date = [];
            var listorganisms = [];
            var orgValue = [];
            var orgn = "";
            date["value"] = ele.eventDate.substring(0, 10);
            for (let program of programs) {
              if (program.id == proId) {
                name["value"] = program.name;
                optionSets[programOrganisms[program.id]].forEach((o) => {
                  if (!listorganisms.find((org) => org.value === o.value))
                    listorganisms.push(o);
                });
              }
            }
            for (let value of ele.dataValues) {
              if (
                value.dataElement == PATHOGEN_ID ||
                value.dataElement == SAMPLE_RESULT_ID
              ) {
                // id of organism detected data element in sample testing
                if (listorganisms.length > 0) {
                  orgn = listorganisms.find((element) => {
                    return element.value == value.value;
                  });
                  if (orgn) {
                    value.value = orgn.label;
                  }
                }
                orgValue["value"] = value.value;
                dataValue["4"] = orgValue;
              }
              dataValue["5"] = date;
            }
            if (dataValue["4"]) {
              if (dataValue["4"].value !== PATHOGEN_DETECTED) {
                data = dataValue;
                eventClini.push(ele.event);
              }
            }
          }
        });

        if (eventClini.length != 0) {
          setEventCliShow([...eventCliShow, eventClini]);
        }
        return v;
      }
    };
    eveCliValue();
  }, [events]);
  useEffect(() => {
    // let previousEvent = ""
    // if(!pageFirst) {
    //     previousEvent = "";
    // }

    dispatch(resetData());
    if (teiId) {
      dispatch(getExistingEvent(orgUnit, teiId));
    } else {
      dispatch(initNewEvent(orgUnit));
    }
    setIsFirstRender(false);
  }, []);

  //for Previous event value
  useEffect(() => {
    // dispatch(PreValue(previousValues))
    if (eventIDs && editable) {
      var isPrev = true;
      for (let eventValues in previousValues) {
        if (eventValues != SAMPLE_RESULT_ID) {
          if (event["values"][eventValues] == "") {
            dispatch(
              setEventValue(eventValues, previousValues[eventValues], isPrev)
            );
            // event["values"][eventValues] = previousValues[eventValues]
          }
        }
      }
      // dispatch(addExistingEvent(event))
      // dispatch(resetPreviousEntity())
    }
  }, [eventIDs]);

  // for previous entity values

  useEffect(() => {
    if (previousValues.id) {
      dispatch(addEntity());
      dispatch(resetPreviousEntity());
    }
  }, [previousValues]);
  useEffect(() => {
    if (error) history.goBack();
  }, [error]);

  useEffect(() => {
    if (!isFirstRender && panelValid && pageFirst) {
      dispatch(createNewEvent());
    }
  }, [panelValid, pageFirst]);

  const onDelete = (e) => {
    e.preventDefault();
    $("#msg").show();
  };

  const onCancel = (e) => {
    e.preventDefault();
    if (pageFirst) {
      history.goBack();
    }
    $("#panel").hide();
    $("#popup").hide();
  };

  const changeAggregationStatus = (status) => {
    dispatch(setAggregationProgress(status));
    aggregationOnProgress = status;
  };
  const onConfirm = async (e) => {
    e.preventDefault();
    let eventID = localStorage.getItem("eventId");
    let res = await Aggregate({
      event: event,
      operation: "INCOMPLETE",
      dataElements: dataElementObjects,
      categoryCombos: categoryCombos,
      dataSets: dataSets,
      orgUnit: orgUnit,
      programs: programs,
      sampleDate: sampleDate,
      changeStatus: changeAggregationStatus,
    });
    changeAggregationStatus(false);
    if (res.response) {
      await deleteEvent(eventID).then((res) => {
        if (res.httpStatus == "OK") {
          $("#success").show();
        }
      });
      $("#popup").hide();
      $("#panel").hide();
      $("#msg").hide();
    }
  };
  const onNo = (e) => {
    e.preventDefault();
    $("#popup").hide();
    $("#panel").hide();
    $("#msg").hide();
  };
  const onYes = (e) => {
    window.location.reload(false);
    $("#popup").hide();
    $("#panel").hide();
  };
  if (isFirstRender) return <TitleRow title="Record" history={history} />;
  return (
    <MainSection padded>
      <TitleRow title="Record" history={history} />
      <form autoComplete="off">
        <Entity showEdit={true} />
        <div id="a">
          <Events />
        </div>
        {eventEditable || editable ? (
          <div id="popup">
            <SweetAlert
              style={{
                width: "90%",
              }}
              openAnim={{ name: "showSweetAlert", duration: 2000 }}
              closeAnim={{ name: "hideSweetAlert", duration: 2000 }}
              customButtons={
                <React.Fragment>
                  <EventButtons history={history} existingEvent={teiId} />
                  &emsp;&emsp;
                  <Button
                    primary={true}
                    onClick={onPrint}
                    disabled={!status.completed}
                  >
                    Report
                  </Button>
                  &emsp;&emsp;
                  <div id="btn">
                    {userAccess && (
                      <Button destructive={true} onClick={(e) => onDelete(e)}>
                        Delete
                      </Button>
                    )}
                    &emsp;&emsp;&emsp;&emsp;&emsp;
                  </div>
                  {/* {!prevValues &&
                            <Button onClick={(e) => onCancel(e)}>Cancel</Button>
                        } */}
                </React.Fragment>
              }
            >
              <Panel />
              <Event />
            </SweetAlert>
          </div>
        ) : (
          <div id="panel">
            <Panel showEdit={panelValid} />
            <Event />
            <EventButtons history={history} existingEvent={teiId} />
          </div>
        )}
        {dialog && (
          <div id="btn">
            <EventPrint onPrint={onPrint} cliEve={eventCliShow} />
          </div>
        )}
      </form>
      <div id="msg">
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          customButtons={
            <React.Fragment>
              <Button
                disabled={aggregationOnProgress}
                primary={true}
                onClick={(e) => onConfirm(e)}
              >
                Yes
              </Button>
              &emsp;&emsp;&emsp;
              <Button disabled={aggregationOnProgress} onClick={(e) => onNo(e)}>
                No
              </Button>
            </React.Fragment>
          }
        >
          You will not able to recover this event Detail!
        </SweetAlert>
      </div>
      <div id="success">
        <SweetAlert
          success
          title="Event Delete Success"
          customButtons={
            <React.Fragment>
              <Button primary={true} onClick={(e) => onYes(e)}>
                Ok
              </Button>
              &emsp;&emsp;&emsp;
            </React.Fragment>
          }
        ></SweetAlert>
      </div>
    </MainSection>
  );
};
export default withRouter(EventForm);
