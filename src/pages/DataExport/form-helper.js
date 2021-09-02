import {
    DATE_BEFORE_VALIDATOR,
    DATE_AFTER_VALIDATOR,
} from '../../components/MonthPicker/MonthPickerField'
import { locationAssign, compressionToName } from '../../utils/helper'
import { jsDateToISO8601, pathToId } from '../../utils/helper'

const valuesToParams = (
    {
        selectedOrgUnits,
        includeChildren,
        selectedDataSets,
        format,
        compression,
        startMonth,
        endMonth,
        includeDeleted,
        dataElementIdScheme,
        orgUnitIdScheme,
        idScheme,
    },
    filename
) =>
    [
        `dataElementIdScheme=${dataElementIdScheme}`,
        `orgUnitIdScheme=${orgUnitIdScheme}`,
        `idScheme=${idScheme}`,
        `includeDeleted=${includeDeleted}`,
        `children=${includeChildren}`,
        `startDate=${jsDateToISO8601(startMonth)}`,
        `endDate=${jsDateToISO8601(endMonth)}`,
        `orgUnit=${selectedOrgUnits.map(o => pathToId(o))}`,
        `dataSet=${selectedDataSets}`,
        `format=${format}`,
        compression ? `compression=${compressionToName(compression)}` : '',
        `attachment=${filename}`,
    ]
        .filter(s => s != '')
        .join('&')

const onExport = (baseUrl, setExportEnabled) => async values => {
    setExportEnabled(false)

    const { format, compression } = values

    // generate URL and redirect
    const apiBaseUrl = `${baseUrl}/api/`
    const endpoint = `dataValueSets`
    const fileExtension = compression ? `${format}.${compression}` : format
    const filename = `${endpoint}.${fileExtension}`
    const downloadUrlParams = valuesToParams(values, filename)
    const url = `${apiBaseUrl}${endpoint}?${downloadUrlParams}`
    locationAssign(url, setExportEnabled)

    // log for debugging purposes
    console.log('data-export:', { url, params: downloadUrlParams })
}

const validate = values => ({
    startMonth: DATE_BEFORE_VALIDATOR(values.startMonth, values.endMonth),
    endMonth: DATE_AFTER_VALIDATOR(values.endMonth, values.startMonth),
})

export { onExport, validate }
