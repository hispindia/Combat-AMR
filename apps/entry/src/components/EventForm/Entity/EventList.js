import React, { useEffect } from 'react'
import { CardSection } from '@hisp-amr/app'
import { useSelector, useDispatch } from 'react-redux'
import {Table,TableBody,TableRow,TableCell,Button} from '@dhis2/ui-core'
import {getEventObject, getExistingEvent,addPreviousEntity, setAggregationProgress} from '@hisp-amr/app'
import { withRouter } from 'react-router-dom'
import './main.css'
import $ from "jquery"
import SweetAlert from 'react-bootstrap-sweetalert';
import { deleteTEI, deleteEvent } from '@hisp-amr/api'
import { SAMPLE_TYPEID } from './constants';

import {Aggregate} from '../../../api/helpers/aggregate'

const Events = ({match, history }) => {
    var data = [];
    const dispatch = useDispatch()
    var metadata = useSelector(state => state.metadata);
    var events = useSelector(state => state.data.eventList);
    var programs = useSelector(state => state.metadata.programs);
    var teiId = match.params.teiId
    var orgUnit = match.params.orgUnit
    const categoryCombos = useSelector(state=> state.metadata.categoryCombos)
    const dataElementObjects = useSelector(state=> state.metadata.dataElementObjects)
    const dataSets = useSelector(state=>state.metadata.dataSets)
    var aggregationOnProgress = useSelector(state => state.data.aggregationOnProgress)
    var userAccess = false;

    programs.forEach(p => {
        p.programStages.forEach(ps => {
            userAccess = ps.access.data.write
        })
    })

    const { programOrganisms, optionSets } = useSelector(state => state.metadata)

    useEffect(() => {
        $("#msg1").hide();
        $('#succes1').hide();
      });
      const onConfirm= async (e)=>{
        e.preventDefault();

        let allStatus = true
        for(let index in events){
            let event = events[index]
            //first get the event object as expected from aggregate
            let eventObject = await getEventObject(metadata, event.orgUnit, event.trackedEntityInstance, event.event, true, false)
            let sampleDate = event.eventDate
            //call aggregate
            let res = await Aggregate(
                {
                    event: eventObject,
                    operation: "INCOMPLETE",
                    dataElements: dataElementObjects,
                    categoryCombos: categoryCombos,
                    dataSets: dataSets,
                    orgUnit: orgUnit,
                    programs: programs,
                    sampleDate: sampleDate,
                    changeStatus: changeAggregationStatus
                }
            )
            if(res.response){
                await deleteEvent(eventObject.eventId).then(response=>{
                    if(response.httpStatus!=="OK"){
                        allStatus = false
                    }
                })
            }else{
                allStatus =false
            }

        }
        changeAggregationStatus(false);
        if(allStatus ){
            deleteTEI(teiId).then(res => {
                if(res.httpStatus == 'OK'){
                    $('#succes1').show();
                }
           })
        }
         $('#msg1').hide();
        }

       const onNo =(e) =>{
              e.preventDefault();
              $('#msg1').hide();
        }
        const onYes =(e) =>{
            history.goBack()
      }

    const changeAggregationStatus = (status)=>{
        dispatch(setAggregationProgress(status))
        aggregationOnProgress = status
    }

    const onEdit = (ou, eventId, dataValues) => {
        localStorage.setItem('eventId', eventId)
        let btnStatus= false
        for (let dataValue of dataValues) {
            let dataElement = dataValue.dataElement;
            // if( dataElement == 'VbUbBX7G6Jf'){  // id of organism detected data element in sample testing
            //     btnStatus = true;
            // }
        }
        let editStatus = true;
        dispatch(getExistingEvent(ou, teiId, eventId, editStatus, btnStatus))
    }
    if (events != undefined) {
        data = events
    }
     const onAddClick = () => {
        dispatch(addPreviousEntity());
        history.push(`/orgUnit/${orgUnit}/event/`)
     }
     const OnDelete =() => {
         $('#msg1').show()
     }
    var val = () => {
        if (events != undefined) {
            const v = events.map((ele, index) => {
                if (ele) {
                    var proId = ele.program;
                    var name = [], dataValue = [], data = [], date = [];
                    var listorganisms = [];
                    var orgValue = [];
                    var orgn = ""
                    var sampleVal = [];
                     //date['value'] =  JSON.stringify(new Date(ele.eventDate)).slice(1,11);
                     date['value'] =  ele.eventDate.substring(0, 10);
                     for (let program of programs) {
                        if (program.id == proId) {
                            name['value'] = program.name;
                            optionSets[programOrganisms[program.id]].forEach(o => {
                            if (!listorganisms.find(org => org.value === o.value)) listorganisms.push(o);
                            });
                        }
                    }


                    for( let value of ele.dataValues){
                            dataValue['0']=name
                        if(value.dataElement == 'q7U3sRRnFg5'){
                            dataValue['1'] =value;
                        }
                        if(value.dataElement == 'si9RY754UNU'){
                            dataValue['2'] =value;
                        }
                        if (value.dataElement == 'GqP6sLQ1Wt3') {
                            optionSets[SAMPLE_TYPEID].forEach(o => {
                                if (o.value == value.value) {
                                    value.value = o.label
                                }
                           });
                            sampleVal['value'] = value.value;
                            dataValue['3'] = sampleVal;

                        }
                        if((value.dataElement == 'VsNSbOlwed9') || (value.dataElement  =='VbUbBX7G6Jf')){  // id of organism detected data element in sample testing
                            if (listorganisms.length > 0) {
                            orgn = listorganisms.find(element => {
                            return element.value ==  value.value;
                            });
                            if (orgn) {
                                value.value = orgn.label
                            }
                            }
                            orgValue['value'] = value.value;
                            dataValue['4'] = orgValue;
                        }
                        dataValue['5']=date
                     }
                            if (!dataValue['1']){
                              let data = [ {value: ''}]
                              dataValue['1']=data
                            }
                            if (!dataValue['2']){
                                let data = [ {value: ''}]
                                dataValue['2']=data
                              }
                            if (!dataValue['3']){
                                let data = [ {value: ''}]
                                dataValue['3']=data
                              }
                              if (!dataValue['4']){
                                let data = [ {value: ''}]
                                dataValue['4']=data
                              }
                           if(dataValue['4'].value !== 'Pathogen detected'){
                                data = dataValue;
                        }
                    return (
                        <>
                        { data.length ?
                         <TableRow >
                                    {data.map(ele => (
                                        <TableCell>
                                            {ele.value}
                                        </TableCell>
                                    ))}
                            <Button primary={true} onClick={() => onEdit(ele.orgUnit, ele.event, ele.dataValues)}>{userAccess && "Edit"}{!userAccess && "View"}</Button>
                        </TableRow>
                        : ''}
                        </>)
                }
            })
            return v
        }
    }

    return (
            <CardSection heading="Event List">
                <div  className="btn">
                <Button primary={true} onClick={() => onAddClick()} disabled={!userAccess}>Add Sample</Button>&nbsp;&nbsp;&nbsp;
                <Button destructive={true} onClick={() => OnDelete()} disabled={!userAccess}>Delete Record</Button>&nbsp;&nbsp;&nbsp;
                <Button primary={true} onClick={() => onYes()}>Back</Button>&nbsp;&nbsp;&nbsp;
                 </div>
            <br></br>
            <br></br>
                <div className='sidebar'>
                    <Table>
                    <TableRow>
                    <TableCell><b>Program Name</b></TableCell>
                    <TableCell><b>Location</b></TableCell>
                    <TableCell><b>Lab ID</b></TableCell>
                    <TableCell><b>Sample Type</b></TableCell>
                    <TableCell><b>Pathogen</b></TableCell>
                    <TableCell><b>Event Date</b></TableCell>
                    </TableRow>
                        <TableBody>
                            {val()}
                        </TableBody>
                    </Table>
                </div>
                <div id="msg1">
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                customButtons={
                    <React.Fragment>
                      <Button disabled={aggregationOnProgress} primary={true} onClick={(e)=>onConfirm(e)}>Yes</Button>&emsp;&emsp;&emsp;
                      <Button disabled={aggregationOnProgress} onClick={(e)=>onNo(e)}>No</Button>
                    </React.Fragment>
                  }
                >
                You will not able to recover this TEI Detail!
                </SweetAlert>
            </div>
            <div id='succes1'>
            <SweetAlert success title="TEI Delete success"
             customButtons={
                <React.Fragment>
                  <Button primary={true} onClick={(e)=>onYes(e)}>Ok</Button>&emsp;&emsp;&emsp;
                </React.Fragment>
              }
            >
            </SweetAlert>
            </div>
            </CardSection>
    )
}

// DataElement.propTypes = {
//     id: string.isRequired,
// }
export default withRouter(Events)
