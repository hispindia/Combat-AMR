import axios from 'axios'

export const getAntibioticFollowTEI = async (orgUnit,sampleTestingProgram,eventStatus,isFollowUp) => {
  var teiRows = []
  var api_GP1 = ``
  var api_GP2 = ``
  var requestOne = ''
  var requestTwo = ''
  var requestTwoFollow = ''
  var requestThree = ''
  var requestThreeFollow = ''

  var requestFour = ''
  var requestFourFollow = ''
  var requestFive = ''
  var requestFiveFollow = ''

  var api_GP1_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false`
  var api_GP2_follow = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=true&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false`

  var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false`
  var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&followUp=false&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false`

  var eventApi_GP1_follow = `../../../api/events.json?orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[0]}&followUp=true&programStatus=ACTIVE&programStage=LEaC0JtgaRF`
  var eventApi_GP2_follow = `../../../api/events.json?orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[1]}&followUp=true&programStatus=ACTIVE&programStage=ZH528YQyn18`
  var eventApi_GP1 = `../../../api/events.json?orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[0]}&followUp=false&programStatus=ACTIVE&programStage=LEaC0JtgaRF`
  var eventApi_GP2 = `../../../api/events.json?orgUnit=${orgUnit}&status=${eventStatus}&program=${sampleTestingProgram[1]}&followUp=false&programStatus=ACTIVE&programStage=ZH528YQyn18`


  requestTwoFollow = axios.get(api_GP1_follow);
  requestThreeFollow = axios.get(api_GP2_follow);
  requestTwo = axios.get(api_GP1);
  requestThree = axios.get(api_GP2);

  requestFourFollow = axios.get(eventApi_GP1_follow);
  requestFiveFollow = axios.get(eventApi_GP2_follow);
  requestFour = axios.get(eventApi_GP1);
  requestFive = axios.get(eventApi_GP2);


   return axios
  .all([requestTwoFollow,requestThreeFollow,requestTwo,requestThree,requestFourFollow,requestFiveFollow,requestFour,requestFive])
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

      if (responseFourFollow.data || responseFiveFollow.data || responseFour.data || responseFive.data) {
          responseFourFollow.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
          responseFiveFollow.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
          responseFour.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
          responseFive.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
      }

      if (responseTwo.data || responseThree.data || responseTwoFollow.data || responseThreeFollow.data) {
        responseTwoFollow.data.rows.forEach((responseTwoFollowteis) => {
            const trackedEntityInstanceTwoFollow = responseTwoFollowteis[0]

          if (trackedEntityInstanceEvent.includes(trackedEntityInstanceTwoFollow)) {
              responseTwoFollowteis.push(sampleTestingProgram[0])
              responseTwoFollowteis.push(true)
            rowList.push(responseTwoFollowteis)
          }
          })
        responseThreeFollow.data.rows.forEach((responseThreeFollowteis) => {
            const trackedEntityInstanceThreeFollow = responseThreeFollowteis[0]
          if (trackedEntityInstanceEvent.includes(trackedEntityInstanceThreeFollow)) {
                responseThreeFollowteis.push(sampleTestingProgram[1])
                responseThreeFollowteis.push(true)
                rowList.push(responseThreeFollowteis)
          }
          })
        responseTwo.data.rows.forEach((responseTwoteis) => {
          const trackedEntityInstanceTwo = responseTwoteis[0]
          if (trackedEntityInstanceEvent.includes(trackedEntityInstanceTwo)) {
            responseTwoteis.push(sampleTestingProgram[0])
            responseTwoteis.push(false)
            rowList.push(responseTwoteis)
          }
          })

        responseThree.data.rows.forEach((responseThreeteis) => {
          const trackedEntityInstanceThree = responseThreeteis[0]
          if (trackedEntityInstanceEvent.includes(trackedEntityInstanceThree)) {
            responseThreeteis.push(sampleTestingProgram[1])
            responseThreeteis.push(false)
            rowList.push(responseThreeteis)
          }
          })

            rowList.forEach((teis, index) => {
            const trackedEntityInstance = teis[0]
            const orgUnit = teis[3]
            teiRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
            teiRows[index]['0'] = teis[7] //CR Number
            teiRows[index]['1'] = teis[8] //Name
            teiRows[index]['3'] = teis[11] //Age
            teiRows[index]['4'] = teis[12] //Sex
            teiRows[index]['5'] = teis[14] //Address
            teiRows[index]['6'] = orgUnit
            teiRows[index]['7'] = trackedEntityInstance
            teiRows[index]['8'] = teis[5]
            teiRows[index]['9'] = teis[17]
            isFollowUp[teis[7].toString()] = teis[18]
        })
        }
      return { teiRows, isFollowUp }
    })
   ).then(({ teiRows, isFollowUp }) => {
     return { teiRows, isFollowUp }
   })
  .catch(errors => {
    console.error(errors);
  });

}

export const getPendingAntiResult = async (orgUnit,sampleTestingProgram,eventStatus) => {
  var teiRows = []
  var api_GP1 = ``
  var api_GP2 = ``
  var requestTwo = ''
  var requestThree = ''
  var requestFour = ``
  var requestFive = ``

  var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false`
  var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false`

  var eventApi_GP1 = `../../../api/events.json?orgUnit=${orgUnit}&status=ACTIVE&program=${sampleTestingProgram[0]}&programStatus=ACTIVE`
  var eventApi_GP2 = `../../../api/events.json?orgUnit=${orgUnit}&status=ACTIVE&program=${sampleTestingProgram[0]}&programStatus=ACTIVE`

  requestTwo = axios.get(api_GP1);
  requestThree = axios.get(api_GP2);

  requestFour = axios.get(eventApi_GP1);
  requestFive = axios.get(eventApi_GP2);

   return axios
  .all([requestTwo,requestThree,requestFour,requestFive])
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
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
          responseFive.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
      }

      if (responseTwo.data || responseThree.data) {

        responseTwo.data.rows.forEach((responseTwoteis, index) => {
              const trackedEntityInstance = responseTwoteis[0]
              if (trackedEntityInstanceEvent.includes(trackedEntityInstance)) {
                rowList.push(responseTwoteis);
              }

            })
        responseThree.data.rows.forEach((responseThreeteis, index) => {
              const trackedEntityInstanceId = responseThreeteis[0]
              if (trackedEntityInstanceEvent.includes(trackedEntityInstanceId)) {
                rowList.push(responseThreeteis)
              }
          })

          rowList.forEach((teis, index) => {
            const trackedEntityInstance = teis[0]
            const orgUnit = teis[3]
            teiRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
            teiRows[index]['0'] = teis[7] //CR Number
            teiRows[index]['1'] = teis[8] //Name
            teiRows[index]['3'] = teis[11] //Age
            teiRows[index]['4'] = teis[12] //Sex
            teiRows[index]['5'] = teis[14] //Address
            teiRows[index]['6'] = orgUnit
            teiRows[index]['7'] = trackedEntityInstance
            teiRows[index]['8'] = teis[5]
        })
        }
      return teiRows
    })
   ).then((teiRows) => {
     return teiRows
   })
  .catch(errors => {
    console.error(errors);
  });

}

export const getSterileTEI = async (orgUnit,sampleTestingProgram,eventStatus) => {
    var teiSterileRows = []
    var api_sample = ``
  var requestOne = ''
  var requestTwo = '';
  var events = [];

    if (sampleTestingProgram.length < 2) {
        var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false`
      requestOne = axios.get(api_sample);
      var sterileUrl = `../../../api/events.json?paging=false&fields=event,trackedEntityInstance,dataValues[dataElement,value]&order=created:asc&program=WhYipXYg2Nh&orgUnit=${orgUnit}&status=COMPLETED`
      requestTwo = axios.get(sterileUrl)
    }

  return axios
    .all([requestOne, requestTwo])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        responseTwo.data.events.forEach((event) => {
          var eventData = {};
          var dataElement = {};
          var dataValue = {};
          eventData.tei = event["trackedEntityInstance"];
            event.dataValues.forEach(
              (dataValue) =>
                (dataElement[dataValue.dataElement] = dataValue.value)
            );

          if ((dataElement["VbUbBX7G6Jf"] == "Sterile") ||
            (dataElement["VbUbBX7G6Jf"] == "Not available") ||
            (dataElement["VbUbBX7G6Jf"] == "Rejected"))
              dataValue["deCode"] = dataElement["VbUbBX7G6Jf"];
            eventData.dataValues = dataValue;
            events.push(eventData);
        });


        if (responseOne.data) {
          var index = 0
          events.forEach((event) => {
            let eventTei = event.tei;
            let eventDeCode = event.dataValues.deCode;
            if ((eventDeCode == "Sterile") || (eventDeCode == "Not available") || (eventDeCode == "Rejected")) {
              responseOne.data.rows.forEach((teis) => {
                const trackedEntityInstance = teis[0]
                if (eventTei == trackedEntityInstance) {
                  const orgUnit = teis[3]
                    teiSterileRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
                    teiSterileRows[index]['0'] = teis[7] //CR Number
                    teiSterileRows[index]['1'] = teis[8] //Name
                    teiSterileRows[index]['3'] = teis[11] //Age
                    teiSterileRows[index]['4'] = teis[12] //Sex
                    teiSterileRows[index]['5'] = teis[14] //Address
                    teiSterileRows[index]['6'] = orgUnit
                    teiSterileRows[index]['7'] = trackedEntityInstance
                  index = index + 1;
                }
                else {
                  return
                }
              })
            }
            else {
              return
            }
          })
          return teiSterileRows
        }
        return teiSterileRows
      })
    ).then((teiSterileRows) => { return teiSterileRows })
  .catch(errors => {
    console.error(errors);
  });
}



export const getPendingSampleResult = async (orgUnit,sampleTestingProgram,eventStatus) => {
  var teiRows = []
  var api_sample = ``
  var requestOne = ''
  var requestTwo = ``
  var trackedEntityData = []

  var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false`
  var eventApi = `../../../api/events.json?orgUnit=${orgUnit}&status=ACTIVE&program=${sampleTestingProgram}&programStatus=ACTIVE`
  requestOne = axios.get(api_sample);
  requestTwo = axios.get(eventApi);

  return axios
    .all([requestOne,requestTwo])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        var trackedEntityInstanceEvent = [];
        if (responseTwo.data) {
          responseTwo.data.events.forEach((event, index) => {
            trackedEntityInstanceEvent.push(event.trackedEntityInstance)
          })
        }
          if (responseOne.data) {
            responseOne.data.rows.forEach((teisRow, index) => {
              const trackedEntityInstance = teisRow[0]
              if (trackedEntityInstanceEvent.includes(trackedEntityInstance)) {
                trackedEntityData.push(teisRow);
              }
            })

          trackedEntityData.forEach((teis, index) => {
            const trackedEntityInstance = teis[0]
            const orgUnit = teis[3]
            teiRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
              teiRows[index]['0'] = teis[7] //CR Number
              teiRows[index]['1'] = teis[8] //Name
              teiRows[index]['3'] = teis[11] //Age
              teiRows[index]['4'] = teis[12] //Sex
              teiRows[index]['5'] = teis[14] //Address
              teiRows[index]['6'] = orgUnit
              teiRows[index]['7'] = trackedEntityInstance

        })
        }
        return teiRows
      })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });
}

export const getAllTei = async (orgUnit,sampleTestingProgram,eventStatus) => {
  var teiRows = []
  var api_GP1 = ``
  var api_GP2 = ``
  var api_GP3 = ''
  var requestOne = ''
  var requestTwo = ''
  var requestThree = ''

  api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false`
  api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false`
  api_GP3 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[2]}&programStatus=ACTIVE&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false`
  requestOne = axios.get(api_GP1);
  requestTwo = axios.get(api_GP2);
  requestThree = axios.get(api_GP3);



   return axios
  .all([requestOne,requestTwo,requestThree])
  .then(
    axios.spread((...responses) => {
      var rowList = [];
      const responseOne = responses[0];
      const responseTwo = responses[1];
      const responseThree = responses[2];

      if (responseTwo.data || responseThree.data || responseOne.data) {

            responseOne.data.rows.forEach((responseOneTei) => {
              rowList.push(responseOneTei)
            })
            responseTwo.data.rows.forEach((responseTwoteis) => {
              rowList.push(responseTwoteis)
            })
            responseThree.data.rows.forEach((responseThreeteis) => {
              rowList.push(responseThreeteis)
            })

            let rowUnique = Array.from(new Set(rowList.map(JSON.stringify)), JSON.parse);
            rowUnique.forEach((teis, index) => {
            const trackedEntityInstance = teis[0]
            const orgUnit = teis[3]
            teiRows[index] = ['', '', '', '', '', '', '', '', '', '', '']
            teiRows[index]['0'] = teis[7] //CR Number
            teiRows[index]['1'] = teis[8] //Name
            teiRows[index]['3'] = teis[11] //Age
            teiRows[index]['4'] = teis[12] //Sex
            teiRows[index]['5'] = teis[14] //Address
            teiRows[index]['6'] = orgUnit
            teiRows[index]['7'] = trackedEntityInstance
            teiRows[index]['8'] = teis[5]
        })
        }
      return teiRows
    })
   ).then((teiRows) => {
     return teiRows
   })
  .catch(errors => {
    console.error(errors);
  });

}