import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { setEntityValue, validateUnique } from '@hisp-amr/app'
import { TextInput, AgeInput, RadioInputs, SelectInput } from '@hisp-amr/inputs'
import {TreeViewInput} from './TreeViewInput'

const Padding = styled.div`
    padding: 16px;
`

/**
 * Entity information section.
 */
export const EntityInput = ({ attribute,userAccess }) => {
    const dispatch = useDispatch()
    const { optionSets } = useSelector(state => state.metadata)
    const { id: entityId, editing } = useSelector(state => state.data.entity)
    const id = attribute.trackedEntityAttribute.id
    const value = useSelector(state => state.data.entity.values[id])
    const unique = useSelector(state => state.data.entity.uniques[id])
    const modal = useSelector(state => state.data.entity.modal)
    const disabled = entityId && !editing && !userAccess? true : false
    const valueType = attribute.trackedEntityAttribute.valueType;
    const displayLabel = attribute.trackedEntityAttribute.formName ? attribute.trackedEntityAttribute.formName : attribute.trackedEntityAttribute.displayName
    var { orgUnits } = useSelector(state => state.metadata)
    var valueToFind = "";


    function newOrgInsert(testorgs)
    {
    var testorgss = testorgs
    var isParent = false;
    if(Array.isArray(testorgs)){
    testorgss = testorgs[0]
    }
    else{
        testorgss = testorgs
    }
    if(testorgss && isParent == false){
        testorgss['label'] = testorgss.displayName;
        testorgss['value'] = testorgss.id;
        if (testorgss.id == value) {
            valueToFind = testorgss.displayName
        }
    isParent = true;
    }
    if(testorgss.children.length!=0){
        testorgss.children.forEach(function(element){
            element['label'] = element.displayName
            element['value'] = element.id
            if (element.id == value) {
                valueToFind = element.displayName;
            }
        newOrgInsert(element)
        })
    }
    return testorgss
    }
    var orgUnitsLabels = {}
    if (valueType === "ORGANISATION_UNIT") {
        orgUnitsLabels = newOrgInsert(orgUnits)
    }
    /**
     * Called on every input field change.
     */
    const onChange = (n, v) => {
        if (v !== value) dispatch(setEntityValue(n, v))
    }

    /**
     * Checks if unique value is valid.
     * @param {string} id - Attribute ID.
     * @param {string} value - Attribute value.
     * @param {string} label - Attribute label.
     */
    const onValidation = async (name, value, label) =>
        await dispatch(validateUnique(name, value, label))

    if (attribute.hide) return null

    return (
        <Padding>
            {attribute.trackedEntityAttribute.valueType === 'AGE' ? (
                <AgeInput
                    required={attribute.mandatory}
                    unique={attribute.trackedEntityAttribute.unique}
                    name={attribute.trackedEntityAttribute.id}
                    label={displayLabel}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            ) : attribute.trackedEntityAttribute.optionSetValue ? (
                optionSets[attribute.trackedEntityAttribute.optionSet.id]
                    .length < 4 ? (
                    <RadioInputs
                        required={attribute.mandatory}
                        objects={
                            optionSets[
                                attribute.trackedEntityAttribute.optionSet.id
                            ]
                        }
                        name={attribute.trackedEntityAttribute.id}
                        label={displayLabel}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                ) : (
                    <SelectInput
                        required={attribute.mandatory}
                        objects={
                            optionSets[
                                attribute.trackedEntityAttribute.optionSet.id
                            ]
                        }
                        name={attribute.trackedEntityAttribute.id}
                        label={displayLabel}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                )
                ) : valueType === "ORGANISATION_UNIT" ?
                        <TreeViewInput data={orgUnitsLabels}
                        placeholder={displayLabel}
                        onChange={onChange}
                        name={attribute.trackedEntityAttribute.id}
                        value={valueToFind}
                        disabled={disabled}
                        />
                : (
                <TextInput
                    required={attribute.mandatory}
                    unique={attribute.trackedEntityAttribute.unique}
                    uniqueInvalid={unique === false}
                    validateUnique
                    onValidation={onValidation}
                    name={attribute.trackedEntityAttribute.id}
                    label={displayLabel}
                    value={value}
                    onChange={onChange}
                    disabled={
                        disabled ||
                        (attribute.trackedEntityAttribute.unique &&
                            (entityId || !!modal))
                    }
                    type={
                        attribute.trackedEntityAttribute.valueType === 'NUMBER'
                            ? 'number'
                            : 'text'
                    }
                />
            )}
        </Padding>
    )
}