import React, {useContext, useEffect, useState} from "react";
import './loginpage.scss'
import {getLocationsData, sendOtp, validateOtp} from "../../api/stepperApiEndpoints/stepperapiendpoints";
import {enterPhoneNumber, showErrorToast, showSuccessToast} from "../utils";
import {useNavigate} from "react-router-dom";
import OrangeSideWall from "../../../../../public/images/saffron_bg 1.svg"
import {ApiContext} from "../ApiContext";
import PageDesign from '../../../../../public/images/saffron_bg 1.svg'

const LoginPage = () => {
    const {setAuthToken} = useContext(ApiContext)
    const navigate = useNavigate();
    const [inputNumber, setInputNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState()
    const inputMobileNumber = (event, isPhoneNumber) => {
        if (isPhoneNumber) {
            let Number = enterPhoneNumber(event)
            setInputNumber(Number);
        } else {
            setInputNumber(event.target.value)
        }
    }

    const sendSubmitOtp = (isPhoneNumber) => {
        return isPhoneNumber ? OtpSend() : submitOtp();
    }

    const OtpSend = () => {
            setPhoneNumber(inputNumber)
            sendOtp(inputNumber).then((res) => {
                setOtpSent(res.data.success)
                if (res.data.success) {
                    showSuccessToast(res.data.message)
                }
                setInputNumber('')
            })
    }



    const submitOtp = () => {
        validateOtp(phoneNumber, inputNumber).then((res) => {
            if (res.data.success) {
                showSuccessToast('OTP verified successfully')
            }
            localStorage.setItem('auth_token', res.data.auth_token)
            setAuthToken(res.data.auth_token)
            navigate({
                pathname: '/eminent_personality'
            });
        })
    }


    function handleEnterKeyPress(event) {
        if (event.key === "Enter") {
            if (otpSent) {
                if (inputNumber.length > 5) {
                    submitOtp();
                }
            } else {
                if (inputNumber.length > 9) {
                    OtpSend();
                }
            }
        }
    }

    return(
        <div className="container h-100 login-container d-flex">
            <PageDesign className='login-design' />
            <div className="row h-100 justify-content-center align-items-center">
                <div className="">
                    <div className="justify-content-start">
                        <label>{otpSent ? 'OTP':'Phone Number'}<span className="text-danger">*</span></label>
                        <input className="inputNumber ps-2"
                               autoFocus={true}
                               type="tel"
                               maxLength={otpSent ? 6 : 10}
                               value={inputNumber}
                               onKeyDown={handleEnterKeyPress}
                               placeholder={otpSent ? "Enter OTP" : "Enter Phone number"}
                               onChange={(e)=> inputMobileNumber(e, !otpSent)}/>
                    </div>
                    <div className="row h-100 justify-content-center align-items-center pt-2">
                        <button id="submit" className="btn btn-warning otpBtn" onClick={() => sendSubmitOtp(!otpSent)}>{otpSent ? 'Submit OTP' : 'Send OTP'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;
