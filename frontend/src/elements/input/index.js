import React from "react";
import './styles.css'

export default function Input(props) {
    const {className, error, label, extraText, labelClassName, ...pr} = props
    const onChange = ev => props.onChange(ev.target.value, ev)
    let inputClassName = 'input-param '

    if (props.onChange)
        pr.onChange = onChange
    if (className)
        inputClassName += className

    if (error)
        inputClassName += ' error'

    return <div className={`input-label ${labelClassName ? labelClassName : ''}`}>{label}
        <input
            className={inputClassName}
            {...pr}
        />{extraText}
    </div>
}
