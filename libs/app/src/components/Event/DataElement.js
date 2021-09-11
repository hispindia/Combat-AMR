import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { string, object } from 'prop-types'
import { Padding,MaxWidth } from '../Padding'
import { SAMPLE_ID_ELEMENT, ORGANISM_DETECTED, SAMPLE_TESTING_PROGRAM} from 'constants/dhis2'
import {
    TextInput,
    RadioInputs,
    SelectInput,
    SwitchInput,
    DateInput,
} from '@hisp-amr/inputs'
import { setEventValue, AddAndSubmit } from 'actions'
import TextField from '@material-ui/core/TextField';

import * as DUPLICACY from 'constants/duplicacy'
export const DataElement = ({ id }) => {
    const dispatch = useDispatch()
    const optionSets = useSelector(state => state.metadata.optionSets)
    const completed = useSelector(state => state.data.event.status.completed)
    var value = useSelector(state => state.data.event.values[id])
    const programId = useSelector(state => state.data.panel.program)
    const preValues = useSelector(state => state.data.previousValues)
    const programStage = useSelector(state => state.data.event.programStage)
    const username = useSelector(state => state.metadata.user.username)
    console.log(" hellloooos ", programStage)

    if (Object.keys(preValues).length && (id in preValues)) {
        value = preValues[id];
    }
    const color = useSelector(
        state => state.data.event.programStage.dataElements[id].color
    )
    var disabled = useSelector(
        state => state.data.event.programStage.dataElements[id].disabled
    )
    if (username == "labtech" && programStage.displayName == "Clinician Notes" && value) {
        disabled = true
    }
    const displayFormName = useSelector(
        state => state.data.event.programStage.dataElements[id].displayFormName
    )
    const error = useSelector(
        state => state.data.event.programStage.dataElements[id].error
    )
    const hide = useSelector(
        state => state.data.event.programStage.dataElements[id].hide
    )
    const optionSet = useSelector(
        state => state.data.event.programStage.dataElements[id].optionSet
    )
    const optionSetValue = useSelector(
        state => state.data.event.programStage.dataElements[id].optionSetValue
    )
    const required = useSelector(
        state => state.data.event.programStage.dataElements[id].required
    )
    var valueType = useSelector(
        state => state.data.event.programStage.dataElements[id].valueType
    )
    if (programStage.displayName == "Clinician Notes") {
        if (valueType == "TEXT") {
            valueType = "TEXTAREA"
        }
    }
    const numType = valueType.toUpperCase();
    const warning = useSelector(
        state => state.data.event.programStage.dataElements[id].warning
    )

    const duplicate =
        id === SAMPLE_ID_ELEMENT && SAMPLE_TESTING_PROGRAM["0"].value == programId &&
        useSelector(state => state.data.event.duplicate)

    const onChange = (key, value) => {

        var results = ["Not available","Rejected","Sterile"]
        if((key == ORGANISM_DETECTED) && (value == 'Pathogen detected'))
        {
         dispatch(AddAndSubmit(true))
         dispatch(setEventValue(key, value,false))
        }
        else if((key == ORGANISM_DETECTED) && (results.indexOf(value) > -1)) {
         dispatch(AddAndSubmit(false))
         dispatch(setEventValue(key, value,false))
        }
        else {
            dispatch(setEventValue(key, value,false))
        }
    }

    const handleChange = (event) => {
        onChange(id, event.target.value);
    };


    if (hide) return null

    return (

        <Padding>
            {
                optionSetValue ?
                (
                        optionSets[optionSet].length < 5 ?
                            (
                    <RadioInputs
                        objects={optionSets[optionSet]}
                        name={id}
                        label={displayFormName}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled || completed}
                    />
                            ) :
                            (
                    <SelectInput
                        objects={optionSets[optionSet]}
                        name={id}
                        label={displayFormName}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled || completed}
                    />
                )
                    ) :
                    valueType === 'TRUE_ONLY' ?
                        (
                <SwitchInput
                    name={id}
                    label={displayFormName}
                    checked={value}
                    onChange={onChange}
                    required={required}
                    value={value}
                    disabled={disabled || completed}
                />
                        ) :
                        valueType === 'DATE' ?
                            (
                <DateInput
                    name={id}
                    label={displayFormName}
                    value={value}
                    required={required}
                    onChange={onChange}
                    disabled={disabled || completed}
                />
                            ) :
                            valueType === "TEXTAREA" ? (

                    <TextField
                    id="outlined-multiline-static"
                    label={displayFormName}
                    multiline
                    rows={5}
                    variant="outlined"
                    required={required}
                    name={id}
                    onChange={handleChange}
                    className="textArea"
                    value={value}
                />

                            ) :
                            (
                <TextInput
                    name={id}
                    label={displayFormName}
                    value={value}
                    required={required}
                    onChange={onChange}
                    disabled={disabled || completed}
                    type={valueType}
                    color={numType == "NUMBER" && value && color}
                    unique={id === SAMPLE_ID_ELEMENT}
                    error={
                        error
                            ? error
                            : id === SAMPLE_ID_ELEMENT &&
                              duplicate === DUPLICACY.DUPLICATE_ERROR
                            ? duplicate
                            : ''
                    }
                    warning={
                        warning
                            ? warning
                            : id === SAMPLE_ID_ELEMENT &&
                              duplicate === DUPLICACY.DUPLICATE_WARNING
                            ? duplicate
                            : ''
                    }
                    loading={
                        id === SAMPLE_ID_ELEMENT &&
                        duplicate === DUPLICACY.DUPLICATE_CHECKING
                            ? true
                            : false
                    }
                />
                            )
            }
        </Padding>
    )
}

DataElement.propTypes = {
    id: string.isRequired,
}
