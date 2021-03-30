import React, { useEffect } from 'react'
import { CardSection } from '@hisp-amr/app'
import { useSelector, useDispatch } from 'react-redux'
import {Table,TableBody,TableRow,TableCell,Button} from '@dhis2/ui-core'
import {getExistingEvent,addPreviousEntity} from '@hisp-amr/app'
import { withRouter } from 'react-router-dom'
import './main.css'
import $ from "jquery"
import SweetAlert from 'react-bootstrap-sweetalert';
import { deleteTEI, deleteEvent } from '@hisp-amr/api'
const Events = ({match, history }) => {
    var data = [];
    const dispatch = useDispatch()
    var events = useSelector(state => state.data.eventList);
    var programs = useSelector(state => state.metadata.programs);
    var teiId = match.params.teiId
    var orgUnit = match.params.orgUnit
    useEffect(() => {
        $("#msg1").hide();
        $('#succes1').hide();
      });
      const onConfirm=(e)=>{
        e.preventDefault();
        events.forEach(element => {
            deleteEvent(element.event).then( res =>{
            })
        });
        deleteTEI(teiId).then(res => {
            if(res.httpStatus == 'OK')
            {
            $('#succes1').show();
            }
       })
         $('#msg1').hide();
        }
    
       const onNo =(e) =>{
              e.preventDefault();
              $('#msg1').hide();
        }
        const onYes =(e) =>{
            history.goBack()
      }
  
    const onEdit = (ou, eventId, dataValues) => {
        localStorage.setItem('eventId', eventId) 
        let btnStatus= false
        for (let dataValue of dataValues) {
            let dataElement = dataValue.dataElement;
            if( dataElement == 'u8VDCIwa3w4'){  // id of organism detected data element in sample testing
                btnStatus = true;
            }
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
                    var name=[], dataValue= [], data= [], date =[];
                     //date['value'] =  JSON.stringify(new Date(ele.eventDate)).slice(1,11);
                     date['value'] =  ele.eventDate.substring(0, 10);
                     for (let program of programs) {
                        if (program.id == proId) {
                             name['value'] = program.name;
                        }
                    }
                    for( let value of ele.dataValues){
                            dataValue['0']=name
                        if(value.dataElement == 'B7XuDaXPv10'){
                            dataValue['1'] =value;
                        }
                        if(value.dataElement == 'GpAu5HjWAEz'){
                            dataValue['2'] =value;
                        }
                        if(value.dataElement == 'mp5MeJ2dFQz'){
                            dataValue['3'] =value;
                        }
                        if((value.dataElement == 'SaQe2REkGVw') || (value.dataElement  =='u8VDCIwa3w4')){  // id of organism detected data element in sample testing
                            dataValue['4'] =value;
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
                           if(dataValue['4'].value !== 'Detected'){
                                data = dataValue;
                        }
                    return (  
                        <>
                        { data.length ? 
                         <TableRow >
                            {data.map(ele =>(<TableCell>{ele.value}</TableCell>))}
                            <Button primary={true} onClick={() => onEdit(ele.orgUnit, ele.event, ele.dataValues)}>Edit</Button>
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
                <Button destructive={true} onClick={() => OnDelete()}>Delete Record</Button>&nbsp;&nbsp;&nbsp;
                <Button primary={true} onClick={() => onAddClick()}>Add Sample</Button>&nbsp;&nbsp;&nbsp;
                 </div>
                <div className='sidebar'>
                    <Table>
                    <TableRow>
                    <TableCell><b>Program Name</b></TableCell> 
                    <TableCell><b>Location</b></TableCell> 
                    <TableCell><b>Lap Sample ID</b></TableCell> 
                    <TableCell><b>Sample Type</b></TableCell> 
                    <TableCell><b>Organism</b></TableCell> 
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
                      <Button primary={true} onClick={(e)=>onConfirm(e)}>Yes</Button>&emsp;&emsp;&emsp;
                      <Button onClick={(e)=>onNo(e)}>No</Button>
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
