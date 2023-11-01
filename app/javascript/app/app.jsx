import React from "react";
import {Route, Routes, redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import {Navigate} from "react-router";
import HomePage from "./modules/eminenthome/pages/homepage/homepage";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
import LoginPage from "./modules/./eminentlogin/loginpage";
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/*' element={<Navigate to="/"/>}/>
                {/*<Route path='/' element={<HomeComponent/>}/>*/}
                <Route path='/EminentPersonality' element={<EminentPersonality/>}/>
                <Route path={'/Login'} element={<LoginPage/>}/>
            </Routes>
        </>
    );
}
export default App;
