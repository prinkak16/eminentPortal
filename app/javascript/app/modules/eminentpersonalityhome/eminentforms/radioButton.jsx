import React, {useEffect, useState} from 'react'
import './radioButton.css'

const RadioButton = ({radioList, onClicked, fieldKey, selectedValue}) => {
    const [value, setValue] = useState('')
    const clicked = (newValue) => {
        if (typeof onClicked === 'function') {
            onClicked(newValue, fieldKey)
        }
        setValue(newValue)
    }
    useEffect(() => {
        setValue(selectedValue)
    }, [selectedValue]);

    return (
        <div className='buttons-container'>
            {radioList && radioList.map((button) => (
                <div className='button-details' onClick={() => clicked(button)}>
                    <div key={button}
                         className={`radio-outer-component${value === button ? '-active' : ''}`}>
                        <span className={`radio-btn-inner-component${value === button ? '-active' : ''}`}></span>
                    </div>
                    <span>
                        {button}
                     </span>
                </div>
            ))}
        </div>
    )
}

export default RadioButton