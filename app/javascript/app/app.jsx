import React, {useEffect, useState} from "react";
import {Route, Routes, redirect, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import {Navigate} from "react-router";
import HomePage from "./modules/eminentHome/pages/homepage/homepage";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
import LoginPage from "./modules/./eminentlogin/loginpage";
import MasterVacancies from "./modules/eminentHome/pages/masterofvacancies/masterVacancies";
import {isValuePresent} from "./modules/utils";
import {ApiContext} from "./modules/ApiContext";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GomPage from "../app/modules/eminentHome/pages/gom/gomPage/gomPage";
import Allotment from "./modules/eminentHome/pages/allotment/allotment";
import BackDrop from "./modules/eminentpersonalityhome/component/back-drop/backDrop";
import AllotAssign from "../app/modules/eminentHome/pages/allotment/components/assign/allotAssign";
import AfterFormSubmit from "./modules/eminentpersonalityhome/finalPage/afterFormSubmit";
import Header from "./modules/eminentpersonalityhome/header/header";
import {eminentAdminDetails, getLocationsData} from "./api/stepperApiEndpoints/stepperapiendpoints";
import ProfilePage from "./modules/eminentHome/pages/profile/profilePage";

const beforeLoginRoutes = (
    <Routes>
        <Route path={"/"} element={<LoginPage/>}/>
        <Route path="/*" element={<Navigate to="/"/>}/>
    </Routes>
);
const afterLoginRoutes = (
    <Routes>
        <Route path="/eminent_personality" element={<EminentPersonality/>}/>
        <Route path="/*" element={<Navigate to="/eminent_personality"/>}/>
        <Route path="/form_submitted" element={<AfterFormSubmit/>}/>
    </Routes>
);

const adminRoutes = (
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/:type" element={<HomePage/>}/>
        <Route path="/eminent_form" element={<EminentPersonality/>}/>
        <Route path="/masterofvacancies" element={<MasterVacancies/>}/>
        <Route path="/gom" element={<GomPage/>}/>
        <Route path="/allotment/assign" element={<AllotAssign/>}/>
        <Route path="/form_submitted" element={<AfterFormSubmit/>}/>
        <Route path="/*" element={<Navigate to="/"/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
    </Routes>
);

function App() {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("auth_token")
    );
    let isCandidateLogin = JSON.parse(
        document.getElementById("app").getAttribute("data-candidate-login")
    );
    const [backDropToggle, setBackDropToggle] = useState(false);
    const [userData, setUserData] = useState()
    const [ resetFilter, setResetFilter] = useState(false)
    const [eminentData, setEminentData] = useState()
    const config = {
        headers: {
            Authorization: authToken,
        },
    };

    const routesOfProjects = () => {
        return isCandidateLogin
            ? isValuePresent(authToken)
                ? afterLoginRoutes
                : beforeLoginRoutes
            : adminRoutes;
    };

    useEffect(() => {
        if (!isCandidateLogin) {
            eminentAdminDetails().then((res) => {
                setUserData(res.data.data)
            })
        }
    }, []);
    return (
        <>
            <ToastContainer/>
            <BackDrop toggle={backDropToggle}/>
            <ApiContext.Provider
                value={{
                    config,
                    setAuthToken,
                    isCandidateLogin,
                    setBackDropToggle,
                    backDropToggle,
                    userData,
                    setUserData,
                    eminentData,
                    setEminentData,
                    resetFilter,
                    setResetFilter
                }}
            >
                {isCandidateLogin ? isValuePresent(authToken) ? <Header userData={eminentData}/> : null :
                    <Header userData={userData}/>}
                {routesOfProjects()}
            </ApiContext.Provider>
        </>
    );
}

export default App;
