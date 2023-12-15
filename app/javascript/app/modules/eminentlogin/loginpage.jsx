import React, {useContext, useEffect, useState} from "react";
import './loginpage.scss'
import {getLocationsData, sendOtp, validateOtp} from "../../api/stepperApiEndpoints/stepperapiendpoints";
import {enterPhoneNumber, showErrorToast, showSuccessToast} from "../utils";
import {useNavigate} from "react-router-dom";
import OrangeSideWall from "../../../../../public/images/saffron_bg 1.svg"
import BarImage from "../../../../../public/images/bar.svg"
import {ApiContext} from "../ApiContext";
import {Typography, TextField, Button} from "@mui/material";
import OtpInput from 'react-otp-input';
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

    const inputMobileOtp = (otp) => {
        setInputOtp(otp)
    }

    const sendSubmitOtp = (isPhoneNumber) => {
        return isPhoneNumber ? OtpSend() : submitOtp();
    }

    const OtpSend = () => {
            setPhoneNumber(inputNumber)
            sendOtp(inputNumber).then((res) => {
                if (res.data.success) {
                    showSuccessToast(res.data.message)
                }
            })
        setOtpField(true)
    }
const resendOtp = () => {
    OtpSend()
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

    console.log('inputOtp', inputOtp)
     // function  handleOtpEnterKeyPress(event){
     //     if (event.key === "Enter") {
     //             if (inputOtp.length > 5) {
     //                 submitOtp();
     //             }
     //     }
     // }

    return(
        <div className="login-wrap">
            <div className="login-image">
               <BarImage/>
            </div>
            <div className="container h-100 login-container d-flex justify-content-center">
                <div className="col-md-6">
                    <div className="h-100 justify-content-center align-items-center">
                        <div className="login-form">
                            <Typography variant="h2" className=" text-center my-4">
                                Eminent Personality
                            </Typography>
                            <div className="login-form-wrap">
                                <Typography variant="h4" >
                                    Login with Mobile Number
                                </Typography>
                                <div className="justify-content-start my-4 text-start number-filed">
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
                                            <div className="opt-flields px-1">
                                                <OtpInput
                                                    value={inputOtp}
                                                    onChange={(otp) => inputMobileOtp(otp)}
                                                    numInputs={6}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>
                                            <div className="text-center mt-4 resend-button">
                                                <Button onClick={resendOtp}>Re-Send OTP</Button>
                                            </div>
                                        </>
                                    )}

                                </div>
                                <div className="row h-100 justify-content-center align-items-center pt-2">
                                    <button id="submit" className="btn btn-warning otpBtn" onClick={() => sendSubmitOtp(!inputOtp)}>
                                        { inputOtp.length === 6 ? 'Submit' : 'Send OTP'}
                                    </button>
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
