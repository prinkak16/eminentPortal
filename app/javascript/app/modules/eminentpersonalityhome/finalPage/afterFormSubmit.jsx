import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import './afterFormSubmit.scss'
import {ApiContext} from "../../ApiContext";
import {useNavigate} from "react-router-dom";

const AfterFormSubmit = () => {
    const {isCandidateLogin, setAuthToken} = useContext(ApiContext)
    const navigate = useNavigate();
    const goBack = () => {
        if (isCandidateLogin) {
            localStorage.setItem('auth_token', '')
            setAuthToken('')
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
            <span className='sub-head'>Your detail added in the record</span>
            <button className='go-back' onClick={goBack}>
                Go Back
            </button>
        </div>
    )
}

export default AfterFormSubmit