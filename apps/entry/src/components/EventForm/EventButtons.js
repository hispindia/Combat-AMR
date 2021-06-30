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
    setAggregationProgress
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
    var aggregationOnProgress = useSelector(state => state.data.aggregationOnProgress)
    var { program } = useSelector(state => state.data.panel);
    var programCheck = program == "WhYipXYg2Nh" ? false : true;
    var userAccess = false;
    programs.forEach(p => {
        p.programStages.forEach(ps => {
            userAccess = ps.access.data.write
        })
    })

    const changeAggregationStatus = (status)=>{

        dispatch(setAggregationProgress(status))
        aggregationOnProgress = status
    }

    const onBack = () => {
        if (!prevValues && editable) {
            $("#popup").hide();
         }
        else {
            history.goBack();
            setTimeout(function(){window.location.reload();}, 100);
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
            programs: programs,
            sampleDate: sampleDate,
            changeStatus : changeAggregationStatus
        })
        if(res.response){
            await dispatch(submitEvent(addMore))
        }
        changeAggregationStatus(false);
    }
    const submitExit = async () => await onSubmit(false)
    const onEdit = async () => {
        let res = await Aggregate({
            event:event,
            operation:"INCOMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            sampleDate: sampleDate,
            orgUnit: orgUnit.id,
            programs: programs,
            changeStatus : changeAggregationStatus
        })

        if(res.response){
            await dispatch(editEvent())
        }
        changeAggregationStatus(false);
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
                sampleDate: sampleDate,
                orgUnit: orgUnit.id,
                programs: programs,
                changeStatus : changeAggregationStatus
            }
        )
        if(res.response){
            await dispatch( inCompleteEvent() )
        }
        changeAggregationStatus(false);
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
        disabled: !valid || buttonsDisabled || aggregationOnProgress,
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
        disabled: addSampleValid || aggregationOnProgress,
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
        disabled: !entityValid || aggregationOnProgress,
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
        label: 'Marked Complete',
        onClick: submitExit,
        disabled: buttonsDisabled || !!invalid || aggregationOnProgress,
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
        label: 'Marked Incomplete',
        onClick: onInComplete,
        disabled: buttonsDisabled || !status.editable || btnStatus || aggregationOnProgress,
        icon: 'edit',
        primary: true,
        tooltip:
            buttonsDisabled || !status.editable
                ? 'Records with this approval status cannot be edited'
                : 'Edit record',
        loading: buttonLoading === 'incomplete',
    }

    const editButton = {
        label: 'Edit',
        onClick: onEdit,
        disabled: buttonsDisabled || !status.editable || btnStatus || aggregationOnProgress,
        icon: 'edit',
        primary: true,
        tooltip:
            buttonsDisabled || !status.editable
                ? 'Records with this approval status cannot be edited'
                : 'Edit record',
        loading: buttonLoading === 'edit',
    }

    const Go_Back = {
        label: 'Back',
        primary: true,
        tooltip: "Go Back",
        onClick: onBack,
    }

    const Go_BackIso = {
        label: 'Back',
        primary: true,
        tooltip: "Go Back",
        onClick: onBack,
        disabled: !valid || buttonsDisabled,
    }
    const buttons = () =>
        existingEvent && !pageFirst ? !eventId ? [] : status.completed ? [incompleteButton, editButton,Go_Back] : programCheck ? [completeButton, Save, Go_Back] : [Save, Go_Back]
            : removeButtton ? [nextButton,Go_Back] : prevValues ? isCompleteClicked ? [incompleteButton, submitAddButtonIso, Go_BackIso] : [completeButton, submitAddButtonIso, Go_BackIso]:[submitButton,submitAddButton,Go_Back]

    const buttonsReadUsers = () =>
        [Go_Back]
    return <StyledButtonRow buttons={userAccess ? buttons() : buttonsReadUsers()} />
}
