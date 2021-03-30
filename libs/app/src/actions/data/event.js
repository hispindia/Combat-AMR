import { batch } from 'react-redux'
import { createAction } from '../createAction'
import {
    SET_ENTITY_AND_ORG_UNIT,
    RESET_DATA,
    EXISTING_DATA_RECEIVED,
    EXISTING_DATA_ERRORED,
    NEW_EVENT_ERRORED,
    SET_PANEL,
    DISABLE_BUTTONS,
    RESET_PANEL_EVENT,
    SET_INCOMPLETED,
    SET_COMPLETED,
    SET_DELETE_PROMPT,
    SET_EVENT_AND_ENTITY,
    SET_EVENT_VALUES_AND_PROGRAMSTAGE,
    DUPLICACY,
    ENABLE_BUTTONS,
    EXIT,
    PANEL_EDITABLE,
    SET_BUTTON_LOADING,
    EXISTING_TEI_DATA_RECEIVED,
    REMOVE_BUTTONS,
    SET_PREVIOUS_EVENT,
    SET_EVENT,
    PAGE_FIRST
} from '../types'
import { deleteEvent } from '@hisp-amr/api'

import {
    existingRecord,
    newRecord,
    setEventStatus,
    updateEventValue,
    isDuplicateRecord,
    existingRecordTei
} from 'api'
import { entityRules, eventRules, getRules } from 'helpers'
import { DUPLICATE_CHECKING } from 'constants/duplicacy'
import { LOADING, SUCCESS } from 'constants/statuses'
import { SAMPLE_ID_ELEMENT, ORGANISM_SET , ORGANISM_DETECTED, SAMPLE_TESTING_PROGRAM} from 'constants/dhis2'
import { showAlert } from '../alert'  
export const resetData = () => dispatch => dispatch(createAction(RESET_DATA))
export const disableButtons = () => dispatch =>dispatch(createAction(DISABLE_BUTTONS))
export const enableButtons = () => dispatch =>dispatch(createAction(ENABLE_BUTTONS))
export const AddAndSubmit = val => dispatch =>dispatch(createAction(REMOVE_BUTTONS, val))
export const setButtonLoading = payload => dispatch =>dispatch(createAction(SET_BUTTONS, payload))
export const addExistingEvent = payload => dispatch =>dispatch(createAction(SET_EVENT, payload))
// export const PreValue = payload => dispatch=> dispatch(createAction(SET_PREVALUE, payload))
export const initNewEvent = orgUnit => (dispatch, getState) => {
    const entityMetadata = getState().metadata.person
    const optionSets = getState().metadata.optionSets
    const orgUnits = getState().metadata.orgUnits
    const programs = getState().metadata.programList.filter(p =>
        p.orgUnits.includes(orgUnit)
    )
    const [values, attributes] = entityRules(
        entityMetadata.values,
        entityMetadata.trackedEntityTypeAttributes,
        {
            rules: entityMetadata.rules,
            optionSets,
            uniques: {},
        }
    )
    orgUnit = { id: orgUnit, code: getCode(orgUnit, orgUnits) }
    dispatch(
        createAction(SET_ENTITY_AND_ORG_UNIT, {
            values,
            id: null,
            valid: false,
            attributes,
            orgUnit,
            programs,
        })
    )
}

const getCode = (orgUnit, orgUnits) => {
    for (const ou of orgUnits) {
        if (ou.id === orgUnit) return ou.code
        if (ou.children) {
            const code = getCode(orgUnit, ou.children)
            if (code) return code
        }
    }
}
export const getExistingEvent = (orgUnit, tieId, eventId, editStatus, btnStatus) => async (
    dispatch,
    getState
) => {
    const state = getState()
    const programs = state.metadata.programs
    const optionSets = state.metadata.optionSets
    const { trackedEntityTypeAttributes, rules } = state.metadata.person
    try {
        const data = await existingRecord(programs, orgUnit, tieId, eventId)
        const [entityValues, attributes] = entityRules(
            { ...state.metadata.person.values, ...data.entityValues },
            trackedEntityTypeAttributes,
            {
                rules,
                optionSets,
                uniques: [],
            }
        )
        data.TeiID = tieId;
        data.btnStatus=btnStatus;
        data.editable = editStatus;
        if(data.eventList.length==0){
            data.entityValues = entityValues
            data.entityAttributes = attributes
            data.orgUnit = {
                id: orgUnit,
                code: getCode(orgUnit, state.metadata.orgUnits),
            }
            data.programs = state.metadata.programList
            data.organisms = optionSets[ORGANISM_SET]
            //  data.invalid = false
            dispatch(createAction(EXISTING_TEI_DATA_RECEIVED, data))
        } else{
            data.eventRules = getRules(
                state.metadata.eventRules,
                data.program,
                data.programStage.id
            )
            state.metadata.calculatedVariables.forEach(variables => {
                for (let key in data.eventValues)
                    if ((key != variables.id) && data.program == variables.program) data.eventValues[variables.id] = "";
            })
            const tempSTATUS = "ACTIVE";
            const [eventValues, programStage, invalid] = eventRules(
                data.eventValues,
                data.programStage,
                {
                    rules: data.eventRules,
                    optionSets,
                    pushChanges: !data.status.completed,
                    updateValue: (key, value) =>
                    updateEventValue(data.eventId, key, value,data.program,orgUnit,tieId,tempSTATUS,data.programStage.id),
                }
            )
            data.entityValues = entityValues
            data.entityAttributes = attributes
            data.eventValues = eventValues
            data.programStage = programStage
            data.orgUnit = {
                id: orgUnit,
                code: getCode(orgUnit, state.metadata.orgUnits),
            }
            data.programs = state.metadata.programList
            data.organisms = optionSets[ORGANISM_SET]
            data.invalid = invalid
            data.rules = getRules(
                state.metadata.eventRules,
                data.program,
                data.programStage.id
            )
        dispatch(createAction(EXISTING_DATA_RECEIVED, data))
        } 
    } catch (error) {
        console.error(error)
        dispatch(showAlert('Failed to get record.', { critical: true }))
        dispatch(createAction(EXISTING_DATA_ERRORED))
    }
}
export const createNewEvent = () => async (dispatch, getState) => {
    dispatch(disableButtons)
    const orgUnit = getState().data.orgUnit
    const entity = getState().data.entity
    const panel = getState().data.panel
    const metadata = getState().metadata
    const prevStateValues = getState().data.previousValues

    var values_to_send = []
    var UpdatedEventPayload = {}
    if (Object.keys(prevStateValues).length != 0) {
        console.log("GETDATA", getState().data)        
        Object.keys(prevStateValues).forEach(function (previouskey) {
            if (prevStateValues[previouskey] != "") {
                if (prevStateValues[previouskey] != "Detected") {
                    values_to_send.push({
                        dataElement: previouskey,
                        value: prevStateValues[previouskey]
                    })
                }
            }
    
        });
        UpdatedEventPayload = {
            dataValues: values_to_send,
            program: panel.program,
            orgUnit: getState().data.orgUnit.id
        }
        // const eveRes = postEvent(UpdatedEventPayload)
        console.log("EVENTS POST SUCCESS", UpdatedEventPayload)

    }


    const rules = getRules(
        metadata.eventRules,
        panel.program,
        panel.programStage
    )

    try {
        const data = await newRecord(
            panel.program,
            metadata.programs
                .find(p => p.id === panel.program)
                .programStages.find(s => s.id === panel.programStage),
            {
                orgaCode: panel.organism,
                ou: orgUnit.id,
                eId: entity.id,
                eValues: !entity.id || entity.editing ? entity.values : null,
                sampleDate: panel.sampleDate,
                orgUnitCode: orgUnit.code,
            },
            UpdatedEventPayload,
        )
        metadata.calculatedVariables.forEach(variables => {
            for (let key in data.eventValues)
                if ((key != variables.id) && panel.program == variables.program) data.eventValues[variables.id] = "";
        })
        const tempNEWStatus = "ACTIVE"
        const [values, programStage, invalid] = eventRules(
            data.eventValues,
            data.programStage,
            {
                rules,
                optionSets: metadata.optionSets,
                pushChanges: !data.status.completed,
                updateValue: (name, value) =>
                updateEventValue(data.eventId, name, value,orgUnit,entity.id,tempNEWStatus,panel.programStage.id),
            }
        )
        dispatch(
            createAction(SET_EVENT_AND_ENTITY, {
                values,
                eventId: data.eventId,
                programStage,
                status: data.status,
                rules,
                entityId: entity.id ? entity.id : data.entityId,
                invalid,
            })
        )
    } catch (error) {
        console.error(error)
        dispatch(showAlert('Failed to create record.', { critical: true }))
        dispatch(createAction(NEW_EVENT_ERRORED))
    }
}

export const submitEvent = addMore => async (dispatch, getState) => {
    batch(() => {
        dispatch(disableButtons())
        dispatch(
            createAction(SET_BUTTON_LOADING, addMore ? 'submitAdd' : 'submit')
        )
    })
    const eventId = getState().data.event.id;    
    const eventValues = getState().data.event.values;

    try {
        
        await setEventStatus(eventId, true)
        if (addMore) dispatch(createAction(RESET_PANEL_EVENT))
        else {
            if (eventValues[ORGANISM_DETECTED] == "Detected") {
                dispatch(createAction(SET_PREVIOUS_EVENT, { eventValues }))
                dispatch(AddAndSubmit(false))                
                dispatch(createAction(PANEL_EDITABLE))
                dispatch(createAction(RESET_PANEL_EVENT))
                dispatch(createAction(PAGE_FIRST, true))
            } else {
                dispatch(createAction(EXIT))
            }
        }
        dispatch(createAction(SET_COMPLETED))

        dispatch(showAlert('Submitted successfully.', { success: true }))
    } catch (error) {
        console.error(error)
        dispatch(showAlert('Failed to submit.', { critical: true }))
        dispatch(createAction(ENABLE_BUTTONS))
    } finally {
        batch(() => {
            dispatch(enableButtons())
            dispatch(createAction(SET_BUTTON_LOADING, false))
        })
    }
}

export const editEvent = () => async (dispatch, getState) => {
    batch(() => {
        dispatch(disableButtons())
        dispatch(createAction(SET_BUTTON_LOADING, 'edit'))
    })
    const eventId = getState().data.event.id

    try {
        await setEventStatus(eventId)
        dispatch(createAction(SET_INCOMPLETED))
        dispatch(showAlert('Record is editable.'))
    } catch (error) {
        console.error(error)
        dispatch(showAlert('Failed to edit record.', { critical: true }))
    } finally {
        batch(() => {
            dispatch(createAction(SET_BUTTON_LOADING, false))
            dispatch(enableButtons())
        })
    }
}

export const setDeletePrompt = deletePrompt => dispatch =>
    dispatch(createAction(SET_DELETE_PROMPT, deletePrompt))

export const onDeleteConfirmed = (confirmed, secondaryAction) => async (
    dispatch,
    getState
) => {
    if (!confirmed) {
        dispatch(setDeletePrompt(false))
        return
    }

    dispatch(setDeletePrompt(LOADING))

    const eventId = getState().data.event.id

    try {
        if (secondaryAction) await secondaryAction()
        const response = (await deleteEvent(eventId)).response
        if (response.importCount.deleted !== 1) throw response.description
        dispatch(showAlert('Deleted successfully.', {}))
        dispatch(setDeletePrompt(SUCCESS))
    } catch (error) {
        console.error(error)
        dispatch(showAlert('Failed to delete.', { critical: true }))
        dispatch(setDeletePrompt(true))
    }
}

export const setEventValue = (key, value,isPrev) => (dispatch, getState) => {
    const event = getState().data.event
    if (event.values[key] === value) return
    const optionSets = getState().metadata.optionSets
    const programId = getState().data.panel.program;
    const orgUnit = getState().data.orgUnit.id;
    const trackerID = getState().data.entity;
    const tempProgramStage = getState().data.panel.programStage;
    const tempStatus = "ACTIVE";
    console.log("ORG UNITS",getState())
    var dID = ["mp5MeJ2dFQz", "dRKIjwIDab4", "GpAu5HjWAEz", "B7XuDaXPv10"];
    if (isPrev != true) {
        updateEventValue(event.id, key, value, programId,orgUnit,trackerID,tempStatus,tempProgramStage)
    }
    else if (isPrev == true) {
    if (!dID.includes(key)) {
        updateEventValue(event.id, key, value, programId,orgUnit,trackerID,tempStatus,tempProgramStage)
    }
    }
    
    if (key === SAMPLE_ID_ELEMENT && programId == SAMPLE_TESTING_PROGRAM["0"].value) dispatch(checkDuplicacy(value))

    const [values, programStage, invalid] = eventRules(
        { ...event.values, [key]: value },
        event.programStage,
        {
            rules: event.rules,
            optionSets,
            pushChanges: !event.status.completed,
            updateValue: (key, value) => updateEventValue(event.id, key, value,programId,orgUnit,trackerID,tempStatus,tempProgramStage),
        }
    )

    dispatch(
        createAction(SET_EVENT_VALUES_AND_PROGRAMSTAGE, {
            programStage,
            values,
            invalid,
        })
    )
}

export const checkDuplicacy = sampleId => async (dispatch, getState) => {
    dispatch(createAction(DUPLICACY, DUPLICATE_CHECKING))
    const event = getState().data.event.id
    const entity = getState().data.entity.id
    const organism = getState().data.panel.organism
    const duplicate = await isDuplicateRecord({
        event,
        entity,
        organism,
        sampleId,
    })
    dispatch(createAction(DUPLICACY, duplicate))
}
