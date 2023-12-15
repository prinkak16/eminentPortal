import React, {useContext, useEffect, useState} from "react";
import './loginpage.scss'
import {getLocationsData, sendOtp, validateOtp} from "../../api/stepperApiEndpoints/stepperapiendpoints";
import {enterPhoneNumber, showErrorToast, showSuccessToast} from "../utils";
import {useNavigate} from "react-router-dom";
import OrangeSideWall from "../../../../../public/images/saffron_bg 1.svg"
import {ApiContext} from "../ApiContext";
import PageDesign from '../../../../../public/images/saffron_bg 1.svg'
import {Typography, TextField, Button} from "@mui/material";

const LoginPage = () => {
    const {setAuthToken} = useContext(ApiContext)
    const navigate = useNavigate();
    const [inputNumber, setInputNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inputOtp, setInputOtp] = useState('')
    const [otpSent, setOtpSent] = useState()
    const [otpField, setOtpField] = useState(false)
    const inputMobileNumber = (event) => {
        setInputNumber(event.target.value)
    }

    const inputMobileOtp = (event) => {
        setInputOtp(event.target.value)
    }

    const sendSubmitOtp = (isPhoneNumber) => {
        return isPhoneNumber ? OtpSend() : submitOtp();
    }

    const OtpSend = () => {
            setPhoneNumber(inputNumber)
            sendOtp(inputNumber).then((res) => {
                setInputNumber(res.data.success)
                if (res.data.success) {
                    showSuccessToast(res.data.message)
                }
                setInputNumber('')
            })
        setOtpField(true)
    }

    const submitOtp = () => {
        validateOtp(phoneNumber, inputOtp).then((res) => {
            if (res.data.success) {
                showSuccessToast('OTP verified successfully')
            }
            localStorage.setItem('auth_token', res.data.auth_token)
            setAuthToken(res.data.auth_token)
            navigate({
                pathname: '/eminent_personality'
            });
        })
        setOtpField(false)
    }
    function handleEnterKeyPress(event) {
        if (event.key === "Enter") {
                if (inputNumber.length > 9) {
                    OtpSend();
                }
        }
    }

     function  handleOtpEnterKeyPress(event){
         if (event.key === "Enter") {
                 if (inputOtp.length > 5) {
                     submitOtp();
                 }
         }
     }

    return(
        <div className="login-wrap">
            <div className="login-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="86" viewBox="0 0 1440 86" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M0 35.6L48.4324 25.52C96.8649 15.44 193.73 -4.71999 290.595 0.32C387.459 5.36 484.324 35.6 581.189 55.76C678.054 75.92 774.919 86 871.784 86C968.649 86 1065.51 75.92 1162.38 58.28C1259.24 40.64 1356.11 15.44 1404.54 2.84L1452.97 -9.75999V-40H1404.54C1356.11 -40 1259.24 -40 1162.38 -40C1065.51 -40 968.649 -40 871.784 -40C774.919 -40 678.054 -40 581.189 -40C484.324 -40 387.459 -40 290.595 -40C193.73 -40 96.8649 -40 48.4324 -40H0V35.6Z"
                          fill="#FF9559"/>
                </svg>
            </div>
            <div className="container h-100 login-container d-flex justify-content-center">
                <div className="col-md-8">
                    <div className="h-100 justify-content-center align-items-center">
                        <div className="login-form">
                            <Typography variant="h2" className=" text-center my-4">
                                Eminent Personality form
                            </Typography>
                            <div className="login-form-wrap">
                                <Typography variant="h4" >
                                    Login with Mobile Number
                                </Typography>
                                <div className="justify-content-start my-4 text-start">
                                    <TextField id="outlined-basic" label="Enter Phone Number" variant="outlined" className="inputNumber ps-2" autoFocus={true} type="tel"
                                               maxLength={10}
                                               value={inputNumber}
                                               onKeyDown={handleEnterKeyPress}
                                               placeholder= "Enter Phone number"
                                               onChange={(e)=> inputMobileNumber(e)}
                                    />
                                    {otpField && (
                                        <>
                                            <Typography variant="h6" className="mt-4 mb-1">
                                                Enter 6 digit OTP
                                            </Typography>
                                            <TextField id="outlined-basic"  variant="outlined" className="inputNumber ps-2" autoFocus={true} type="tel"
                                                       maxLength={ 6}
                                                       value={inputOtp}
                                                       onKeyDown={handleOtpEnterKeyPress}
                                                       placeholder="Enter OTP"
                                                       onChange={(e)=> inputMobileOtp(e)}
                                            />
                                            <div className="text-center mt-4">
                                                <Button>Re-Send OTP</Button>
                                            </div>
                                        </>
                                    )}

                                </div>
                                <div className="row h-100 justify-content-center align-items-center pt-2">
                                    <button id="submit" className="btn btn-warning otpBtn" onClick={() => sendSubmitOtp(!otpSent)}>{otpSent ? 'Submit OTP' : 'Send OTP'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;
