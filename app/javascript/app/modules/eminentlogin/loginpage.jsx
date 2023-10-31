import React, {useEffect, useState} from "react";
import './loginpage.scss'

const LoginPage = () => {

    const [inputNumber, setInputNumber] = useState('');

    const inputMobileNumber = (number) => {
        setInputNumber(number.replace(/[^0-9]/g, ''));

    }

    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-3">
                        <div className="justify-content-start">
                        <label>Phone Number<span className="text-danger">*</span></label>
                        <input className="inputNumber ps-2"
                               type="tel"
                               maxLength={10}
                               value={inputNumber}
                               placeholder="Phone number"
                        onChange={(e)=> inputMobileNumber(e.target.value)}/>

                        </div>
                    <div className="row h-100 justify-content-center align-items-center pt-2">
                        {/*<div className="col-3">*/}
                          <button className="btn btn-warning otpBtn">Send Otp</button>
                        {/*</div>*/}
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default LoginPage;
