import axios from 'axios'

export const getTEI = async (orgUnit,sampleTestingProgram,eventStatus) => {
    var teiRows = []
    var api_sample = ``
    var api_GP1 = ``
    var api_GP2 = ``
    var requestOne = ''
    var requestTwo = ''
    var requestThree = ''
  
    if (sampleTestingProgram.length < 2) {
        var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStatus=${eventStatus}&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false`
        requestOne = axios.get(api_sample);
    }
    else if (sampleTestingProgram.length > 1) {
        var api_GP1 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[0]}&programStatus=ACTIVE&eventStatus=${eventStatus}&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LEaC0JtgaRF&assignedUser=&pageSize=50&page=1&totalPages=false`
        var api_GP2 = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram[1]}&programStatus=ACTIVE&eventStatus=${eventStatus}&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=ZH528YQyn18&assignedUser=&pageSize=50&page=1&totalPages=false`
        requestTwo = axios.get(api_GP1);
        requestThree = axios.get(api_GP2);
    }

   return axios
  .all([requestOne,requestTwo,requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
        const responseTwo = responses[1];
        const responseThree = responses[2];
        var rowList = [];

        if (responseOne.data) {            
            responseOne.data.rows.forEach((teis, index) => {
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
        if (responseTwo.data || responseThree.data) {
            responseTwo.data.rows.forEach((responseTwoteis, index) => {
                rowList.push(responseTwoteis)
            })
            responseThree.data.rows.forEach((responseThreeteis, index) => {
                rowList.push(responseThreeteis)
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
        })
        }
        return teiRows
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });
  
}



export const getSterileTEI = async (orgUnit,sampleTestingProgram,eventStatus) => {
    var teiSterileRows = []
    var api_sample = ``
  var requestOne = ''
  var requestTwo = '';
  var sterileList = [];
  var bool = false;
  var trackerList = [];
  var isSterile = "";
  var events = [];

    if (sampleTestingProgram.length < 2) {
        var api_sample = `../../../api/30/trackedEntityInstances/query.json?ou=${orgUnit}&ouMode=SELECTED&&order=created:desc&program=${sampleTestingProgram}&programStatus=ACTIVE&eventStatus=${eventStatus}&eventStartDate=2018-08-09&eventEndDate=2024-01-30&programStage=LjiZPsbh1oy&assignedUser=&pageSize=50&page=1&totalPages=false`
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