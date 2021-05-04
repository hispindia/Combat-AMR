import { createAction } from '../createAction'
import { SET_PANEL, SET_PANEL_VALUE, RESET_PANEL,PANEL_EDITABLE } from '../types'
// export const panelEditable = () => dispatch => dispatch(createAction("Editable"))
export const panelEditable = () => dispatch => dispatch(createAction(PANEL_EDITABLE))
export const setPanel = () =>async(dispatch,getState) =>{
    dispatch(createAction(RESET_PANEL_EVENT))
}
export const setProgram = program => (dispatch, getState) => {
    const { programOrganisms, optionSets, stageLists, dataElements } = getState().metadata
    const { sampleDate } = getState().data.panel
    const organisms = [];
    var programStage = "";
    if (program) {
        optionSets[programOrganisms[program]].forEach(o => {
            if (!organisms.find(org => org.value === o.value)) organisms.push(o);
        });
    
        programStage =
            stageLists[program].length > 1 ? '' : stageLists[program][0].value
    }
    dispatch(
        createAction(SET_PANEL, {
            program,
            programStage,
            organism: '',
            sampleDate: sampleDate,
            organisms,
            valid: false,
        })
    )
}

export const setPanelValue = (key, value) => (dispatch, getState) => {
    const {
        program,
        programStage,
        organism,
        organisms,
        sampleDate,
    } = getState().data.panel
    const values = { program, programStage, sampleDate }
    if (values[key] === value) return
    const valid = !Object.values({ ...values, [key]: value }).includes('')
    dispatch(
        createAction(SET_PANEL_VALUE, {
            key,
            value,
            valid,
        })
    )
}

export const resetPanel = () => dispatch => dispatch(createAction(RESET_PANEL))
