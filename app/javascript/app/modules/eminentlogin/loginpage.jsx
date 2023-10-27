import React, {useEffect, useState} from "react";
import './loginpage.scss'

const LoginPage = () => {

    const [inputNumber, setInputNumber] = useState('');

    useEffect(() => {
        setInputNumber(number.replace(/[^0-9]/g, ''));
        }, [inputNumber]);
    return(
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-6">
                    <div className="text-center">
                        <div>
                        <label>Mobile Number<span className="text-danger">*</span></label>
                        <input className="inputNumber ps-2"
                               type="tel"
                               maxLength={10}
                               // value={inputNumber}
                               placeholder="Phone number"/>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;
