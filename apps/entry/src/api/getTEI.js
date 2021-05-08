import { get } from '@hisp-amr/api'
import axios from 'axios'

export const getTEI = async (orgUnit,sampleTestingProgram,eventStatus) => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
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
    // var api1 = `../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=${sampleTestingProgram}&ou=${orgUnit}`

    // let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    // let api4 = '../../../api/29/sqlViews/jBJk7UjdEUF/data.json?paging=false' // Baseline DB

    // const requestThree = axios.get(api4);

   return axios
  .all([requestOne,requestTwo,requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
        const responseTwo = responses[1];
        const responseThree = responses[2];
        var rowList = [];

        if (responseOne.data) {
        //  if (responseThree.data.listGrid.rows) {
        //    responseThree.data.listGrid.rows.forEach(events => {
        //     var dataElement = {};
        //     var orgunits = events[0]
        //        var trackerid = events[1]
        //        var labsampleid = ""
        //     if (!SampleDict.hasOwnProperty(trackerid)) {                  
        //             if (!events[5]) {
        //             var eventdate = "No data to show"
        //             }
        //             else {
        //             var eventdate = events[5]
        //             }
        //             var outputarray = JSON.parse(events[3].value);                  
        //             for (const [key, value] of Object.entries(outputarray)) {
        //                 if (!dataElement.hasOwnProperty(key)) {
        //                 dataElement[key] = [value.value,value.created]
        //                 }
        //             }
        //             if (dataElement["GqP6sLQ1Wt3"])
        //             {
        //                 var samplevalue = dataElement["GqP6sLQ1Wt3"][0]   
        //                 eventdate = dataElement["GqP6sLQ1Wt3"][1]
        //             }
        //             else {
        //                 var samplevalue = "No data to show"
        //         }
        //         if (dataElement["si9RY754UNU"]) {
        //             labsampleid = dataElement["si9RY754UNU"][0]   
        //         }
        //         SampleDict[trackerid] = [orgunits, eventdate, samplevalue,labsampleid]
        //         }
        //     });
        //     }
        
            
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
            
            // teis.attributes.forEach(tei => {
            //     if (tei.attribute == 'uo3FuH69WXH')
            //         teiRows[index]['0'] = tei.value //CR Number
            //     if (tei.attribute == 'fDlJhn3yD3d')
            //         teiRows[index]['1'] = tei.value //Name
            //     if (tei.attribute == 'aY7sH2CC9V8')
            //         teiRows[index]['3'] = tei.value //Age
            //     if (tei.attribute == 'R7d96ZGjJS8')
            //         teiRows[index]['4'] = tei.value //Sex
            //     if (tei.attribute == 'k6bAJRy63zW')
            //         teiRows[index]['5'] = tei.value //Address
            //     teiRows[index]['6'] = orgUnit
            //     teiRows[index]['7'] = trackedEntityInstance
            //     if ((trackedEntityInstance in SampleDict) && (orgUnit == SampleDict[trackedEntityInstance][0])) {
            //     teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
            //     teiRows[index]['9'] = SampleDict[trackedEntityInstance][2]
            //     teiRows[index]['10'] = SampleDict[trackedEntityInstance][3]
            //     }
            // })
                
                
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
