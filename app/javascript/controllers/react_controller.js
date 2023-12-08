import {Controller} from "@hotwired/stimulus"
import React from "react";
import {createRoot} from "react-dom/client";
import AllotmentProvider from "../app/modules/eminentHome/pages/allotment/context/allotmentProvider";
import App from "../app/app";
import {BrowserRouter} from "react-router-dom";

export default class extends Controller {
    connect() {
        const app = document.getElementById("app");
        createRoot(app).render(
            <BrowserRouter>
            <AllotmentProvider>
            <App />
            </AllotmentProvider>
                
            </BrowserRouter>
        )
    }
}
