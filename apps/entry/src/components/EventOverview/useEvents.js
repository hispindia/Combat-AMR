import { useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { showAlert,followEvent } from '@hisp-amr/app'
import { getTEI,getSterileTEI } from 'api'
import { GP_PROGRAM_ID } from './constants'
import { createAction } from '@hisp-amr/app/dist/actions/createAction'
import { MARKED_FOLLOW } from '@hisp-amr/app/dist/actions/types'

const INITIAL_STATE = {
    rows: null,
    loading: true,
    addButtonDisabled: true,
    error: false,
}

const NEW_PROGRAMS = 'NEW_PROGRAMS'
const LOADING = 'LOADING'
const NEW_ROWS = 'NEW_ROWS'
const EVENTS_ERRORED = 'EVENTS_ERRORED'

const reducer = (state, action) => {
    switch (action.type) {
        case NEW_PROGRAMS: {
            return {
                ...state,
                addButtonDisabled: action.disable,
            }
        }
        case LOADING: {
            return {
                ...state,
                loading: true,
            }
        }
        case NEW_ROWS: {
            return {
                ...state,
                rows: action.rows,
                loading: false,
            }
        }
        case EVENTS_ERRORED: {
            return {
                ...state,
                rows: action.rows,
                error: true,
            }
        }
        default: {
            return state
        }
    }
}

export const useEvents = (status, eventstatus, code) => {
    var programApi = [];
    const dispatch = useDispatch()
    const categories = useSelector(state => state.appConfig.categories)
    const programList = useSelector(state => state.metadata.programList)
    const user = useSelector(state => state.metadata.user)
    const selected = useSelector(state => state.selectedOrgUnit.id)
    var isFollowUp = useSelector(state => state.data.followup)

    var sampleTestingProgram = programList.find(element => {
        var sampleLable = "Sample testing"
        return element.label ===  sampleLable;
    }).value;

    if (code == "ST")
        programApi = [sampleTestingProgram]
    if (code == "GP")
        programApi = GP_PROGRAM_ID       
    const [state, dispatcher] = useReducer(reducer, INITIAL_STATE)

    useEffect(() => {
        const noProgram = !programList.find(p => p.orgUnits.includes(selected))
        if (noProgram !== state.addButtonDisabled)
            dispatcher({ type: NEW_PROGRAMS, disable: noProgram })
    }, [selected, programList, state.addButtonDisabled,eventstatus])

    useEffect(() => {
        const getData = async () => {
            try {
                if (eventstatus == "COMPLETED" && programApi.length < 2) {
                    const eventsData = await getSterileTEI(selected,programApi,eventstatus).then((eventResult) =>
                    dispatcher({
                    type: NEW_ROWS,
                    rows: eventResult,
                    })
                    )
                }
                else {
                    const events = await getTEI(selected, programApi, eventstatus, isFollowUp).then(({ teiRows, isFollowUp }) => {
                        if (teiRows) {
                            dispatcher({
                                type: NEW_ROWS,
                                rows: teiRows,
                            })
                            dispatch(followEvent(isFollowUp))
                        }
                    }
                    )
                }

            } catch (error) {
                console.error(error)
                dispatcher({ type: EVENTS_ERRORED })
                dispatch(showAlert('Failed to get records', { critical: true }))
            }
        }

        dispatcher({ type: LOADING })
        getData()
    }, [selected, status, categories, dispatch, user.username,eventstatus,code])

    return state
}
