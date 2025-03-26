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
            {props?.warningValue === 'Resistant for Carbapenem' && <p style={{border:'1px solid black', textAlign:'justify',fontSize:'13px',padding:'5px'}}>According to the phenotype AST result, the bacteria may be carbapenem-resistant; therefore, further confirmation is recommended. It is also important for the treating physician to consider the public health implications of these bacteria. It would be recommended to isolate the patient and implement strict infection prevention measures. Additionally, reviewing and optimizing antibiotic prescribing practices, closely monitoring the patient's health outcomes, and reporting cases of carbapenem resistance to the responsible stakeholders are advised.</p>}
    {props.warningValue === 'Resistant for ESBL' && <p style={{border:'1px solid black',textAlign:'justify',fontSize:'13px',padding:'5px'}}>According to the phenotype AST result, the bacteria may be ESBL-resistant; therefore, further confirmation is recommended. Additionally, it is important for the treating physician to consider the public health implications of these bacteria. It would also be advisable to implement strict infection prevention protocols and review and optimize antibiotics prescribing practices.</p>}
    {props.warningValue === 'Resistant for Methicillin' && <p style={{border:'1px solid black', textAlign:'justify', fontSize:'13px',padding:'5px'}}>The bacteria could be MRSA, so the treating physician should be aware of MRSA that is resistant to all beta-lactam antibiotics, including methicillin and cephalosporins. Alternative treatments could be vancomycin or linezolid. However, the susceptibility results must be interpreted in the context of the clinical scenario.</p>}
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
