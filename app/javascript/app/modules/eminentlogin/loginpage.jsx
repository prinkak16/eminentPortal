import React, {useContext, useEffect, useState} from "react";
import './loginpage.scss'
import {getLocationsData, sendOtp, validateOtp} from "../../api/stepperApiEndpoints/stepperapiendpoints";
import {enterPhoneNumber, showErrorToast, showSuccessToast} from "../utils";
import {useNavigate} from "react-router-dom";
import OrangeSideWall from "../../../../../public/images/saffron_bg 1.svg"
import BarImage from "../../../../../public/images/bar.svg"
import {ApiContext} from "../ApiContext";
import {Typography, TextField, Button} from "@mui/material";
import ModijiImage from "../../../../../public/images/Modiji-2.svg"
import NaddaImage from "../../../../../public/images/Naddaji.svg"
import OtpInput from 'react-otp-input';
const mobileRegex = /^[5-9]\d{0,9}$/;
const LoginPage = () => {

    const {setAuthToken} = useContext(ApiContext)
    const navigate = useNavigate();
    const [inputNumber, setInputNumber] = useState('');
    const [error, setError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inputOtp, setInputOtp] = useState('')
    const [otpSent, setOtpSent] = useState()
    const [otpField, setOtpField] = useState(false)


    const inputMobileNumber = (event) => {
        const mobileValue = event.target.value
        if (mobileRegex.test(mobileValue) && mobileValue[0] >= 5 && mobileValue.length <=10) {
            setInputNumber(mobileValue);
            setError('Mobile number should be 10 digits long.');
        }
        else if(mobileValue.length < 10  ) {
            setInputNumber('')
            setError('');
        }
        else if(mobileValue.length > 0  ) {
            setError('');
        }


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
            setOtpField(true)
        })
        setError('');

    }
    const resendOtp = () => {
        OtpSend()
    }

    function handleEnterKeyPress(event) {
        if (event.key === "Enter") {
            if (inputNumber.length > 9) {
                OtpSend();
            }
        }
    }

    const submitOtp = () => {
        validateOtp(phoneNumber, inputOtp).then((res) => {
            if (res.data.success) {
                showSuccessToast('OTP verified successfully')
                localStorage.setItem('auth_token', res.data.auth_token)
                setAuthToken(res.data.auth_token)
                navigate({
                    pathname: '/eminent_personality'
                });
            }
            else if (!res.data.success) {
                setOtpField(false);
                showErrorToast('OTP verification failed. Please try again.');
            }

        })
        setOtpField(true)
        setInputOtp('')
    }
    return(
        <>
            <div className="login-wrap">
                <div className="login-image">
                    <BarImage/>
                </div>
                <div className="container login-container d-flex justify-content-center">
                    <div className="col-md-6">
                        <div className="h-100 justify-content-center align-items-center">
                            <div className="login-form">
                                <Typography variant="h2" className=" text-center my-4">
                                    Eminent Personality
                                </Typography>
                                <div className="login-form-wrap">
                                    <Typography variant="h4">
                                        Login with Mobile Number
                                    </Typography>
                                    <div className="justify-content-start my-4 text-start number-filed">
                                        <TextField
                                            id="outlined-basic"
                                            label="Enter Phone Number"
                                            variant="outlined"
                                            className="inputNumber ps-2"
                                            autoFocus={true}
                                            type="tel"
                                            value={inputNumber}
                                            onKeyDown={handleEnterKeyPress}
                                            placeholder="Enter Phone number"
                                            onChange={(e) => inputMobileNumber(e)}
                                            helperText={error}
                                            error={Boolean(error)}
                                            maxLength={10}
                                        />
                                        {otpField && (
                                            <>
                                                <Typography variant="h6" className="mt-4 mb-1">
                                                    Enter 6 digit OTP
                                                </Typography>
                                                <div className="opt-flields px-1">
                                                    <OtpInput
                                                        inputType="tel"
                                                        value={inputOtp}
                                                        onChange={(otp) => inputMobileOtp(otp)}
                                                        numInputs={6}
                                                        renderInput={(props) => <input {...props} />}
                                                        shouldAutoFocus={true}
                                                    />
                                                </div>
                                                <div className="text-center mt-4 resend-button">
                                                    <Button onClick={resendOtp}>Re-Send OTP</Button>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                    <div className="row h-100 justify-content-center align-items-center pt-2">
                                        <button id="submit" className="btn btn-warning otpBtn"
                                                onClick={() => sendSubmitOtp(!inputOtp)}>
                                            {inputOtp && inputOtp.length === 6 ? 'Submit' : 'Send OTP'}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="login-govt-image left">
                <ModijiImage/>
            </div>
            <div className="login-govt-image right">
                <NaddaImage/>
            </div>
        </>

    )
}
export default LoginPage;
