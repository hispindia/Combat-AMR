import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
   
} from '@hisp-amr/app'
import {
    Button,
} from '@dhis2/ui-core'
import { Entity } from './Entity'
import { EventButtons } from './EventButtons'
import Events from './Entity/EventList'
import $ from "jquery"
import { deleteEvent } from '@hisp-amr/api'
import SweetAlert from 'react-bootstrap-sweetalert';
export const EventForm = ({ history, match }) => {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const dispatch = useDispatch()
    const error = useSelector(state => state.data.status) === ERROR
    const panelValid = useSelector(state => state.data.panel.valid)
    const pageFirst = useSelector(state => state.data.pageFirst)
    var eventEditable = useSelector(state => state.data.eventEditable)
    var editable = useSelector(state => state.data.editable)
    const event = useSelector(state => state.data.event)
    const eventIDs = useSelector(state => state.data.event.id)
    const previousValues = useSelector(state => state.data.previousValues)
    var orgUnit = match.params.orgUnit
    const teiId = match.params.teiId;
    useEffect(() => {
        if( pageFirst ){
            $("#a").hide(); 
        } else {
            $("#a").show(); 
            $("#panel").hide();
        }
        $("#btn").hide();
      if(eventEditable === true){
        $("#btn").show();
        $("#popup").show();
        } 
        $("#msg").hide();
        $('#success').hide();
      });
    useEffect(() => {
        // let previousEvent = ""
        // if(!pageFirst) {
        //     previousEvent = "";  
        // }
        dispatch(resetData())
        if (teiId) {
            dispatch(getExistingEvent(orgUnit, teiId))
        }
        else {
           dispatch(initNewEvent(orgUnit))
        }
        setIsFirstRender(false)
    }, [])

    //for Previous event value 
    useEffect(()=> {
        // dispatch(PreValue(previousValues))
        if (eventIDs && editable) {
            var isPrev = true
            for (let eventValues in previousValues) {
                    if (event["values"][eventValues] == "") {
                        dispatch(setEventValue(eventValues, previousValues[eventValues],isPrev))
                        // event["values"][eventValues] = previousValues[eventValues]
                    }
            }
            // dispatch(addExistingEvent(event))
            // dispatch(resetPreviousEntity())
        }
    }, [eventIDs])
    
    // for previous entity values 

    useEffect(() => {
        if (previousValues.id) {
            dispatch(addEntity())
            dispatch(resetPreviousEntity())
        }
    }, [previousValues])
    useEffect(() => {
        if (error) history.goBack()
    }, [error])

    useEffect(() => {
        if (!isFirstRender && panelValid && pageFirst) dispatch(createNewEvent())
    }, [panelValid, pageFirst])

    const onDelete =(e) =>{
        e.preventDefault();
        $('#msg').show();
    }
    
    const  onCancel =(e) =>{
        e.preventDefault();
        if(pageFirst){
            history.goBack()
        }
           $("#panel").hide();
           $("#popup").hide();       
    }
   const onConfirm=(e)=>{
    e.preventDefault();
    let eventID =localStorage.getItem('eventId')
     deleteEvent(eventID).then(res => {
        if(res.httpStatus == 'OK')
        {
        $('#success').show();
        }
   })
     $("#popup").hide();
     $("#panel").hide();
     $('#msg').hide();
    }
   const onNo =(e) =>{
          e.preventDefault();
          $("#popup").hide();
          $("#panel").hide();
          $('#msg').hide();
    }
    const onYes =(e) =>{
        window.location.reload(false)
        $("#popup").hide();
        $("#panel").hide();
  }
    if (isFirstRender) return <TitleRow title="Record" history={history} />
    return (
        <MainSection padded>
            <TitleRow title="Record" history={history} />
            <form autoComplete="off">
                <Entity showEdit={!panelValid} />
                <div id="a">
                <Events />
                </div>
                { (eventEditable || editable) ? <div id='popup'>
                <SweetAlert
                style={{
                    width: '90%'
                }}
                openAnim={{ name: 'showSweetAlert', duration: 2000 }}
                closeAnim={{ name: 'hideSweetAlert', duration: 2000 }}
                customButtons={
                    <React.Fragment>
                         <EventButtons history={history} existingEvent={teiId} />&emsp;&emsp;&emsp;&emsp;&emsp;
                        <div id="btn">
                        <Button  destructive={true} onClick={(e)=>onDelete(e)}>Delete</Button>&emsp;&emsp;&emsp;&emsp;&emsp;
                        </div>
                      <Button onClick={(e)=>onCancel(e)}>Cancel</Button>
                    </React.Fragment>
                  }
                >
                <Panel />
                <Event />
               </SweetAlert> 
                </div> :
                <div id="panel"> 
                <Panel showEdit={panelValid} />
                <Event />
                <EventButtons history={history} existingEvent={teiId} />
                </div>}
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
                      <Button primary={true} onClick={(e)=>onConfirm(e)}>Yes</Button>&emsp;&emsp;&emsp;
                      <Button onClick={(e)=>onNo(e)}>No</Button>
                    </React.Fragment>
                  }
                >
                You will not able to recover this event Detail!
                </SweetAlert>
            </div>
            <div id='success'>
            <SweetAlert success title="Event Delete Success"   
             customButtons={
                <React.Fragment>
                  <Button primary={true} onClick={(e)=>onYes(e)}>Ok</Button>&emsp;&emsp;&emsp;
                </React.Fragment>
              }
            >
            </SweetAlert>
            </div>
        </MainSection>
    )
}
export default withRouter(EventForm)
