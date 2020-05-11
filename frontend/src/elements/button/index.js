import React from "react";
import './styles.css'

export default function Button(props) {
    const {className, ...pr} = props
    let buttonClassName = 'button-input '
    if (className)
        buttonClassName += className
    return <input type="button"
                  className={buttonClassName}
                  {...pr}
    />

}
