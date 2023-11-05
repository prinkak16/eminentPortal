import React from "react";
import {Route, Routes, redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import {Navigate} from "react-router";
import HomePage from "./modules/eminenthome/pages/homepage/homepage";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
import LoginPage from "./modules/./eminentlogin/loginpage";
import {isValuePresent} from "./modules/utils";


const BeforeLoginRoutes = () => {
    return (
        <Routes>
            <Route path={'/'} element={<LoginPage/>}/>
            <Route path='/*' element={<Navigate to="/"/>}/>
        </Routes>
    )
}

const AfterLoginRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/EminentPersonality' element={<EminentPersonality/>}/>
            <Route path='/*' element={<Navigate to="/"/>}/>
        </Routes>
    )
}

function App() {
    const authToken = localStorage.getItem('auth_token')


    return (
        <>
            {
                isValuePresent(authToken) ?
                    <AfterLoginRoutes /> :
                    <BeforeLoginRoutes />
            }
        </>
    );
}

export default App;
