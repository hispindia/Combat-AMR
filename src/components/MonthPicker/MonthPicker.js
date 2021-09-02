import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { jsDateToISO8601 } from '../../utils/helper'

const MonthPicker = ({ name, error, label, date, onChange, dataTest }) => {
    const onChangeHelper = ({ value }) => {
        if (!value) {
            onChange(value)
        } else {
            if (name.startsWith("end")) {
                //if the name of the input starts with end, make the month select end date.
                let date = new Date(value)
                onChange(new Date(date.getFullYear(), date.getMonth() + 1, 0))
            } else {
                onChange(new Date(value))
            }
        }
    }

    const value = (date && jsDateToISO8601(date)).substr(0, 7)
    return (
        <InputField
            type="month"
            name={name}
            value={value}
            label={label}
            onChange={onChangeHelper}
            inputWidth="200px"
            error={!!error}
            validationText={error}
            dataTest={dataTest}
        />
    )
}

MonthPicker.propTypes = {
    dataTest: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
        .isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
}

export { MonthPicker }
