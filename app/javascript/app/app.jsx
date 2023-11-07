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
import GomPage from "./modules/GomPage/GomPage";

const BeforeLoginRoutes = () => {
    let candidate_login = document.getElementById('app').getAttribute('data-candidate-login');
   const candidateLoginRoutes =  <Routes>
                                            <Route path={'/'} element={<LoginPage/>}/>
                                            <Route path='/*' element={<Navigate to="/"/>}/>
                                         </Routes>

    const AdminLogin =   <Routes>
                                    <Route path='/' element={<HomePage/>}/>

                                    <Route path='/gom' element={<GomPage />}/>
                                   <Route path='/*' element={<Navigate to="/"/>}/>
                                  </Routes>
    return (

        candidate_login ? candidateLoginRoutes : AdminLogin
    )
}

const AfterLoginRoutes = () => {
    let candidate_login = document.getElementById('app').getAttribute('data-candidate-login');

    const candidateLoginRoutes = <Routes>
                                             <Route path='/eminent_personality' element={<EminentPersonality/>}/>
                                             <Route path='/*' element={<Navigate to="/eminent_personality"/>}/>
                                          </Routes>
    const AdminLogin = <Routes>
                                  <Route path='/' element={<HomePage/>}/>
                                  <Route path='/eminent_personality' element={<EminentPersonality/>}/>
                                  <Route path='/masterofvacancies' element={<MasterVacancies/>}/>
                                  <Route path='/*' element={<Navigate to="/"/>}/>


    </Routes>
    return (
        candidate_login ? candidateLoginRoutes : AdminLogin
        )
}

function App() {
    let candidate_login = document.getElementById('app').getAttribute('data-candidate-login');
    console.log(candidate_login)
    const [login ,setLogin] = useState(false)
    const [authToken, setAuthToken ] = useState(localStorage.getItem('auth_token'))
    const config = {
        headers: {
            'Authorization': authToken,
        }
    }
    return (
        <>
            <ApiContext.Provider  value={{config, setAuthToken}}>
                {isValuePresent(authToken) ?
                    <AfterLoginRoutes/> :
                    <BeforeLoginRoutes/>
                }
            </ApiContext.Provider>

        </>
    );
}

export default App;
