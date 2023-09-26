import React from "react";
import {Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import {Navigate} from "react-router";
import HomeComponent from "./modules/home/home.component";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
function App() {

    return (
        <>
            <Routes>
                <Route path='/*' element={<Navigate to="/"/>}/>
                <Route path='/' element={<HomeComponent/>}/>
                <Route path='/ep' element={<EminentPersonality/>}/>
            </Routes>
        </>
    );
}

export default App;
