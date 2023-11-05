import React, {useEffect, useState} from "react";
import './loginpage.scss'
import {getLocationsData, sendOtp, validateOtp} from "../../api/stepperApiEndpoints/stepperapiendpoints";
import {enterPhoneNumber} from "../utils";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
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
                setInputNumber('')
            })
    }



    const submitOtp = () => {
        validateOtp(phoneNumber, inputNumber).then((res) => {
            localStorage.setItem('auth_token', res.data.auth_token)
            navigate('/homePage')
            console.log(res.data)

        })
    }

    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-3">
                        <div className="justify-content-start">
                        <label>{otpSent ? 'Otp':'Phone Number'}<span className="text-danger">*</span></label>
                        <input className="inputNumber ps-2"
                               type="tel"
                               maxLength={otpSent ? 6 : 10}
                               value={inputNumber}
                               placeholder={otpSent ? "Enter Otp" : "Enter Phone number"}
                        onChange={(e)=> inputMobileNumber(e, !otpSent)}/>
                        </div>
                    <div className="row h-100 justify-content-center align-items-center pt-2">
                          <button className="btn btn-warning otpBtn" onClick={() => sendSubmitOtp(!otpSent)}>{otpSent ? 'Submit Otp' : 'Send Otp'}</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default LoginPage;
