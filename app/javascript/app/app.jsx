import React from "react";
import {Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';
import {Navigate} from "react-router";
import HomePage from "./modules/eminenthome/pages/homepage/homepage";
import EminentPersonality from "./modules/eminentpersonalityhome/EminentPersonalityhome";
function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/*' element={<Navigate to="/"/>}/>
                {/*<Route path='/' element={<HomeComponent/>}/>*/}
                <Route path='/EminentPersonality' element={<EminentPersonality/>}/>
            </Routes>
        </>
    );
}
export default App;
