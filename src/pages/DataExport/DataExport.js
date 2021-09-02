import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Help, ReactFinalForm } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    Page,
    MoreOptions,
    BasicOptions,
    SchemeContainer,
    DataIcon,
    ValidationSummary,
} from '../../components/index'
import {
    OrgUnitTree,
    defaultFormatOption,
    defaultCompressionOption,
    Dates,
    EndDate,
    defaultDataElementIdSchemeOption,
    defaultIdSchemeOption,
    ExportButton,
    FormAlerts,
    StartMonth,
    EndMonth,
} from '../../components/Inputs/index'
import { dataSetQuery } from '../../components/ResourcePicker/queries'
import { onExport, validate } from './form-helper'

const { Form } = ReactFinalForm

// PAGE INFO
export const PAGE_NAME = i18n.t('Data export')
export const PAGE_DESCRIPTION = i18n.t(
    'Export metadata, such as data elements and organisation units, in DXF 2 format.'
)
const PAGE_ICON = <DataIcon />

const today = new Date()
const initialValues = {
    selectedOrgUnits: [],
    includeChildren: true,
    selectedDataSets: [],
    format: defaultFormatOption,
    compression: defaultCompressionOption,
    startMonth: new Date(
        today.getFullYear(),
        today.getMonth() - 2,
        1
    ),
    //This makes the end month the last day of this month.
    endMonth: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    includeDeleted: true,
    dataElementIdScheme: defaultDataElementIdSchemeOption,
    orgUnitIdScheme: 'CODE',
    idScheme: defaultIdSchemeOption,
}

const DataExport = () => {
    const [exportEnabled, setExportEnabled] = useState(true)
    const { baseUrl } = useConfig()
    const [dataSets, setDataSets] = useState([])
    const [dataSetError, setDataSetError] = useState(undefined)
    const [initValues , setInitValues] = useState (initialValues)

    const onSubmit = onExport(baseUrl, setExportEnabled)

    const { dataSetError: resourceError, resourceName, query } = { resourceName: 'dataSets', query: dataSetQuery }

    /**
     * Load all datasets and select the datasets automatically.
     */
    const { loading } = useDataQuery(query, {
        onComplete: data => {
            const elements = data[resourceName][resourceName]
            const list = []

            elements.forEach(dataSet => {
                list.push(dataSet.id)
            });

            if (list.length > 0) {
                setDataSets(list);
                let newObj = {...initValues}
                newObj.selectedDataSets = list;
                setInitValues(newObj)
            }
        },
        onError: error => {
            setDataSetError(error)
            console.error(`Picking dataSets error (${error})`)
        }
    })

    return (
        <Page
            title={PAGE_NAME}
            desc={PAGE_DESCRIPTION}
            icon={PAGE_ICON}
            loading={!exportEnabled}
            dataTest="page-export-data"
        >
            {dataSetError &&
                <Help dataSetError>
                    <p>Data sets could not be loaded.</p>
                    <p>{dataSetError.message}</p>
                </Help>

            }
            {dataSets.length > 0 &&
                <Form
                    onSubmit={onSubmit}
                    initialValues={initValues}
                    validate={validate}
                    subscription={{
                        values: true,
                        submitError: true,
                    }}
                    render={({ handleSubmit, form, submitError }) => (
                        <form onSubmit={handleSubmit}>
                            <BasicOptions>
                                <OrgUnitTree />
                                <Dates
                                    label={i18n.t('Date range to export data for')}
                                >
                                    <StartMonth />
                                    <EndMonth />
                                </Dates>
                            </BasicOptions>
                            <ValidationSummary />
                            <ExportButton
                                label={i18n.t('Export data')}
                                disabled={!exportEnabled}
                            />
                            <FormAlerts alerts={submitError} />
                        </form>
                    )}
                />
            }
        </Page>
    )
}

export { DataExport }
