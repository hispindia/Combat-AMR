import { get, request } from '@hisp-amr/api'
import { ORGANISM_ELEMENT, PERSON_TYPE, DEO_GROUP } from 'constants/dhis2'
import { HIDE, IGNORE, EDITABLE } from 'constants'

const getUserData = async () =>
    await get(
        request('me', {
            fields: 'organisationUnits,userGroups,userCredentials[username]',
        })
    )

const getMetadata = async () =>
    await get(
        request('metadata', {
            order: 'level:asc',
            fields: [
                'children',
                'condition',
                'code',
                'dataElement',
                'displayName',
                'formName',
                'attributeValues[value,attribute[code]]',
                'categoryOptionCombos[id,categoryOptions[code,id]]',
                'id',
                'name',
                'options',
                'organisationUnits',
                'path',
                'priority',
                'program',
                `programRuleActions[programRuleActionType,dataElement,
                optionGroup,content,trackedEntityAttribute,
                programStageSection,data]`,
                'programStage',
                `programStages[id,displayName,access,programStageDataElements[
                dataElement[id],compulsory],programStageSections[id,name,
                displayName,renderType,dataElements[id,displayFormName,
                code,valueType,optionSetValue,optionSet]]]`,
                `trackedEntityTypeAttributes[name,id,displayName,valueType,
                unique,optionSetValue,optionSet,mandatory,
                trackedEntityAttribute[name,id,displayName,valueType,
                unique,optionSetValue,optionSet]]`,
                'value',
                'programRuleVariableSourceType'
            ],
            options: [
                'constants=true',
                'dataElements=true',
                'optionGroups=true',
                'options=true',
                'optionSets=true',
                'organisationUnits=true',
                'programRules=true',
                'programRuleVariables=true',
                'programs=true',
                'trackedEntityTypes=true',
                'categoryCombos=true',
                'dataSets=true'
            ],
        })
    )

const sortChildren = ou => {
    ou.children.forEach(c => sortChildren(c))
    ou.children.sort((a, b) =>
        a.displayName > b.displayName
            ? 1
            : b.displayName > a.displayName
            ? -1
            : 0
    )
}

const hasHide = name => name.includes(HIDE)

const hasIgnore = name => name.includes(IGNORE)

const hasEditable = name => name.includes(EDITABLE)

const removeOption = (name, option) => name.replace(option, '')

export const initMetadata = async isIsolate => {
    let calculatedVariables = [];
    // Replaces '#{xxx}' with 'this.state.values['id of xxx']'
    const programCondition = (c ,pId)=> {
        const original = c
        try {
            const variableDuplicated = c.match(/#\{.*?\}/g)
            const variables = []
            if (!variableDuplicated) return c
            variableDuplicated.forEach(duplicated => {
                if (variables.indexOf(duplicated) === -1)
                    variables.push(duplicated)
            })
            variables.forEach(variable => {
                const name = variable.substring(2, variable.length - 1)
                const reqID = data.programRuleVariables.find(
                    ruleVariable => ruleVariable.name === name && ruleVariable.program.id == pId
                )
                var id = reqID.dataElement? reqID.dataElement.id: "";
                if(reqID.programRuleVariableSourceType==="CALCULATED_VALUE") {
                    let checkValue = calculatedVariables.some(cv=> cv.id == name && cv.program == reqID.program.id)
                    if(!checkValue) calculatedVariables.push({id: name, program:reqID.program.id});
                    id = name;
                }

                if(id) {
                    c = c.replace(
                        new RegExp('#{' + name + '}', 'g'),
                        "values['" + id + "']"
                    )
                }
            })
        } catch (e) {
            console.warn('Improper condition:', original)
        }
        return c
    }

    // Replaces 'A{xxx}' with 'this.state.values['id of xxx']'
    const entityCondition = c => {
        const variableDuplicated = c.match(/A\{.*?\}/g)
        const variables = []
        if (!variableDuplicated) return c
        variableDuplicated.forEach(duplicated => {
            if (variables.indexOf(duplicated) === -1) variables.push(duplicated)
        })

        variables.forEach(variable => {
            const id = attributeIds[variable.substring(2, variable.length - 1)]
            c = c.replace(/A\{.*?\}/g, "values['" + id + "']")
        })

        return c
    }

    const userData = await getUserData()

    const userGroups = userData.userGroups.map(userGroup => userGroup.id)
    const user = {
        username: userData.userCredentials.username,
        deoMember: userGroups.includes(DEO_GROUP),
    }
    const userOrgUnits = userData.organisationUnits.map(uo => uo.id)

    const data = await getMetadata()

    const orgUnits = []
    data.organisationUnits
        .filter(o => userOrgUnits.some(uo => o.path.includes(uo)))
        .forEach(o => {
            if (userOrgUnits.includes(o.id)) orgUnits.push(o)
            else {
                const ancestors = o.path.split('/').slice(1, -1)
                let ancestor = ancestors.shift()
                let parent = orgUnits.find(o => o.path.endsWith(ancestor))
                while (!parent) {
                    ancestor = ancestors.shift()
                    parent = orgUnits.find(o => o.path.endsWith(ancestor))
                }
                while (ancestors.length > 0) {
                    ancestor = ancestors.shift()
                    parent = parent.children.find(o => ancestor === o.id)
                }
                if (parent) {
                    const children = parent.children
                    children[children.findIndex(s => s.id === o.id)] = o
                }
            }
        })

    // Sorting descendants of each of the user's OU's.
    orgUnits.forEach(ou => sortChildren(ou))

    const options = {}
    data.options.forEach(
        o =>
            (options[o.id] = {
                label: o.displayName,
                value: o.code,
            })
    )

    const optionSets = {}
    data.optionSets.forEach(
        os => (optionSets[os.id] = os.options.map(o => options[o.id]))
    )
    data.optionGroups.forEach(
        os => (optionSets[os.id] = os.options.map(o => options[o.id]))
    )

    const person = data.trackedEntityTypes.find(type => (type.id = PERSON_TYPE))

    person.uniques = {}
    person.values = {}
    const attributeIds = {}
    person.trackedEntityTypeAttributes.forEach(a => {
        if (a.trackedEntityAttribute.unique)
            person.uniques[a.trackedEntityAttribute.id] = true
        person.values[a.trackedEntityAttribute.id] = ''
        a.hide = false
        attributeIds[a.trackedEntityAttribute.name] =
            a.trackedEntityAttribute.id
    })

    person.rules = []
    data.programRules
        .filter(r => r.programRuleActions.find(a => a.trackedEntityAttribute))
        .forEach(d => {
            if (!person.rules.find(rule => rule.name === d.name)) {
                d.condition = entityCondition(d.condition)
                person.rules.push(d)
            }
        })

    const programs = data.programs.filter(p => !hasIgnore(p.name))

    const programList = []
    const stageLists = {}
    const programOrganisms = {}
    programs.forEach(p => {
        programList.push({
            value: p.id,
            label: p.name,
            orgUnits: p.organisationUnits.map(o => o.id),
        })
        const stages = []
        programOrganisms[p.id] = data.optionGroups.find(
            og => og.name === p.name
        ).id
        const remove = []
        p.programStages
            .filter(ps => ps.access.data.write || ps.access.data.read)
            .forEach(ps => {
                stages.push({
                    value: ps.id,
                    label: ps.displayName,
                })
                ps.dataElements = {}
                ps.programStageDataElements.forEach(
                    d =>
                        (ps.dataElements[d.dataElement.id] = {
                            required: d.compulsory,
                            hide: false,
                        })
                )
                if (ps.dataElements[ORGANISM_ELEMENT])
                    ps.dataElements[ORGANISM_ELEMENT].hideWithValues = true
                ps.programStageSections.forEach(pss => {
                    if (hasHide(pss.name)) {
                        pss.displayName = pss.name = removeOption(
                            pss.name,
                            HIDE
                        )
                        pss.hideWithValues = true
                    }
                    if (hasEditable(pss.name)) {
                        pss.displayName = pss.name = removeOption(
                            pss.name,
                            EDITABLE
                        )
                        if (isIsolate) pss.editable = true
                    }
                    pss.dataElements.forEach(
                        d =>
                            (ps.dataElements[d.id] = {
                                ...ps.dataElements[d.id],
                                ...d,
                            })
                    )
                    pss.dataElements = pss.dataElements.map(d => d.id)
                    const childSections = []
                    ps.programStageSections
                        .filter(cs =>
                            cs.name.match(new RegExp('{' + pss.name + '}.*'))
                        )
                        .forEach(cs => {
                            remove.push(cs.id)
                            cs.name = cs.name.replace(
                                new RegExp('{' + pss.name + '}'),
                                ''
                            )
                            cs.editable = !!pss.editable
                            childSections.push(cs)
                        })
                    pss.childSections = childSections
                })
                ps.programStageSections = ps.programStageSections.filter(
                    s => !remove.includes(s.id)
                )
            })
        stageLists[p.id] = stages
    })

    let eventRules = []
    data.programRules
        .filter(r =>
            r.programRuleActions.find(
                a => a.dataElement || a.programStageSection || a.content
            )
        )
        .forEach(d => {
            d.condition = programCondition(d.condition, d.program.id)
            eventRules.push(d)
        })
    eventRules = eventRules.sort((a, b) =>
        a.priority > b.priority || !a.priority ? 1 : -1
    )

    const constants = {}
    if (data.constants)
        data.constants.forEach(c => {
            if (c.code) constants[c.code] = c.value
        })

    const dataElements = {}
    //This is to hold the data elements with their codes and have the whole DE objec referenced.
    const dataElementObjects = {}

    //this is used to distinguish which data element contains which attribute value.
    dataElementObjects.attributeGroups={}

    data.dataElements.forEach(
        de => {
            dataElements[de.id] = de.formName ? de.formName : de.displayName

            //remap the attributeOptionValue with code
            de.attributeValues.forEach(attributeValue=>{
                de[attributeValue.attribute.code]=attributeValue.value
                if(!dataElementObjects.attributeGroups[attributeValue.value]){
                    dataElementObjects.attributeGroups[attributeValue.value] =[]
                }
                dataElementObjects.attributeGroups[attributeValue.value].push(de.id)
            })

            dataElementObjects[de.id]=de
            dataElementObjects[de.code]=de
        }
    )

    const categoryCombos={}

    data.categoryCombos.forEach(categoryCombo=>{
        categoryCombo.categoryOptions={}
        categoryCombo.categoryOptionCombos.forEach(categoryOptionCombo=>{
            //use the code of the options as the identifier for the categoryOptionCode
            let categoryOptionCodes = []
            categoryOptionCombo.categoryOptions.forEach(categoryOption=>{
                categoryOptionCodes.push(categoryOption.code)

                //This adds the categoryOptions as a child of the catCombo it is usefull for DS attributes.
                if(!categoryCombo.categoryOptions[categoryOption.code]){
                    categoryCombo.categoryOptions[categoryOption.code]=categoryOption.id
                }
            })
            //sort Ids for handling more than two categoyOptions
            categoryOptionCodes = categoryOptionCodes.sort();
            let identifierWithOptionCodes = categoryOptionCodes.join("")
            categoryCombo.categoryOptionCombos[identifierWithOptionCodes]=categoryOptionCombo.id
        })

        categoryCombos[categoryCombo.code]=categoryCombo
    })

    const dataSets = {}

    data.dataSets.forEach(dataSet=>{
        dataSets[dataSet.code]=dataSet.id
    })





    return {
        optionSets,
        person,
        programs,
        programList,
        stageLists,
        programOrganisms,
        constants,
        dataElements,
        dataElementObjects,
        categoryCombos,
        dataSets,
        orgUnits,
        user,
        eventRules,
        calculatedVariables
    }
}
