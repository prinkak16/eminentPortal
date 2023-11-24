import React from 'react';
// import {Analytics} from "@mui/icons-material";
import Analytics from "../../shared/analytics/analytics";
import AllotmentTable from "./components/AllotmentTable";


function Allotment({tabId}){
    return(
        <div>
            <Analytics tabId={tabId} />
            <AllotmentTable />
        </div>
    )
}

export default Allotment;