import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
    ButtonRow,
    submitEvent,
    editEvent,
    setDeletePrompt,
    DUPLICATE_ERROR,
    completeEvent,
    inCompleteEvent,
} from '@hisp-amr/app'
import {
    Aggregate
} from '../../api/helpers/aggregate'

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
    const categoryCombos = useSelector(state=> state.metadata.categoryCombos)
    const dataSets = useSelector(state=>state.metadata.dataSets)
    const eventList = useSelector(state=>state.data.eventList)
    const orgUnit = useSelector(state=>state.data.orgUnit)
    const buttonLoading = useSelector(state => state.data.buttonLoading)
    const pageFirst = useSelector(state => state.data.pageFirst)
    const removeButtton = useSelector(state => state.data.removebtn)
    const prevValues = Object.keys(useSelector(state => state.data.previousValues)).length ? true : false;
    const isCompleteClicked = useSelector(state => state.data.completeClicked)

    useEffect(() => {
        if (exit) history.goBack()
    }, [exit, history])

    const onSubmit = async addMore => {
        let res = await Aggregate({
            event:event,
            operation:"COMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            orgUnit: orgUnit,
            eventList: eventList
        })
        if(res){
            await dispatch(submitEvent(addMore))
        }
    }
    const submitExit = async () => await onSubmit(false)    
    const submitAdd = async () => await onSubmit(true)
    const onEdit = async () => {
        let res = await Aggregate({
            event:event,
            operation:"INCOMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            orgUnit: orgUnit,
            eventList: eventList
        })
        if(res){
            await dispatch(editEvent())
        }
    }
    const onComplete = () => dispatch(completeEvent())
    const onInComplete = () => dispatch(inCompleteEvent())

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
        onClick: submitAdd,
        disabled: buttonsDisabled || !!invalid,
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
        onClick: submitExit,
        disabled: buttonsDisabled || !!invalid,
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

    
    const submitAddButtonIso = {
        label: 'Submit and add new isolate',
        onClick: submitAdd,
        disabled: !valid || buttonsDisabled || !!!invalid,
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

    const submitButtonIso = {
        label: 'Submit',
        onClick: submitExit,
        disabled: !valid || buttonsDisabled || !!!invalid,
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

    const nextButton = {
        label: 'Next',
        onClick: submitExit,
        disabled: buttonsDisabled || !!invalid,
        icon: 'arrow_forward',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Next record',
        loading: buttonLoading === 'submit',
    }

    const completeButton = {
        label: 'Complete',
        onClick: onComplete,
        disabled: buttonsDisabled || !!invalid,
        icon: 'done',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Complete Event',
        loading: buttonLoading === 'submit',
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
        loading: buttonLoading === 'edit',
    }

    const buttons = () =>
        existingEvent && !pageFirst ? !eventId ? [] : status.completed ? [incompleteButton, editButton] : [completeButton, submitButton]
            : removeButtton ? [nextButton] : prevValues ? isCompleteClicked ? [incompleteButton, submitAddButtonIso, submitButtonIso] : [completeButton, submitAddButtonIso, submitButtonIso]:[submitAddButton, submitButton]
    return <StyledButtonRow buttons={buttons()} />
}
