import React, { useState, useEffect } from 'react'
import { bool, func, string } from 'prop-types'
import { Switch } from '@dhis2/ui-core'

/**
 * Switch input.
 */

export const SwitchInput = props => {
    const [value, setValue] = useState(false)

    useEffect(() => {
        if (props.value !== value) setValue(props.value)
    }, [props.value])
    const blinkStyle = {
        color: 'red',
        display: 'block',
        textAlign: 'left',
        fontSize: '16px',
        fontWeight: 'bold',
        animation: 'blink 1s steps(1, end) infinite'
    }

    const onChange = event => {
        const { checked } = event.target
        setValue(checked)
        props.onChange(props.name, checked)
    }

    return (
        <>
        <style>
                {`
                    @keyframes blink {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0;
                        }
                    }
                `}
            </style>
        <Switch
            name={props.name}
            checked={value}
            label={props.label}
            disabled={props.disabled}
            onChange={onChange}
            />
            {props?.warningValue?<small style={blinkStyle}>{ props?.warningValue||''  }</small>:''}
            </>
    )
}

SwitchInput.propTypes = {
    onChange: func.isRequired,
    name: string.isRequired,
    label: string.isRequired,
    disabled: bool,
    value: string,
    warningValue:string,
}
