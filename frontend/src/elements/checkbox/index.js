import React from "react";
import './styles.css'

export default function CheckBox(props) {
    return <div>
        <div className="input-label">{props.label}</div>
        <label className="checkbox">
            <input type="checkbox"
                   onClick={props.onClick}/>
            <span className="check-mark"/>
        </label>
        </div>

}
