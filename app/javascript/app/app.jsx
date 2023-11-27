import React, {useState} from "react";
import {Route, Routes, redirect, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import {Navigate} from "react-router";
import HomePage from "./modules/eminenthome/pages/homepage/homepage";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
import LoginPage from "./modules/./eminentlogin/loginpage";
import MasterVacancies from "./modules/eminenthome/pages/masterofvacancies/masterofvacancies";
import {isValuePresent} from "./modules/utils";
import {ApiContext} from "./modules/ApiContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GomPage from "./modules/./eminenthome/pages/GOM/GomPage/GomPage";
import BackDrop from "./modules/eminentpersonalityhome/component/back-drop/backDrop";

const beforeLoginRoutes =  <Routes>
                                        <Route path={'/'} element={<LoginPage/>}/>
                                        <Route path='/*' element={<Navigate to="/"/>}/>
                                   </Routes>
const afterLoginRoutes = <Routes>
                                     <Route path='/eminent_personality' element={<EminentPersonality/>}/>
                                     <Route path='/*' element={<Navigate to="/eminent_personality"/>}/>
                                </Routes>

const adminRoutes = <Routes>
                                <Route path='/' element={<HomePage/>}/>
                                <Route path='/eminent_form' element={<EminentPersonality/>}/>
                                <Route path='/masterofvacancies' element={<MasterVacancies/>}/>
                                <Route path='/gom' element={<GomPage />}/>
                                <Route path='/*' element={<Navigate to="/"/>}/>
                            </Routes>



function App() {
    const [authToken, setAuthToken ] = useState(localStorage.getItem('auth_token'))
    let isCandidateLogin = JSON.parse(document.getElementById('app').getAttribute('data-candidate-login'));
    const [backDropToggle, setBackDropToggle] = useState(false)
    const config = {
        headers: {
            'Authorization': authToken,
        }
    }

    const routesOfProjects = () => {
        return  isCandidateLogin ? isValuePresent(authToken) ? afterLoginRoutes : beforeLoginRoutes : adminRoutes
    }

    return (
        <>
            <ToastContainer />
            <BackDrop toggle={backDropToggle}/>
            <ApiContext.Provider  value={{config, setAuthToken, isCandidateLogin, setBackDropToggle, backDropToggle}}>
                {routesOfProjects()}
            </ApiContext.Provider>

        </>
    );
}

export default App;
