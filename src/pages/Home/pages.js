import i18n from '@dhis2/d2-i18n'
// export pages
import {
    PAGE_NAME as DATA_EXPORT_PAGE_NAME,
    PAGE_DESCRIPTION as DATA_EXPORT_DESCRIPTION,
} from '../DataExport/DataExport'
import {
    PAGE_NAME as DATA_IMPORT_PAGE_NAME,
    PAGE_DESCRIPTION as DATA_IMPORT_DESCRIPTION,
} from '../DataImport/DataImport'

const capitalizeFirstLetter = string =>
    string.charAt(0).toUpperCase() + string.slice(1)
const capitalizeName = name =>
    name.split(' ').map(capitalizeFirstLetter).join(' ')
const capitalizePages = pages =>
    pages.map(p => ({ ...p, name: capitalizeName(p.name) }))

const exportPages = capitalizePages([
    {
        name: DATA_EXPORT_PAGE_NAME,
        description: DATA_EXPORT_DESCRIPTION,
        linkText: i18n.t('Export data'),
        to: '/export/data',
    }
])

const importPages = capitalizePages([
    {
        name: DATA_IMPORT_PAGE_NAME,
        description: DATA_IMPORT_DESCRIPTION,
        linkText: i18n.t('Import data'),
        to: '/import/data',
    }
])

export { exportPages, importPages }
