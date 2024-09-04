import axios from "axios";

export const getAntibioticFollowTEI = async (
  orgUnit,
  sampleTestingProgram,
  eventStatus,
  isFollowUp
) => {
  var teiRows = [];
  var api_GP1 = ``;
  var api_GP2 = ``;
  var requestOne = "";
  var requestTwo = "";
  var requestTwoFollow = "";
  var requestThree = "";
  var requestThreeFollow = "";

  var requestFour = "";
  var requestFourFollow = "";
  var requestFive = "";
  var requestFiveFollow = "";
  var SampleDict = {};

  //var api_GP1_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  //var api_GP2_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`

  //var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  //var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`

  var api_GP1_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&skipPaging=true`;
  var api_GP2_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&skipPaging=true`;

  var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&skipPaging=true`;
  var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&skipPaging=true`;

  var eventApi_GP1_follow = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[0]}&followUp=true&programStatus=ACTIVE&programStage=LEaC0JtgaRF&paging=false`;
  var eventApi_GP2_follow = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[1]}&followUp=true&programStatus=ACTIVE&programStage=ZH528YQyn18&paging=false`;
  var eventApi_GP1 = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[0]}&followUp=false&programStatus=ACTIVE&programStage=LEaC0JtgaRF&paging=false`;
  var eventApi_GP2 = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[1]}&followUp=false&programStatus=ACTIVE&programStage=ZH528YQyn18&paging=false`;

  requestTwoFollow = axios.get(api_GP1_follow);
  requestThreeFollow = axios.get(api_GP2_follow);
  requestTwo = axios.get(api_GP1);
  requestThree = axios.get(api_GP2);

  requestFourFollow = axios.get(eventApi_GP1_follow);
  requestFiveFollow = axios.get(eventApi_GP2_follow);
  requestFour = axios.get(eventApi_GP1);
  requestFive = axios.get(eventApi_GP2);

  return axios
    .all([
      requestTwoFollow,
      requestThreeFollow,
      requestTwo,
      requestThree,
      requestFourFollow,
      requestFiveFollow,
      requestFour,
      requestFive,
    ])
    .then(
      axios.spread((...responses) => {
        var rowList = [];
        const responseTwoFollow = responses[0];
        const responseThreeFollow = responses[1];
        const responseTwo = responses[2];
        const responseThree = responses[3];

        const responseFourFollow = responses[4];
        const responseFiveFollow = responses[5];
        const responseFour = responses[6];
        const responseFive = responses[7];
        var trackedEntityInstanceEvent = [];

        if (
          responseFourFollow.data ||
          responseFiveFollow.data ||
          responseFour.data ||
          responseFive.data
        ) {
          responseFourFollow.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                console.log("labevent date=============", labEvent);
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
              });

              SampleDict[trackerid] = [
                labSampleID,
                locationValue,
                LastUpdatedDate,
              ]; // Assign updated values after the loop
            }
          });
          responseFiveFollow.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
              });

              SampleDict[trackerid] = [
                labSampleID,
                locationValue,
                LastUpdatedDate,
              ]; // Assign updated values after the loop
            }
          });
          responseFour.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
              });

              SampleDict[trackerid] = [
                labSampleID,
                locationValue,
                LastUpdatedDate,
              ]; // Assign updated values after the loop
            }
          });
          responseFive.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
                SampleDict[trackerid] = [
                  labSampleID,
                  locationValue,
                  LastUpdatedDate,
                ]; // Assign updated values after the loop
              });
            }
          });
        }

        if (
          responseTwo.data ||
          responseThree.data ||
          responseTwoFollow.data ||
          responseThreeFollow.data
        ) {
          responseTwoFollow.data.rows.forEach((responseTwoFollowteis) => {
            const trackedEntityInstanceTwoFollow = responseTwoFollowteis[0];

            if (
              trackedEntityInstanceEvent.includes(
                trackedEntityInstanceTwoFollow
              )
            ) {
              responseTwoFollowteis.push(sampleTestingProgram[0]);
              responseTwoFollowteis.push(true);
              rowList.push(responseTwoFollowteis);
            }
          });
          responseThreeFollow.data.rows.forEach((responseThreeFollowteis) => {
            const trackedEntityInstanceThreeFollow = responseThreeFollowteis[0];
            if (
              trackedEntityInstanceEvent.includes(
                trackedEntityInstanceThreeFollow
              )
            ) {
              responseThreeFollowteis.push(sampleTestingProgram[1]);
              responseThreeFollowteis.push(true);
              rowList.push(responseThreeFollowteis);
            }
          });
          responseTwo.data.rows.forEach((responseTwoteis) => {
            const trackedEntityInstanceTwo = responseTwoteis[0];
            if (trackedEntityInstanceEvent.includes(trackedEntityInstanceTwo)) {
              responseTwoteis.push(sampleTestingProgram[0]);
              responseTwoteis.push(false);
              rowList.push(responseTwoteis);
            }
          });

          responseThree.data.rows.forEach((responseThreeteis) => {
            const trackedEntityInstanceThree = responseThreeteis[0];
            if (
              trackedEntityInstanceEvent.includes(trackedEntityInstanceThree)
            ) {
              responseThreeteis.push(sampleTestingProgram[1]);
              responseThreeteis.push(false);
              rowList.push(responseThreeteis);
            }
          });

          rowList.forEach((teis, index) => {
            let trackedEntityInstance = teis[0];

            let orgUnit = teis[3];
            teiRows[index] = ["", "", "", "", "", "", "", "", "", "", ""];
            teiRows[index]["0"] = teis[8]; //CR Number
            teiRows[index]["1"] = teis[9]; //Name
            teiRows[index]["3"] = teis[12]; //Age
            teiRows[index]["4"] = teis[13]; //Sex
            // teiRows[index]['5'] = teis[15]; //Address
            teiRows[index]["9"] = orgUnit;
            teiRows[index]["7"] = trackedEntityInstance;
            // teiRows[index]["8"] = teis[5];
            // teiRows[index]['9'] = teis[17];
            // isFollowUp[teis[7].toString()] = teis[18];
            if (trackedEntityInstance in SampleDict) {
              teiRows[index]["6"] = SampleDict[trackedEntityInstance][0];
              teiRows[index]["5"] = SampleDict[trackedEntityInstance][1];
              teiRows[index]["8"] = SampleDict[trackedEntityInstance][2];
            }
          });
        }
        // return { teiRows, isFollowUp };
        teiRows.sort(function(a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b[8]) - new Date(a[8]);
        });

        // Returning the sorted teiRows and the isFollowUp value as an object
        return { teiRows, isFollowUp };
      })
    )
    .then(({ teiRows, isFollowUp }) => {
      return { teiRows, isFollowUp };
    })
    .catch((errors) => {
      console.error(errors);
    });
};

export const getPendingAntiResult = async (
  orgUnit,
  sampleTestingProgram,
  eventStatus
) => {
  var teiRows = [];
  var api_GP1 = ``;
  var api_GP2 = ``;
  var requestTwo = "";
  var requestThree = "";
  var requestFour = ``;
  var requestFive = ``;
  var SampleDict = {};

  var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&skipPaging=true`;
  var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&skipPaging=true`;

  //var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  //var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`

  var eventApi_GP1 = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&program=${sampleTestingProgram[0]}&programStage=LEaC0JtgaRF&status=ACTIVE&programStatus=ACTIVE&paging=false`;
  var eventApi_GP2 = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&program=${sampleTestingProgram[1]}&programStage=ZH528YQyn18&status=ACTIVE&programStatus=ACTIVE&paging=false`;

  requestTwo = axios.get(api_GP1);
  requestThree = axios.get(api_GP2);

  requestFour = axios.get(eventApi_GP1);
  requestFive = axios.get(eventApi_GP2);

  return axios
    .all([requestTwo, requestThree, requestFour, requestFive])
    .then(
      axios.spread((...responses) => {
        var rowList = [];
        var trackedEntityInstanceEvent = [];
        const responseTwo = responses[0];
        const responseThree = responses[1];
        const responseFour = responses[2];
        const responseFive = responses[3];

        if (responseFour.data || responseFive.data) {
          responseFour.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
                SampleDict[trackerid] = [
                  labSampleID,
                  locationValue,
                  LastUpdatedDate,
                ]; // Assign updated values after the loop
              });
            }
          });
          responseFive.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";

            if (!SampleDict.hasOwnProperty(trackerid)) {
              console.log("event+++++++++++++", event);
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
                SampleDict[trackerid] = [
                  labSampleID,
                  locationValue,
                  LastUpdatedDate,
                ]; // Assign updated values after the loop
              });
            }
          });
        }

        if (responseTwo.data || responseThree.data) {
          responseTwo.data.rows.forEach((responseTwoteis, index) => {
            const trackedEntityInstance = responseTwoteis[0];
            if (trackedEntityInstanceEvent.includes(trackedEntityInstance)) {
              rowList.push(responseTwoteis);
            }
          });
          responseThree.data.rows.forEach((responseThreeteis, index) => {
            const trackedEntityInstanceId = responseThreeteis[0];
            if (trackedEntityInstanceEvent.includes(trackedEntityInstanceId)) {
              rowList.push(responseThreeteis);
            }
          });

          rowList.forEach((teis, index) => {
            let trackedEntityInstance = teis[0];
            let orgUnit = teis[3];
            teiRows[index] = ["", "", "", "", "", "", "", "", "", "", ""];
            teiRows[index]["0"] = teis[8]; //CR Number
            teiRows[index]["1"] = teis[9]; //Name
            teiRows[index]["3"] = teis[12]; //Age
            teiRows[index]["4"] = teis[13]; //Sex
            // teiRows[index]['5'] = teis[15]; //Address
            teiRows[index]["9"] = orgUnit;
            teiRows[index]["7"] = trackedEntityInstance;
            // teiRows[index]["8"] = teis[5];
            if (trackedEntityInstance in SampleDict) {
              teiRows[index]["6"] = SampleDict[trackedEntityInstance][0]; //Sample ID
              teiRows[index]["5"] = SampleDict[trackedEntityInstance][1]; // Location
              teiRows[index]["8"] = SampleDict[trackedEntityInstance][2]; // Location
            }
          });
        }
        return teiRows.sort(function(a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b[8]) - new Date(a[8]);
        });
      })
    )
    .then((teiRows) => {
      return teiRows;
    })
    .catch((errors) => {
      console.error(errors);
    });
};

export const getSterileTEI = async (
  orgUnit,
  sampleTestingProgram,
  eventStatus
) => {
  var teiSterileRows = [];
  var api_sample = ``;
  var requestOne = "";
  var requestThree = "";
  var requestFour = "";
  var requestTwo = "";
  var events = [];
  var eventsOther = []
  var SampleDict = {};
  console.log(
    "sampleTestingProgram=======================SSSSSSSSSSSSSSSSSSS",
    sampleTestingProgram[0]
  );

  //var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&skipPaging=true`;
  var api_other = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=bwJT1BnH3qE&skipPaging=true`;

  requestOne = axios.get(api_sample);
  requestThree = axios.get(api_other);
  var sterileUrl = `../../../api/events.json?skipPaging=true&fields=event,trackedEntityInstance,dataValues[dataElement,value]&order=created:asc&program=WhYipXYg2Nh&orgUnit=${orgUnit}&status=COMPLETED`;
  var sterileUrlother = `../../../api/events.json?skipPaging=true&fields=event,trackedEntityInstance,dataValues[dataElement,value]&order=created:asc&program=NmpjHa3bXmX&orgUnit=${orgUnit}&status=COMPLETED`;
  requestTwo = axios.get(sterileUrl);
  requestFour = axios.get(sterileUrlother);

  return axios
    .all([requestOne, requestTwo, requestThree, requestFour])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        const responseThree = responses[2];
        const responseFour = responses[3];

        responseTwo.data.events.forEach((event) => {
          var eventData = {};
          var dataElement = {};
          var dataValue = {};
          // var LastUpdatedDate = "";
          // console.log("event+++++++++++++",event)
          // if(event.lastUpdated){
          //   LastUpdatedDate= event.lastUpdated;
          // }

          eventData.tei = event["trackedEntityInstance"];
          event.dataValues.forEach(
            (dataValue) =>
              (dataElement[dataValue.dataElement] = dataValue.value)
          );

          if (
            dataElement["VbUbBX7G6Jf"] == "Sterile" ||
            dataElement["VbUbBX7G6Jf"] == "Not available" ||
            dataElement["VbUbBX7G6Jf"] == "Rejected" ||
            dataElement["VbUbBX7G6Jf"] == "No aerobic growth"
          )
            dataValue["deCode"] = dataElement["VbUbBX7G6Jf"];
          eventData.dataValues = dataValue;
          events.push(eventData);
          var trackerid = event?.trackedEntityInstance;
          var labSampleID = "";
          var locationValue = "";

          if (!SampleDict.hasOwnProperty(trackerid)) {
            event.dataValues.forEach((labEvent, index) => {
              if (labEvent.dataElement == "si9RY754UNU") {
                labSampleID = labEvent.value; // Update the outer variable
              }

              if (labEvent.dataElement == "q7U3sRRnFg5") {
                locationValue = labEvent.value; // Update the outer variable
              }
              SampleDict[trackerid] = [labSampleID, locationValue]; // Assign updated values after the loop
            });
          }
        });
        responseFour.data.events.forEach((event) => {
          var eventData = {};
          var dataElement = {};
          var dataValue = {};
          // var LastUpdatedDate = "";
          // console.log("event+++++++++++++",event)
          // if(event.lastUpdated){
          //   LastUpdatedDate= event.lastUpdated;
          // }
          console.log("data", dataElement);
          eventData.tei = event["trackedEntityInstance"];
          event.dataValues.forEach(
            (dataValue) =>
              (dataElement[dataValue.dataElement] = dataValue.value)
          );

          // dataValue["deCode"] = dataElement["VbUbBX7G6Jf"];
          eventData.dataValues = dataValue;
          eventsOther.push(eventData);
          console.log("EVENTDATA===========", eventsOther);
          var trackerid = event?.trackedEntityInstance;
          var labSampleID = "";
          var locationValue = "";

          if (!SampleDict.hasOwnProperty(trackerid)) {
            event.dataValues.forEach((labEvent, index) => {
              if (labEvent.dataElement == "si9RY754UNU") {
                labSampleID = labEvent.value; // Update the outer variable
              }

              if (labEvent.dataElement == "q7U3sRRnFg5") {
                locationValue = labEvent.value; // Update the outer variable
              }
              SampleDict[trackerid] = [labSampleID, locationValue]; // Assign updated values after the loop
            });
          }
        });
        if (responseThree.data || responseOne.data) {
          var index = 0;
          eventsOther.forEach((event) => {
            let eventTei = event.tei;
            let eventDeCode = event.dataValues.deCode;
            console.log("eventDeCode+++++++++++++++", eventDeCode);

            responseOne.data.rows.forEach((teis) => {
              let trackedEntityInstance = teis[0];
              console.log(
                "trackedEntityInstance=============",
                trackedEntityInstance
              );
              if (
                eventTei == trackedEntityInstance &&
                trackedEntityInstance in SampleDict
              ) {
                let orgUnit = teis[3];
                teiSterileRows[index] = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ];
                teiSterileRows[index]["0"] = teis[8]; //CR Number
                teiSterileRows[index]["1"] = teis[9]; //Name
                teiSterileRows[index]["8"] = teis[2];
                teiSterileRows[index]["3"] = teis[12]; //Age
                teiSterileRows[index]["4"] = teis[13]; //Sex
                // teiSterileRows[index]['5'] = teis[15]; //Address
                teiSterileRows[index]["9"] = orgUnit;
                teiSterileRows[index]["7"] = trackedEntityInstance;
                teiSterileRows[index]["6"] =
                  SampleDict[trackedEntityInstance][0];
                teiSterileRows[index]["5"] =
                  SampleDict[trackedEntityInstance][1]; //Location
                // teiSterileRows[index]["8"] =
                // SampleDict[trackedEntityInstance][2]; //Location
                index = index + 1;
              } else {
                return;
              }
            });
          });
          events.forEach((event) => {
            let eventTei = event.tei;
            let eventDeCode = event.dataValues.deCode;

            if (
              eventDeCode == "Sterile" ||
              eventDeCode == "Not available" ||
              eventDeCode == "Rejected" ||
              eventDeCode == "No aerobic growth"
            ) {
              responseOne.data.rows.forEach((teis) => {
                let trackedEntityInstance = teis[0];

                if (
                  eventTei == trackedEntityInstance &&
                  trackedEntityInstance in SampleDict
                ) {
                  let orgUnit = teis[3];
                  teiSterileRows[index] = [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                  ];
                  teiSterileRows[index]["0"] = teis[8]; //CR Number
                  teiSterileRows[index]["1"] = teis[9]; //Name
                  teiSterileRows[index]["8"] = teis[2];
                  teiSterileRows[index]["3"] = teis[12]; //Age
                  teiSterileRows[index]["4"] = teis[13]; //Sex
                  // teiSterileRows[index]['5'] = teis[15]; //Address
                  teiSterileRows[index]["9"] = orgUnit;
                  teiSterileRows[index]["7"] = trackedEntityInstance;
                  teiSterileRows[index]["6"] =
                    SampleDict[trackedEntityInstance][0];
                  teiSterileRows[index]["5"] =
                    SampleDict[trackedEntityInstance][1]; //Location
                  // teiSterileRows[index]["8"] =
                  // SampleDict[trackedEntityInstance][2]; //Location
                  index = index + 1;
                } else {
                  return;
                }
              });
            } else {
              return;
            }
          });
          // return teiSterileRows;
          // return teiSterileRows.reverse();

          return teiSterileRows.sort(function(a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
          });
        }

        // if (responseOne.data) {
        //   var index = 0;
        //   events.forEach((event) => {
        //     let eventTei = event.tei;
        //     let eventDeCode = event.dataValues.deCode;

        //     if (
        //       eventDeCode == "Sterile" ||
        //       eventDeCode == "Not available" ||
        //       eventDeCode == "Rejected" ||
        //       eventDeCode == "No aerobic growth"
        //     ) {
        //       responseOne.data.rows.forEach((teis) => {
        //         let trackedEntityInstance = teis[0];

        //         if (
        //           eventTei == trackedEntityInstance &&
        //           trackedEntityInstance in SampleDict
        //         ) {
        //           let orgUnit = teis[3];
        //           teiSterileRows[index] = [
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //             "",
        //           ];
        //           teiSterileRows[index]["0"] = teis[8]; //CR Number
        //           teiSterileRows[index]["1"] = teis[9]; //Name
        //           teiSterileRows[index]["8"] = teis[2];
        //           teiSterileRows[index]["3"] = teis[12]; //Age
        //           teiSterileRows[index]["4"] = teis[13]; //Sex
        //           // teiSterileRows[index]['5'] = teis[15]; //Address
        //           teiSterileRows[index]["9"] = orgUnit;
        //           teiSterileRows[index]["7"] = trackedEntityInstance;
        //           teiSterileRows[index]["6"] =
        //             SampleDict[trackedEntityInstance][0];
        //           teiSterileRows[index]["5"] =
        //             SampleDict[trackedEntityInstance][1]; //Location
        //           // teiSterileRows[index]["8"] =
        //           // SampleDict[trackedEntityInstance][2]; //Location
        //           index = index + 1;
        //         } else {
        //           return;
        //         }
        //       });
        //     } else {
        //       return;
        //     }
        //   });
        //   // return teiSterileRows;
        //   // return teiSterileRows.reverse();

        //   return teiSterileRows.sort(function(a, b) {
        //     // Turn your strings into dates, and then subtract them
        //     // to get a value that is either negative, positive, or zero.
        //     return new Date(b[8]) - new Date(a[8]);
        //   });
        // }
        return teiSterileRows;
      })
    )
    .then((teiSterileRows) => {
      return teiSterileRows;
    })
    .catch((errors) => {
      console.error(errors);
    });
};

// export const getSterileTEI = async (orgUnit,sampleTestingProgram,eventStatus) => {
//   var teiRows = []
//   var api_GP1 = ``
//   var api_GP2 = ``
//   var requestTwo = ''
//   var requestThree = ''
//   var requestFour = ``
//   var requestFive = ``
//   var events = [];

//   if (sampleTestingProgram.length <= 2) {
//       //var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
//       var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&paging=false`
//       var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&paging=false`

//     var eventApi_GP1 = `../../../api/events.json?skipPaging=true&fields=event,trackedEntityInstance,dataValues[dataElement,value]&order=created:asc&program=${sampleTestingProgram[0]}&orgUnit=${orgUnit}&status=COMPLETED`
//     var eventApi_GP2 = `../../../api/events.json?skipPaging=true&fields=event,trackedEntityInstance,dataValues[dataElement,value]&order=created:asc&program=${sampleTestingProgram[1]}&orgUnit=${orgUnit}&status=COMPLETED`

//     requestTwo = axios.get(api_GP1);
//     requestThree = axios.get(api_GP2);

//     requestFour = axios.get(eventApi_GP1);
//     requestFive = axios.get(eventApi_GP2);
//   }

// return axios
// .all([requestTwo,requestThree,requestFour,requestFive])
//   .then(
//     axios.spread((...responses) => {
//       var teiSterileRows = [];
//       var trackedEntityInstanceEvent = [];
//       const responseTwo = responses[0];
//       const responseThree = responses[1];
//       const responseFour = responses[2];
//       const responseFive = responses[3];

//       responseFour.data.events.forEach((event) => {
//         var eventData = {};
//         var dataElement = {};
//         var dataValue = {};
//         eventData.tei = event["trackedEntityInstance"];
//           event.dataValues.forEach(
//             (dataValue) =>
//               (dataElement[dataValue.dataElement] = dataValue.value)
//           );

//         if ((dataElement["VbUbBX7G6Jf"] == "Sterile") ||
//           (dataElement["VbUbBX7G6Jf"] == "Not available") ||
//           (dataElement["VbUbBX7G6Jf"] == "Rejected"))
//             dataValue["deCode"] = dataElement["VbUbBX7G6Jf"];
//           eventData.dataValues = dataValue;
//           events.push(eventData);
//       });
//       responseFive.data.events.forEach((event) => {
//         var eventData = {};
//         var dataElement = {};
//         var dataValue = {};
//         eventData.tei = event["trackedEntityInstance"];
//           event.dataValues.forEach(
//             (dataValue) =>
//               (dataElement[dataValue.dataElement] = dataValue.value)
//           );

//         if ((dataElement["VbUbBX7G6Jf"] == "Sterile") ||
//           (dataElement["VbUbBX7G6Jf"] == "Not available") ||
//           (dataElement["VbUbBX7G6Jf"] == "Rejected"))
//             dataValue["deCode"] = dataElement["VbUbBX7G6Jf"];
//           eventData.dataValues = dataValue;
//           events.push(eventData);
//       });

//       if (responseTwo.data) {
//         var index = 0
//         events.forEach((event) => {
//           let eventTei = event.tei;
//           let eventDeCode = event.dataValues.deCode;
//           if ((eventDeCode == "Sterile") || (eventDeCode == "Not available") || (eventDeCode == "Rejected")) {
//             responseTwo.data.rows.forEach((teis) => {
//               let trackedEntityInstance = teis[0];
//               if (eventTei == trackedEntityInstance) {
//                 let orgUnit = teis[3];
//                   teiSterileRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
//                   teiSterileRows[index]['0'] = teis[8]; //CR Number
//                   teiSterileRows[index]['1'] = teis[9]; //Name
//                   teiSterileRows[index]['3'] = teis[12]; //Age
//                   teiSterileRows[index]['4'] = teis[13]; //Sex
//                   teiSterileRows[index]['5'] = teis[15]; //Address
//                   teiSterileRows[index]['6'] = orgUnit;
//                   teiSterileRows[index]['7'] = trackedEntityInstance;
//                   index = index + 1;
//               }
//               else {
//                 return
//               }
//             })
//           }
//           else {
//             return
//           }
//         })
//         return teiSterileRows
//       }
//       if (responseThree.data) {
//         var index = 0
//         events.forEach((event) => {
//           let eventTei = event.tei;
//           let eventDeCode = event.dataValues.deCode;
//           if ((eventDeCode == "Sterile") || (eventDeCode == "Not available") || (eventDeCode == "Rejected")) {
//             responseTwo.data.rows.forEach((teis) => {
//               let trackedEntityInstance = teis[0];
//               if (eventTei == trackedEntityInstance) {
//                 let orgUnit = teis[3];
//                   teiSterileRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
//                   teiSterileRows[index]['0'] = teis[8]; //CR Number
//                   teiSterileRows[index]['1'] = teis[9]; //Name
//                   teiSterileRows[index]['3'] = teis[12]; //Age
//                   teiSterileRows[index]['4'] = teis[13]; //Sex
//                   teiSterileRows[index]['5'] = teis[15]; //Address
//                   teiSterileRows[index]['6'] = orgUnit;
//                   teiSterileRows[index]['7'] = trackedEntityInstance;
//                   index = index + 1;
//               }
//               else {
//                 return
//               }
//             })
//           }
//           else {
//             return
//           }
//         })
//         return teiSterileRows
//       }
//       return teiSterileRows
//     })
//   ).then((teiSterileRows) => { return teiSterileRows })
// .catch(errors => {
//   console.error(errors);
// });
// }

export const getPendingSampleResult = async (
  orgUnit,
  sampleTestingProgram,
  eventStatus
) => {
  var teiRows = [];
  var api_sample = ``;
  var requestOne = "";
  var requestTwo = ``;
  var trackedEntityData = [];
  var SampleDict = {};

  //var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&skipPaging=true`;
  var eventApi = `../../../api/events.json?fields=*&orgUnit=${orgUnit}&status=ACTIVE&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&paging=false`;
  requestOne = axios.get(api_sample);
  requestTwo = axios.get(eventApi);

  return axios
    .all([requestOne, requestTwo])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        var trackedEntityInstanceEvent = [];
        if (responseTwo.data) {
          responseTwo.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance);
            var trackerid = event?.trackedEntityInstance;
            var labSampleID = "";
            var locationValue = "";
            var LastUpdatedDate = "";
            console.log("event+++++++++++++", event);

            if (!SampleDict.hasOwnProperty(trackerid)) {
              if (event.lastUpdated) {
                LastUpdatedDate = event.lastUpdated;
              }
              event.dataValues.forEach((labEvent, index) => {
                if (labEvent.dataElement == "si9RY754UNU") {
                  labSampleID = labEvent.value; // Update the outer variable
                }

                if (labEvent.dataElement == "q7U3sRRnFg5") {
                  locationValue = labEvent.value; // Update the outer variable
                }
                SampleDict[trackerid] = [
                  labSampleID,
                  locationValue,
                  LastUpdatedDate,
                ];
              });

              // Assign updated values after the loop
            }
          });
        }
        if (responseOne.data) {
          responseOne.data.rows.forEach((teisRow, index) => {
            const trackedEntityInstance = teisRow[0];
            if (trackedEntityInstanceEvent.includes(trackedEntityInstance)) {
              trackedEntityData.push(teisRow);
            }
          });

          trackedEntityData.forEach((teis, index) => {
            let trackedEntityInstance = teis[0];
            let orgUnit = teis[3];
            teiRows[index] = ["", "", "", "", "", "", "", "", "", "", ""];
            teiRows[index]["0"] = teis[8]; //CR Number //Registration number
            teiRows[index]["1"] = teis[9]; //Name/First Name
            teiRows[index]["3"] = teis[12]; //Age
            teiRows[index]["4"] = teis[13]; //Sex
            // teiRows[index]['5'] = teis[15]; //Address
            teiRows[index]["9"] = orgUnit;
            teiRows[index]["7"] = trackedEntityInstance;
            // teiRows[index]["8"] = teis[5];
            if (trackedEntityInstance in SampleDict) {
              teiRows[index]["6"] = SampleDict[trackedEntityInstance][0];
              teiRows[index]["5"] = SampleDict[trackedEntityInstance][1];
              teiRows[index]["8"] = SampleDict[trackedEntityInstance][2];
            }
          });
        }
        return teiRows.sort(function(a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b[8]) - new Date(a[8]);
        });
      })
    )
    .then((teiRows) => {
      return teiRows;
    })
    .catch((errors) => {
      console.error(errors);
    });
};

export const getAllTei = async (orgUnit, sampleTestingProgram, eventStatus) => {
  var teiRows = [];
  var api_GP1 = ``;
  var api_GP2 = ``;
  var api_GP3 = "";
  var api_GP4 = "";
  var api_GP5 = "";

  var requestOne = "";
  var requestTwo = "";
  var requestThree = "";
  var requestFour = "";
  var requestFive = "";
  var SampleDict = {};

  api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&skipPaging=true`;
  api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&skipPaging=true`;
  api_GP3 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[2]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=bwJT1BnH3qE&skipPaging=true`;
  api_GP5 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[3]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&skipPaging=true`;

  api_GP4 = `../../../api/29/sqlViews/aqByEsDNZMv/data.json?paging=false`;

  //api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  //api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`
  //api_GP3 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[2]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false&paging=false`

  requestOne = axios.get(api_GP1);
  requestTwo = axios.get(api_GP2);
  requestThree = axios.get(api_GP3);
  requestFour = axios.get(api_GP4);
  requestFive = axios.get(api_GP5);

  return axios
    .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
    .then(
      axios.spread((...responses) => {
        var rowList = [];

        const responseOne = responses[0];

        const responseTwo = responses[1];
        const responseThree = responses[2];
        const responseFour = responses[3];
        const responseFive = responses[4];
        var trackedEntityInstanceEvent = [];

        if (
          responseTwo.data ||
          responseThree.data ||
          responseOne.data ||
          responseFive.data
        ) {
          responseOne.data.rows.forEach((responseOneTei) => {
            rowList.push(responseOneTei);
            console.log("responseOneTei==========", responseOneTei);
          });
          responseTwo.data.rows.forEach((responseTwoteis) => {
            rowList.push(responseTwoteis);
            console.log("responseTwoteis==========", responseTwoteis);
          });
          responseThree.data.rows.forEach((responseThreeteis) => {
            rowList.push(responseThreeteis);
            console.log("responseThreeteis==========", responseThreeteis);
          });
          responseFive.data.rows.forEach((responsefives) => {
            rowList.push(responsefives);
            // console.log("responseThreeteis==========", responseThreeteis);
          });
          if (responseFour.data && responseFour.data.listGrid.rows) {
            responseFour.data.listGrid.rows.forEach((events) => {
              console.log("event:???????????????????????????? ", events);
              // let eventDeCode = events.dataValues.deCode;
              var dataElement = {};
              var orgunits = events[0];
              var trackerid = events[1];
              var labSampleID = "";
              var LastUpdatedDate = "";

              var locationValue = "";
              if (!SampleDict.hasOwnProperty(trackerid)) {
                if (events[4]) {
                  LastUpdatedDate = events[4];
                }
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(
                  eventDataValuesOutputArray
                )) {
                  if (!dataElement.hasOwnProperty(key)) {
                    dataElement[key] = [value.value, value.created];
                  }
                }
                if (dataElement["si9RY754UNU"]) {
                  labSampleID = dataElement["si9RY754UNU"][0];
                }
                if (dataElement["q7U3sRRnFg5"]) {
                  locationValue = dataElement["q7U3sRRnFg5"][0]; // Update the outer variable
                }
                SampleDict[trackerid] = [
                  labSampleID,
                  locationValue,
                  LastUpdatedDate,
                ];
              }
            });
          }
          console.log("rowLIst===========", rowList);
          let rowUnique = Array.from(
            new Set(rowList.map(JSON.stringify)),
            JSON.parse
          );
          console.log("unique========================", rowUnique);
         rowUnique.length > 0 && rowUnique.forEach((teis, index) => {
            let trackedEntityInstance = teis[0];
            let orgUnit = teis[3];
            if (
              SampleDict[trackedEntityInstance] &&
              SampleDict[trackedEntityInstance].length
            ) {
              let index = teiRows.length;
              teiRows[index] = ["", "", "", "", "", "", "", "", "", "", ""];
              teiRows[index]["0"] = teis[8]; //CR Number //Registration number
              teiRows[index]["1"] = teis[9]; //Name/First Name
              teiRows[index]["3"] = teis[12]; //Age
              teiRows[index]["4"] = teis[13]; //Sex
              // teiRows[index]['5'] = teis[15]; //Address
              teiRows[index]["9"] = orgUnit;
              teiRows[index]["7"] = trackedEntityInstance;
              // teiRows[index]["8"] = teis[5];
              if (trackedEntityInstance in SampleDict) {
                teiRows[index]["6"] = SampleDict[trackedEntityInstance][0];
                teiRows[index]["5"] = SampleDict[trackedEntityInstance][1];
                teiRows[index]["8"] = SampleDict[trackedEntityInstance][2];
              }
            }
          });
        }
        console.log("teiRows================", teiRows);
        // return teiRows;
        //return teiRows.reverse();
        return teiRows.sort(function(a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b[8]) - new Date(a[8]);
        });
      })
    )
    .then((teiRows) => {
      return teiRows;
    })
    .catch((errors) => {
      console.error(errors);
    });
};
