import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import './afterFormSubmit.scss'

const AfterFormSubmit = () => {

    return (
        <div className='submit-container'>
            <FontAwesomeIcon icon={faCircleCheck} style={{color: "#43c767",}} />
            <h1>Thank you for submitting!</h1>
            <h6>Your detail added in the record</h6>
            <button>Go Back</button>
        </div>
    )
}

export default AfterFormSubmit