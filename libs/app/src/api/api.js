import { get, post, del, put, request, postEvent } from '@hisp-amr/api'
import { getRecord } from './getRecord'
import { getAllEvents, getPersonVal } from './getAllEvents'
import {
    ORGANISM_ELEMENT,
    SAMPLE_ID_ELEMENT,
    AMR_ELEMENT,
    PERSON_TYPE,
    L1_APPROVAL_STATUS,
    L1_REVISION_REASON,
    L2_APPROVAL_STATUS,
    L2_REVISION_REASON,
} from 'constants/dhis2'
import { getProgramStage, generateAmrId, setEventValues } from './helpers'
import * as DUPLICACY from 'constants/duplicacy'
import axios from "axios";
const syncRequest = require('sync-request');


/**
 * Checks if any tracked entity instance has property with value.
 * @param {string} property - Property.
 * @param {string} value - Value.
 * @returns {boolean} - False if unique, tracked entity instance ID otherwise.
 */
export const checkUnique = async (property, value, ou) => {
    const entities = (
        await get(
            request('trackedEntityInstances', {
                fields: 'trackedEntityInstance',
                filters: `${property}:eq:${value}`,
                options: [`ou=${ou}`, `trackedEntityType=${PERSON_TYPE}`],
            })
        )
    ).trackedEntityInstances
    return !entities
        ? false
        : entities.length > 0
        ? entities[0].trackedEntityInstance
        : false
}

/**
 * Gets tracked entity instance values.
 * @param {string} entityId - Tracked entity instance ID.
 * @returns {Object} Values.
 */
export const getPersonValues = async entityId => {
    const attributes = (
        await get(
            request(`trackedEntityInstances/${entityId}`, {
                fields:
                    'attributes[code,displayName,valueType,attribute,value]',
                options: ['ouMode=ALL'],
            })
        )
    ).attributes

    if (!attributes) return null

    const values = {}
    attributes.forEach(a => (values[a.attribute] = a.value))
    return values
}
/**
 * Adds a new person..
 * @param {Object} values - Values
 * @returns {string} Tracked entity instance ID.
 */
export const addPerson = async (values, orgUnit) => {
    const data = {
        trackedEntityType: PERSON_TYPE,
        orgUnit: orgUnit,
        attributes: [],
    }
    for (const key in values)
        data.attributes.push({ attribute: key, value: values[key] })

    return (await (await post('trackedEntityInstances', data)).json()).response
        .importSummaries[0].reference
}

/**
 * Updates a person.
 * @param {string} id - Tracked entity instance id.
 * @param {Object} values - Values.
 */
export const updatePerson = async (id, values) => {
    const url = `trackedEntityInstances/${id}`
    const data = await get(url)
    data.attributes = []
    for (const key in values)
        data.attributes.push({ attribute: key, value: values[key] })

    await put(url, data)
}

/**
 * Deletes a tracked entity instance.
 * @param {string} id - Tracked entity instance.
 */
export const deletePerson = async id =>
    await del(`trackedEntityInstances/${id}`)

export const newRecord = async (
    pId,
    pStage,
    { orgaCode, ou, eId, eValues, sampleDate, orgUnitCode },UpdatedEventPayload
) => {
    const initialValues = {
        [ORGANISM_ELEMENT]: orgaCode,
        // [AMR_ELEMENT]: await generateAmrId(ou, orgUnitCode),
    }
    const { entityId, eventId } = eId
        ? await addEvent(initialValues, pId, {
              programStageId: pStage.id,
              orgUnitId: ou,
              entityId: eId,
              entityValues: eValues,
            sampleDate,
        },
        UpdatedEventPayload
        )
        : await addPersonWithEvent(initialValues, pId, {
              programStageId: pStage.id,
              orgUnitId: ou,
              entityValues: eValues,
              sampleDate,
          })

    const { programStage, eventValues, status } = await getProgramStage(
        pStage,
        initialValues,
        { completed: false }
    )
    return { programStage, eventValues, status, eventId, entityId }
}

export const existingRecord = async (programs, ou, teiId, evId) => {
    const allEvents = await getAllEvents(ou, teiId)
    var eventList = allEvents.events;
    if(evId === undefined) {
        if(allEvents.events.length >0){
            var eventId = allEvents.events[0].event
            var record = await getRecord(programs, eventId)
        }
    } else {
        var record = await getRecord(programs, evId)
    }
    if(teiId != undefined) {
        var entityValues = await getPersonValues(teiId)
    }
    return {
        eventList,
        ...record,
        entityValues,
    
    }
}
export const addPersonWithEvent = async (
    eventValues,
    programId,
    { programStageId, orgUnitId, entityValues, sampleDate }
) => {
    const event = await setEventValues(
        {
            dataValues: [],
            eventDate: sampleDate,
            orgUnit: orgUnitId,
            program: programId,
            programStage: programStageId,
            status: 'ACTIVE',
        },
        eventValues,
        {}
    )

    const data = {
        trackedEntityType: PERSON_TYPE,
        orgUnit: event.orgUnit,
        attributes: Object.keys(entityValues).map(key => {
            return { attribute: key, value: entityValues[key] }
        }),
        enrollments: [
            {
                orgUnit: event.orgUnit,
                program: event.program,
                enrollmentDate: sampleDate,
                incidentDate: sampleDate,
                events: [event],
            },
        ],
    }

    // for 2.34

    const newTeiPayLoad = {
        trackedEntityType: PERSON_TYPE,
        orgUnit: event.orgUnit,
        program: event.program,
        attributes: Object.keys(entityValues).map(key => {
            return { attribute: key, value: entityValues[key] }
        }),
    }

    const teiResponse = await post('trackedEntityInstances', newTeiPayLoad)

    const newEnrollmentPayLoad = {
        orgUnit: event.orgUnit,
        status: "ACTIVE",
        trackedEntityInstance: teiResponse.response.importSummaries[0].reference,
        trackedEntityType: PERSON_TYPE,
        program: event.program,
    };

    const enrollmentResponse = await post('enrollments', newEnrollmentPayLoad)
    var enrollRef = "";
    var teiRef = "";
    if (enrollmentResponse.response) {
        enrollRef = enrollmentResponse.response.importSummaries[0].reference;
    }
    if (teiResponse.response) {
        teiRef = teiResponse.response.importSummaries[0].reference;
    }

    const newEventPayLoad = await setEventValues(
        {
            dataValues: [],
            eventDate: sampleDate,
            orgUnit: orgUnitId,
            program: programId,
            programStage: programStageId,
            enrollment: enrollRef,
            trackedEntityInstance: teiRef,
            status: 'ACTIVE',
        },
        eventValues,
        {}
    )

    const eventResponse = await post('events', newEventPayLoad)


    //const r = await post('trackedEntityInstances', data)



    /*
    const tempEvent = await setEventValues(
        {
            dataValues: [],
            eventDate: sampleDate,
            orgUnit: orgUnitId,
            program: programId,
            programStage: programStageId,
            enrollment: "LtcyXpLkXDK"
            status: 'ACTIVE',
        },
        eventValues
    )


    const s = await post('events', data)
*/
    return {
        entityId: teiResponse.response.importSummaries[0].reference,
        eventId:  eventResponse.response.importSummaries[0].reference,
        //eventId:  r.response.importSummaries[0].enrollments.importSummaries[0].reference,
        //entityId: r.response.importSummaries[0].reference,
        // eventId:
        //     r.response.importSummaries[0].enrollments.importSummaries[0].events
        //         .importSummaries[0].reference,
    }
}

/**
 * Adds a new event. Enrolls person if not already enrolled.
 * @param {Object[]} eventValues - Values.
 * @param {string} programId - Program ID.
 * @param {string} programStageId - Program stage ID.
 * @param {string} orgUnitId - Organisation unit ID.
 * @param {string} entityId - Tracked entity instance ID.
 * @param {string} entityValues - Entity values.
 */
export const addEvent = async (
    eventValues,
    programId,
    { programStageId, orgUnitId, entityId, entityValues, sampleDate },UpdatedEventPayload
) => {
    const event = await setEventValues(
        {
            dataValues: [],
            eventDate: sampleDate,
            orgUnit: orgUnitId,
            program: programId,
            programStage: programStageId,
            trackedEntityInstance: entityId,
            status: 'ACTIVE',
        },
        eventValues,
        UpdatedEventPayload
    
    )
    if (entityValues) await updatePerson(entityId, entityValues)
    // Enrolling if not already enrolled.
    let enrollments = []
    enrollments = (
        await get(
            request(`trackedEntityInstances/${entityId}`, {
                fields: 'enrollments[program]',
            })
        )
    ).enrollments
    if (!enrollments.find(enrollment => enrollment.program === programId)) {
        await post('enrollments', {
            trackedEntityInstance: entityId,
            orgUnit: orgUnitId,
            program: programId,
            enrollmentDate: sampleDate,
            incidentDate: sampleDate,
        })
    }
    const eventId = await postEvent(event)
    return {
        entityId,
       eventId,
    }
}

export const setEventStatus = async (eventId, completed) => {
    const url = `events/${eventId}`
    let event = await get(url)
    event.status = completed ? 'COMPLETED' : 'ACTIVE'
    const values = {}
    if (event.dataValues) {
        event.dataValues.forEach(
            dataValue => (values[dataValue.dataElement] = dataValue.value)
        )
    }
    if (values[L1_APPROVAL_STATUS] === 'Resend') {
        values[L1_APPROVAL_STATUS] = ''
        values[L1_REVISION_REASON] = ''
    }
    if (values[L2_APPROVAL_STATUS] === 'Resend') {
        values[L2_APPROVAL_STATUS] = ''
        values[L2_REVISION_REASON] = ''
    }
    event = await setEventValues(event, values,{})
    await put(url, event)
}
export const updateEventValue = async (eventId, dataElementId, value, programID,orgUnit,trackerID,tempStatus,tempProgramStage) => {
    var dataBody = {
        event: eventId,
        program: programID,
        programStage: tempProgramStage,
        orgUnit: orgUnit,
        status: tempStatus,
        trackedEntityInstance:trackerID.id,
        dataValues: [{ dataElement: dataElementId, value: value , providedElsewhere: false}]
    }
    //return await axios.put(`../../../api/events/${eventId}/${dataElementId}`, dataBody);

    // yarn add  sync-request -W
    let postResponse = syncRequest('PUT', `../../../api/events/${eventId}/${dataElementId}`, {
        json: dataBody
    });
    let apiResponse = JSON.parse( postResponse.getBody('utf8'));
}







export const isDuplicateRecord = async ({
    event,
    entity,
    organism,
    sampleId,
}) => {
    let events = (
        await get(
            request('events', {
                order: 'created:asc',
                fields: 'event,dataValues[dataElement,value]',
                filters: `${SAMPLE_ID_ELEMENT}&eq:${sampleId}`,
                options: [`program=WhYipXYg2Nh`],
            })
        )
    ).events

    if (!events) return false
    if (events.length < 1) return false
    if (events[0].event === event) return false
    events = events.filter(e => e.event !== event)
    if (events.length < 1) return false
    return events.find(e =>
        e.dataValues.find(
            dv => dv.dataElement === SAMPLE_ID_ELEMENT && dv.value === sampleId
        )
    )
        ? DUPLICACY.DUPLICATE_ERROR
        : ""
}

export const updateEnrollmentValue = async (followValues) => {
    let enrollmentsList = []
    var followVals = followValues[3];
    var enrollmentID = ""
    var enrollmentBody = ""
    enrollmentsList = 
        await get(
            request('enrollments.json', {
                options: [`ou=${followValues[0]}&trackedEntityInstance=${followValues[1]}&program=${followValues[4]}&paging=false`],
            })
        ).then(function (enrollresult) {
            enrollmentID = enrollresult.enrollments[0].enrollment
            enrollresult.enrollments[0]['followup'] = followVals
            enrollmentBody = enrollresult.enrollments[0]            
            var dataBody = enrollmentBody
            let postResponse = syncRequest('PUT', `../../../api/enrollments/${enrollmentID}`, {
            json: dataBody
            });
            let apiResponse = JSON.parse(postResponse.getBody('utf8'));
        })
    return enrollmentsList
}

