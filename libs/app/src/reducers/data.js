import { ERROR } from 'constants/statuses'
import { REQUIRED_EMPTY } from 'constants/invalidReasons'
import { ORGANISM_ELEMENT, SAMPLE_TESTING_PROGRAM } from 'constants/dhis2'
import {
    SET_ENTITY,
    SET_ENTITY_VALUE,
    SET_UNIQUE,
    SET_ENTITY_MODAL_AND_UNIQUES,
    SET_MODAL_LOADING,
    SET_EDITING,
    SET_PANEL,
    SET_PANEL_VALUE,
    RESET_PANEL,
    RESET_DATA,
    EXISTING_DATA_RECEIVED,
    EXISTING_DATA_ERRORED,
    NEW_EVENT_ERRORED,
    DISABLE_BUTTONS,
    ENABLE_BUTTONS,
    RESET_PANEL_EVENT,
    SET_INCOMPLETED,
    SET_COMPLETED,
    SET_DELETE_PROMPT,
    SET_ENTITY_AND_ORG_UNIT,
    SET_EVENT_VALUE,
    SET_EVENT_AND_ENTITY,
    SET_EVENT_VALUES_AND_PROGRAMSTAGE,
    DUPLICACY,
    EXIT,
    SET_BUTTON_LOADING,
    SET_PREVIOUS_ENTITY,
    RESET_PREVIOUS_ENTITY,
    ADD_ENTITY,
    PANEL_EDITABLE,
    EXISTING_TEI_DATA_RECEIVED,
    REMOVE_BUTTONS,
    SET_PREVIOUS_EVENT,
    SET_EVENT,
    // SET_PREVALUE
    PAGE_FIRST,
    COMPLETED_CLICKED,
    RESET_SAMPLE_PANEL_EVENT,
    AGGREGATION_ON_PROGRESS, //This is a reducer to disable buttons when aggregation is on progress.
    MARKED_FOLLOW,
} from '../actions/types'

const INITIAL_EVENT = {
    values: null,
    programStage: null,
    status: {},
    id: null,
    rules: null,
    duplicate: false,
    invalid: REQUIRED_EMPTY,
}

const INITIAL_STATE = {
    previousValues: {},
    btnStatus:false,
    editable: false,
    pageFirst:false,
    removebtn: false,
    eventEditable: false,
    eventList:[],
    exit: false,
    entity: {
        values: null,
        id: null,
        attributes: null,
        uniques: [],
        valid: false,
    },
    panel: {
        program: '',
        programStage: '',
        organism: '',
        sampleDate: '',
        defaultProgram: SAMPLE_TESTING_PROGRAM,
        valid: false,
    },
    event: INITIAL_EVENT,
    buttonLoading: false,
    completeClicked: false,
    inCompleteClicked:false,
    aggregationOnProgress: false,
    inCompleteClicked: false,
    followup:{},
}

export const data = (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
         case SET_PREVIOUS_ENTITY: 
        return {
            ...state,
            previousValues: payload.entity
        }
        // case SET_PREVALUE:
        //     return {
        //         ...state,
        //         preValues: payload
        //     }
            case RESET_PREVIOUS_ENTITY:
                return {
                    ...state,
                    previousValues: {}
                }
        case ADD_ENTITY:
            return {
                ...state,
                entity: payload.previousValues
            }
            case SET_ENTITY:
            return {
                ...state,
                entity: {
                    values: payload.values,
                    id: payload.id,
                    valid: payload.valid,
                    attributes: payload.attributes,
                    uniques: payload.uniques,
                    modal: null,
                },
            }
            case SET_ENTITY_VALUE:
                return {
                    ...state,
                    entity: {
                        ...state.entity,
                        values: payload.values,
                        attributes: payload.attributes,
                        valid: payload.valid,
                    },
                }
        case SET_UNIQUE:
            return {
                ...state,
                entity: {
                    ...state.entity,
                    uniques: {
                        ...state.entity.uniques,
                        [payload.key]: payload.value,
                    },
                },
            }
        case SET_ENTITY_MODAL_AND_UNIQUES:
            return {
                ...state,
                entity: {
                    ...state.entity,
                    modal: payload.modal,
                    uniques: payload.uniques,
                },
            }
        case SET_MODAL_LOADING:
            return {
                ...state,
                entity: {
                    ...state.entity,
                    modal: {
                        ...state.entity.modal,
                        loading: payload,
                    },
                },
            }
            case SET_EDITING:
            return {
                ...state,
                entity: {
                    ...state.entity,
                    editing: true,
                },
            }
        case SET_PANEL:
            return {
                ...state,
                panel: {
                    ...state.panel,
                    program: payload.program,
                    programStage: payload.programStage,
                    organism: payload.organism,
                    sampleDate: payload.sampleDate,
                    organisms: payload.organisms,
                    valid: payload.valid,
                },
            }
        case SET_PANEL_VALUE:
            return {
                ...state,
                panel: {
                    ...state.panel,
                    [payload.key]: payload.value,
                    valid: payload.valid,
                },
            }
        case RESET_PANEL:
            return {
                ...state,
                event: INITIAL_EVENT,
                panel: {
                    ...state.panel,
                    program: '',
                    programStage: '',
                    organism: '',
                    sampleDate: '',
                    valid: false,
                    completeClicked:false,
                },
            }
        
            case PAGE_FIRST: {
                return {
                    ...state,
                    pageFirst:payload
                }
            }
        case SET_ENTITY_AND_ORG_UNIT: {
            return {
                ...state,
                pageFirst:true,
                entity: {
                    values: payload.values,
                    id: payload.id,
                    valid: payload.valid,
                    attributes: payload.attributes,
                    uniques: {},
                    modal: null,
                },
                panel: {
                    ...state.panel,
                    programs: payload.programs,
                },
                orgUnit: payload.orgUnit,
            }
        }
        case RESET_DATA:
            return {
                ...state,
                pageFirst:false,
                editable: false,
                eventEditable: false,
                eventList:[],
                exit: false,
                entity: {
                    values: null,
                    id: null,
                    attributes: null,
                    uniques: [],
                    valid: false,
                },
                panel: {
                    program: '',
                    programStage: '',
                    organism: '',
                    sampleDate: '',
                    defaultProgram: SAMPLE_TESTING_PROGRAM,
                    valid: false,
                },
                event: INITIAL_EVENT,
                buttonLoading: false,
            }
         case PANEL_EDITABLE:
            return {
                ...state,
                editable: true,
            }
            case EXISTING_TEI_DATA_RECEIVED:
            return {
                ...state,
                btnStatus: payload.btnStatus, 
                eventEditable: payload.editable,
                eventList: payload.eventList,
                entity: {
                    values: payload.entityValues,
                    id: payload.TeiID,
                    attributes: payload.entityAttributes,
                    uniques: {},
                    valid: true,
                    modal: null,
                },
                orgUnit: payload.orgUnit,
            }
        case EXISTING_DATA_RECEIVED:
            return {
                ...state,
                btnStatus: payload.btnStatus, 
                eventEditable: payload.editable,
                eventList: payload.eventList,
                entity: {
                    values: payload.entityValues,
                    id: payload.entityId,
                    attributes: payload.entityAttributes,
                    uniques: {},
                    valid: true,
                    modal: null,
                },
                panel: {
                    ...state.panel,
                    program: payload.program,
                    programStage: payload.programStage.id,
                    organism: payload.eventValues[ORGANISM_ELEMENT],
                    sampleDate: payload.sampleDate,
                    programs: payload.programs,
                    organisms: payload.organisms,
                    valid: true,
                },
                event: {
                    values: payload.eventValues,
                    programStage: payload.programStage,
                    status: payload.status,
                    id: payload.eventId,
                    rules: payload.rules,
                    duplicate: false,
                    invalid: payload.invalid,
                },
                orgUnit: payload.orgUnit,
                previousValues: {},
                pageFirst:false
            }
        case EXISTING_DATA_ERRORED:
        case NEW_EVENT_ERRORED:
            return {
                ...state,
                status: ERROR,
            }
        case DISABLE_BUTTONS:
            return {
                ...state,
                buttonsDisabled: true,
            }
        case ENABLE_BUTTONS:
            return {
                ...state,
                buttonsDisabled: false,
            }
       case REMOVE_BUTTONS:
                return {
                    ...state,
                    removebtn: payload,
            }
        case COMPLETED_CLICKED:
            return {
                ...state,
                completeClicked:payload,
            }
        case MARKED_FOLLOW:
            return {
                ...state,
                followup:payload.existingFollow?payload.existingFollow:{},
        }
        case SET_EVENT:
                    return {
                        ...state,
                        event: payload
                    }
        case SET_PREVIOUS_EVENT: 
                return {
                    ...state,
                    previousValues: payload.eventValues
                }
        

        case RESET_PANEL_EVENT:
            return {
                ...state,
                panel: {
                    ...state.panel,
                    program: '',
                    programStage: '',
                    organism: '',
                    valid: false,
                },
                event: INITIAL_EVENT,
                buttonsDisabled: false,
                completeClicked:false,
            }
        case RESET_SAMPLE_PANEL_EVENT:
            return {
                ...state,
                panel: {
                    ...state.panel,
                    program: '',
                    programStage: '',
                    organism: '',
                    sampleDate:'',
                    valid: false,
                },
                event: INITIAL_EVENT,
                buttonsDisabled: false,
            }
        case SET_INCOMPLETED:
            return {
                ...state,
                event: {
                    ...state.event,
                    status: {
                        ...state.event.status,
                        completed: false,
                    },
                },
                buttonsDisabled: false,
            }
        case SET_COMPLETED:
            return {
                ...state,
                event: {
                    ...state.event,
                    status: {
                        ...state.event.status,
                        completed: true,
                    },
                },
            }
        case SET_DELETE_PROMPT:
            return {
                ...state,
                deletePrompt: payload,
            }
        case SET_EVENT_VALUE:
            return {
                ...state,
                event: {
                    ...state.event,
                    values: {
                        ...state.event.values,
                        [payload.key]: payload.value,
                    },
                },
            }
        case SET_EVENT_AND_ENTITY:
            return {
                ...state,
                entity: {
                    ...state.entity,
                    id: payload.entityId,
                },
                event: {
                    ...state.event,
                    id: payload.eventId,
                    programStage: payload.programStage,
                    rules: payload.rules,
                    status: payload.status,
                    values: payload.values,
                    invalid: payload.invalid,
                },
            }
        case SET_EVENT_VALUES_AND_PROGRAMSTAGE:
            return {
                ...state,
                event: {
                    ...state.event,
                    programStage: payload.programStage,
                    values: payload.values,
                    invalid: payload.invalid,
                },
            }
        case DUPLICACY:
            return {
                ...state,
                event: {
                    ...state.event,
                    duplicate: payload,
                },
            }
        case EXIT:
            return {
                ...state,
                exit: true,
            }
        case SET_BUTTON_LOADING:
            return {
                ...state,
                buttonLoading: payload,
            }
        case AGGREGATION_ON_PROGRESS:
            return{
                ...state,
                aggregationOnProgress: payload,
            }
        default:
            return state
    }
}
