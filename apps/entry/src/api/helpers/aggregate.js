import {
    get,
    request,
    post
} from '@hisp-amr/api'
import {
    Result
} from 'antd'

const CONSTANTS = {
    customAttributeMetadataTypeIdentifier: 'metadata_type',
    locationCode: "location",
    pathogenCode: "pathogen",
    sampleTypeCode: "sample_type",
    sampleAndLocationCC_Code: "sampleAndLocation",
    antibioticCC_Code: "antibiotic",
    defaultCC_code: "default",
    antibioticAttributeCode: 'antibiotic',
    defaultDataSetCode: 'organismsIsolated',
    antibioticWiseDataSetCode: 'organismsIsolatedAntibioticWise',
    ignoreProgramStage:'LjiZPsbh1oy' //TODO change this to a code
    
}



/**
 * 
 * @param {{event,operation}} operation event and operation operation is either "COMPLETE" or "INCOMPLETE" 
 */
export const Aggregate = async ({
    event,
    operation,
    dataElements,
    categoryCombos,
    dataSets,
    orgUnit,
    eventList
}) => {

    if(event.programStage.id===CONSTANTS.ignoreProgramStage){
        //this program stage is not correct
        return true;
    }
    //first get the metadata from the evens 

    //Now get the location data
    let locationDataElement = dataElements.attributeGroups[CONSTANTS.locationCode][0] //There is only one DataElement
    let locationData = event.values[locationDataElement]

    let pathogenDataElement = dataElements.attributeGroups[CONSTANTS.pathogenCode][0] //There is only one dataElements
    let pathogenData = event.values[pathogenDataElement]

    let sampleTypeDataElement = dataElements.attributeGroups[CONSTANTS.sampleTypeCode][0]
    let sampleTypeData = event.values[sampleTypeDataElement]


    let cc = categoryCombos[CONSTANTS.sampleAndLocationCC_Code].id
    let cp = categoryCombos[CONSTANTS.sampleAndLocationCC_Code].categoryOptions[locationData]
    cp = cp + ";" + categoryCombos[CONSTANTS.sampleAndLocationCC_Code].categoryOptions[sampleTypeData]

    let importantValues = []
    Object.keys(event.values).forEach(value => {
        //loop through the values and look for result data elements if found one save that.
        if (event.values[value] !== "") {

            if (dataElements[value][CONSTANTS.customAttributeMetadataTypeIdentifier] === CONSTANTS.antibioticAttributeCode) {
                //This means that this data elemnt is an antibiotic result therefore add it to important values.

                let tempArray = [dataElements[value].code, event.values[value]]
                tempArray = tempArray.sort();
                let categoryOptionCombo = tempArray.join("");
                categoryOptionCombo = categoryCombos[CONSTANTS.antibioticCC_Code].categoryOptionCombos[categoryOptionCombo]

                importantValues.push(categoryOptionCombo)
            }
        }
    })

    let de = dataElements[pathogenData].id
    let deAntibioticWise = dataElements[pathogenData + '_AW'].id

    let coDefault = categoryCombos[CONSTANTS.defaultCC_code].categoryOptionCombos[CONSTANTS.defaultCC_code]
    let defaultDataSet = dataSets[CONSTANTS.defaultDataSetCode]
    let antibioticWiseDataSet = dataSets[CONSTANTS.antibioticWiseDataSetCode]

    let lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth()-1)
    let period = (lastMonth).toISOString().substring(0,7).replace('-',"");

    //now every metadata is fetched so for each get and update the data.
    let a = await get(
        request(`dataValues.json`, {
            options: [`pe=${period}&ds=${defaultDataSet}&de=${de}&ou=${orgUnit.id}&cc=${cc}&cp=${cp}&co=${coDefault}`],
        })
    )

    let value = 0

    if (a.httpStatus === "Conflict") {
        //this means that the value does not exist
        if (operation === "COMPLETE") {
            value = 1
        } else {
            value = 0
        }
    } else {
        if (operation === "COMPLETE") {
            value = parseInt(a[0]) + 1
        } else {
            value = parseInt(a[0]) - 1
        }
    }

    try {
        let b = await post(
            request(`dataValues.json`, {
                options: [
                    `pe=${period}&ds=${defaultDataSet}&de=${de}&ou=${orgUnit.id}&cc=${cc}&cp=${cp}&value=${value}&co=${coDefault}`,
                ],
                data: {}
            })
        )
    } catch (SyntaxError) {
        //This means that the post is working properly
        //Since there is no response when performing a post request it will create a syntax error.
    }

    for (let index in importantValues) {
        let co = importantValues[index]
        let a = await get(
            request(`dataValues.json`, {
                options: [`pe=${period}&ds=${antibioticWiseDataSet}&de=${deAntibioticWise}&ou=${orgUnit.id}&cc=${cc}&cp=${cp}&co=${co}`],
            })
        )

        let value = 0

        if (a.httpStatus === "Conflict") {
            //this means that the value does not exist
            value = 1
        } else {
            value = parseInt(a[0]) + 1
        }

        try {
            let b = await post(
                request(`dataValues.json`, {
                    options: [
                        `pe=${period}&ds=${antibioticWiseDataSet}&de=${deAntibioticWise}&ou=${orgUnit.id}&cc=${cc}&cp=${cp}&value=${value}&co=${co}`,
                    ],
                    data: {}
                })
            )
        } catch (SyntaxError) {
            console.log("sucessfully sent value ", value, "response is ", SyntaxError)
            //This means that the post is working properly
        }
    };

    return true;
}