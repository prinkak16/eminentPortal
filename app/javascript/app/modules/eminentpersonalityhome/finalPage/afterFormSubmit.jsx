import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import './afterFormSubmit.scss'
import {ApiContext} from "../../ApiContext";
import {useNavigate} from "react-router-dom";

const AfterFormSubmit = () => {
    const {isCandidateLogin, setAuthToken,setEminentData} = useContext(ApiContext)
    const navigate = useNavigate();
    const goBack = () => {
        if (isCandidateLogin) {
            localStorage.setItem('auth_token', '')
            localStorage.setItem('eminent_number', '')
            localStorage.setItem('view_mode', '')
            setAuthToken('')
            setEminentData({})
        } else {
            navigate({
                pathname: '/'
            });
        }
    }
    return (
        <div className='submit-container'>
            <FontAwesomeIcon className='check-icon' icon={faCircleCheck} style={{color: "#43c767",}} />
            <span className='main-head'>Thank you for submitting!</span>
            <button className='go-back' onClick={goBack}>
                Go Back
            </button>
        </div>
    )
}

export default AfterFormSubmit