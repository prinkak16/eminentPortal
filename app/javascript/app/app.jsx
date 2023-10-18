import React from "react";
import {Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.scss';
import HomePage from "./modules/eminenthome/pages/homepage";
function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
            </Routes>
        </>
    );
}
export default App;
