import React, {useState, useEffect} from "react";
import './styles.css'
import Input from "../../elements/input";
import Button from "../../elements/button";
import {isNumeric} from "../../functions";


export default function InstanceAccordion(props) {
    const [setActive, setActiveState] = useState(true)
    const [setEdit, setEditState] = useState(false);
    const [newValue, setValue] = useState(props.value);
    const [newRate, setRate] = useState(props.rate);
    const [newDateFrom, setDateFrom] = useState(props.date_from);
    const [newDateTo, setDateTo] = useState(props.date_to);
    const [valid, validate] = useState(false);

    useEffect(() => {
        validate(isNumeric(newRate) && parseFloat(newRate) > 0 &&
            isNumeric(newValue) && parseFloat(newValue) > 0 &&
            newDateFrom.length !== 0 && newDateFrom < newDateTo &&
            newDateTo.length !== 0)
    }, [newValue, newRate, newDateFrom, newDateTo]);

    const toggleEdit = () => setEditState(!setEdit);

    const cancelChanges = () => {
        setEditState(false)
        setValue(props.value)
        setRate(props.rate)
        setDateFrom(props.date_from)
        setDateTo(props.date_to)
    }

    const toggleAccordion = () => {
        setActiveState(!setActive)
        cancelChanges()
    }

    const saveEdited = () => {
        props.save(props.i, {
            value: newValue,
            rate: newRate,
            date_from: newDateFrom,
            date_to: newDateTo
        })
        toggleEdit()
    }

    return <div className="instance-item_container">
        <div className={`instance-item ${setActive ? '' : 'expand'}`}
             onClick={toggleAccordion}>
            <span className="instance-text">{props.name}</span>
            <span className="instance-text">{props.title}</span>
            <i className="material-icons dropdown-arrow">expand_more</i>
        </div>
        <div className={`instance-item__more ${setActive ? '' : 'display'}`}>
            <div className={`accordion-content ${setEdit ? '' : 'disabled'}`}>
                <div className="column">
                    <Input className="input-long"
                           label="Сумма"
                           value={newValue}
                           onChange={setValue}
                    />
                    <Input label="Ставка"
                           value={newRate}
                           onChange={setRate}
                    />
                </div>
                <div className="column">
                    <Input className="input-date"
                           label="Дата начала"
                           value={newDateFrom}
                           type='date'
                           labelClassName='date'
                           onChange={setDateFrom}
                    />
                    <Input className="input-date accordion-date"
                           value={newDateTo}
                           label="Дата конца"
                           type='date'
                           labelClassName='date'
                           onChange={setDateTo}
                    />
                </div>

                {setEdit
                    ? <div className="accordion-btn">
                        <Button
                            className={`save-button ${valid ? '' : 'disabled'}`}
                            value="Сохранить"
                            onClick={saveEdited}/>
                        <Button
                            className='edit-button'
                            value="Отменить"
                            onClick={cancelChanges}/>
                    </div>
                    : <div className="accordion-btn">
                        <Button
                            className='edit-button'
                            value="Редактировать"
                            onClick={toggleEdit}/>
                    </div>
                }
            </div>
        </div>
        <i className="material-icons remove-item"
           onClick={() => props.removeItem(props.i)}>clear</i>
    </div>
}
