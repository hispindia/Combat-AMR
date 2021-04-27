import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Grid } from '@material-ui/core'
import { Padding } from '../Padding'
import { CardSection } from 'components'
import { SelectInput, RadioInputs, DateInput } from '@hisp-amr/inputs'
import { setProgram, setPanelValue } from 'actions'
import { PanelButtons } from './PanelButtons'
import { SAMPLE_TESTING_PROGRAM } from 'constants/dhis2'

/**
 * Contains event panel.
 */
export const Panel = ({ showEdit }) => {
    const entityValid = useSelector(state => state.data.entity.valid)
    const editable = useSelector(state => state.data.editable)
    const dispatch = useDispatch()
    const { stageLists } = useSelector(state => state.metadata)
    var {
        program,
        programStage,
        organism,
        sampleDate,
        valid,
        programs,
        defaultProgram,
        organisms,
    } = useSelector(state => state.data.panel)
    const isPrevEvent = useSelector(state => state.data.previousValues)
    if (Object.keys(isPrevEvent).length || editable) {
        if (programs) {
            programs = programs.filter(function (element) {
                return element.value != SAMPLE_TESTING_PROGRAM[0].value;
        
            });
        }
    }
    /**
     * Called when a new program is selected.
     */
    const onProgramChange = async (name, value) =>{
        dispatch(setProgram(value))
    }

    /**
     * Called when something other than program is changed
     */
    const onChange = (name, value) => {
            dispatch(setPanelValue(name, value))
    }

    /**
     * Gets the data elements to be rendered.
     * @returns {Object[]} Data elements.
     */
    const getDataElement = id => {
        const common = {
            disabled: valid,
            required: true,
        }
        var datedisabled = false;
        var hideType = Object.keys(isPrevEvent).length;
        if ((hideType && id == "programStage")|| (id == "programStage" && programs && programs.length < 3)) {
            id = "null" ;
        }
        if (hideType) {
            datedisabled = true;
            if (organism) {
                datedisabled = false;
            }
            if (sampleDate) {
                datedisabled = true;
            }
        }
        else {
            if (editable) {
               datedisabled = true; 
            }
        }
        switch (id) {
            case `defaultProgram`: 
            return getInput({
                ...common,
                id: 'program',
                name: 'program',
                label: 'Group',
                objects: defaultProgram,
                onChange: onProgramChange,
                value: program
            })
            case 'program':
                return getInput({
                    ...common,
                    id: 'program',
                    name: 'program',
                    label: 'Pathogen group',
                    objects: programs,
                    onChange: onProgramChange,
                    value: program,
                })
            case 'programStage':
                    return getInput({
                        ...common,
                        id: 'programStage',
                        name: 'programStage',
                        label: 'Type',
                        objects: stageLists[program],
                        onChange: onChange,
                        value: programStage,
                    })
            case 'organism':
                return getInput({
                    ...common,
                    id: 'organism',
                    name: 'organism',
                    label: 'Pathogen',
                    objects: organisms,
                    onChange: onChange,
                    value: organism,
                })
            case 'sampleDate':
                return getInput({
                    disabled: datedisabled,
                    required:true,
                    id: 'sampleDate',
                    name: 'sampleDate',
                    label: 'Date of Sample',
                    onChange: onChange,
                    value: sampleDate,
                })
            default:
                return
        }
    }

    /**
     * Gets the input component.
     * @param {Object} dataElement - Data element.
     * @returns {Component} Input component.
     */
    const getInput = dataElement => (
        <Padding key={dataElement.id}>
            {!dataElement.objects ? (
                <DateInput {...dataElement} />
            ) : dataElement.objects.length < 4 ? (
                <RadioInputs {...dataElement} />
            ) : (
                <SelectInput {...dataElement} />
            )}
        </Padding>
    )

    if (!entityValid) return null

    return (
        <CardSection heading="Panel" buttons={showEdit && <PanelButtons />}>
            <Grid container spacing={0}>
                <Grid item xs>
                    {(defaultProgram.length && !editable) ?  getDataElement('defaultProgram'): getDataElement('program')}
                    {program &&
                        stageLists[program].length >= 1 &&
                        getDataElement('programStage')}
                </Grid>
                <Grid item xs>
                    {(program && organisms.length) ? getDataElement('organism') : ""}
                    {getDataElement('sampleDate')}
                </Grid>
            </Grid>
        </CardSection>
    )
}
