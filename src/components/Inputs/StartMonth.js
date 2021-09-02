import i18n from '@dhis2/d2-i18n'
import { hasValue, composeValidators } from '@dhis2/ui'
import React from 'react'
import { DATE_VALIDATOR } from '../DatePicker/DatePickerField'
import { MonthPickerField } from '../index'

const NAME = 'startMonth'
const DATATEST = 'input-start-month'
const LABEL = i18n.t('Start month')
const VALIDATOR = composeValidators(hasValue, DATE_VALIDATOR)

const StartMonth = () => (
    <MonthPickerField
        name={NAME}
        validator={VALIDATOR}
        label={LABEL}
        dataTest={DATATEST}
    />
)

export { StartMonth }
