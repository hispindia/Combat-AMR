import i18n from '@dhis2/d2-i18n'
import { hasValue, composeValidators } from '@dhis2/ui'
import React from 'react'
import { DATE_VALIDATOR } from '../DatePicker/DatePickerField'
import { MonthPickerField } from '../index'

const NAME = 'endMonth'
const DATATEST = 'input-end-month'
const LABEL = i18n.t('End month')
const VALIDATOR = composeValidators(hasValue, DATE_VALIDATOR)

const EndMonth = () => (
    <MonthPickerField
        name={NAME}
        validator={VALIDATOR}
        label={LABEL}
        dataTest={DATATEST}
    />
)

export { EndMonth }
