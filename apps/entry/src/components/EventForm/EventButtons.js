import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
    ButtonRow,
    submitEvent,
    editEvent,
    setDeletePrompt,
    DUPLICATE_ERROR,
    saveEvent,
    inCompleteEvent,
    nextEvent,
} from '@hisp-amr/app'
import {
    Aggregate
} from '../../api/helpers/aggregate'
import $ from "jquery"


const StyledButtonRow = styled(ButtonRow)`
    margin: 0px;
`

export const EventButtons = ({ history, existingEvent }) => {
    const dispatch = useDispatch()
    const buttonsDisabled = useSelector(state => state.data.buttonsDisabled)
    var btnStatus = useSelector(state => state.data.btnStatus)
    const status = useSelector(state => state.data.event.status)
    const event = useSelector(state => state.data.event)
    const eventId = useSelector(state => state.data.event.id)
    const invalid = useSelector(state => state.data.event.invalid)
    const valid = useSelector(state => state.data.panel.valid)
    const duplicate = useSelector(state => state.data.event.duplicate)
    const exit = useSelector(state => state.data.exit)
    const dataElementObjects = useSelector(state=> state.metadata.dataElementObjects)
    const programs = useSelector(state=>state.metadata.programs)
    const categoryCombos = useSelector(state=> state.metadata.categoryCombos)
    const dataSets = useSelector(state=>state.metadata.dataSets)
    const orgUnit = useSelector(state=>state.data.orgUnit)
    const buttonLoading = useSelector(state => state.data.buttonLoading)
    const pageFirst = useSelector(state => state.data.pageFirst)
    const removeButtton = useSelector(state => state.data.removebtn)
    const prevValues = Object.keys(useSelector(state => state.data.previousValues)).length ? true : false;
    const isCompleteClicked = useSelector(state => state.data.completeClicked)
    const entityValid = useSelector(state => state.data.entity.valid)
    var { sampleDate, defaultProgram } = useSelector(state => state.data.panel)
    var editable = useSelector(state => state.data.editable)
    var addSampleValid = (defaultProgram.length && !editable && sampleDate) ? false : true
    
    const onBack = () => {
        if (!prevValues && editable) {
            $("#popup").hide();
         }
        else {
            history.goBack();
        }
    }

    const onSubmit = async addMore => {
        let res = await Aggregate({
            event:event,
            operation:"COMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            orgUnit: orgUnit.id,
            programs: programs
        })
        if(res.response){
            await dispatch(submitEvent(addMore))
        }
    }
    const submitExit = async () => await onSubmit(false)    
    const onEdit = async () => {
        let res = await Aggregate({
            event:event,
            operation:"INCOMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            orgUnit: orgUnit.id,
            programs: programs
        })
        if(res.response){
            await dispatch(editEvent())
        }
    }

    // Next button ,Submit and Add New ISO, Submit and Add New Sample, Save start
    const onNextSubmit = async (next,addMoreSample,addMoreIso) => await dispatch(nextEvent(next,addMoreSample,addMoreIso))
    const onNext = async () => await onNextSubmit(true,false,false)     //next,addMoreSample,addMoreIso
    const submitAddSample = async () => await onNextSubmit(false, true, false)
    const submitAddIso = async () => await onNextSubmit(false,false,true)
    const onSave = async () => await dispatch(saveEvent())
    // Next button ,Submit and Add New ISO, Submit and Add New Sample, Save end

    const onInComplete = async () => {
        let res = await Aggregate(
            {
                event: event,
                operation: "INCOMPLETE",
                dataElements: dataElementObjects,
                categoryCombos: categoryCombos,
                dataSets: dataSets,
                orgUnit: orgUnit.id,
                programs: programs
            }
        )
        if(res.response){
            await dispatch( inCompleteEvent() )   
        }
    }

    const editButton = {
        label: 'Edit',
        onClick: onEdit,
        disabled: buttonsDisabled || !status.editable || btnStatus,
        icon: 'edit',
        primary: true,
        tooltip:
            buttonsDisabled || !status.editable
                ? 'Records with this approval status cannot be edited'
                : 'Edit record',
        loading: buttonLoading === 'edit',
    }

    const submitAddButton = {
        label: 'Submit and add new sample',
        onClick: submitAddSample,
        disabled: addSampleValid,
        icon: 'add',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record and add new record for the same person',
        loading: buttonLoading === 'submitAdd',
    }
    
    const submitAddButtonIso = {
        label: 'Submit and add new isolate',
        onClick: submitAddIso,
        disabled: !valid || buttonsDisabled,
        icon: 'add',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record and add new record for the same person',
        loading: buttonLoading === 'submitAdd',
    }

    const submitButton = {
        label: 'Submit',
        onClick: onSave,
        disabled: addSampleValid,
        icon: 'done',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record',
        loading: buttonLoading === 'submit',
    }

    const Save = {
        label: 'Save',
        onClick: onSave,
        disabled: !entityValid,
        icon: 'done',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record',
        loading: buttonLoading === 'save',
    }

    const nextButton = {
        label: 'Next',
        onClick: onNext,
        disabled: buttonsDisabled || !!invalid,
        icon: 'arrow_forward',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Next record',
        loading: buttonLoading === 'next',
    }

    const completeButton = {
        label: 'Complete',
        onClick: submitExit,
        disabled: buttonsDisabled || !!invalid,
        icon: 'done',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Complete Event',
        loading: buttonLoading === 'complete',
    }

    const incompleteButton = {
        label: 'Incomplete',
        onClick: onInComplete,
        disabled: buttonsDisabled || !status.editable || btnStatus,
        icon: 'edit',
        primary: true,
        tooltip:
            buttonsDisabled || !status.editable
                ? 'Records with this approval status cannot be edited'
                : 'Edit record',
        loading: buttonLoading === 'incomplete',
    }

    const Go_Back = {
        label: 'Back',
        primary: true,
        tooltip: "Go Back",
        onClick: onBack,
    }

    const buttons = () =>
        existingEvent && !pageFirst ? !eventId ? [] : status.completed ? [incompleteButton, editButton,Go_Back] : [completeButton, Save, Go_Back]
            : removeButtton ? [nextButton,Go_Back] : prevValues ? isCompleteClicked ? [incompleteButton, submitAddButtonIso, Go_Back] : [completeButton, submitAddButtonIso, Go_Back]:[submitButton,submitAddButton,Go_Back]
    return <StyledButtonRow buttons={buttons()} />
}
