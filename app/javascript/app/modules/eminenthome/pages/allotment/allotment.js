import React, {useState} from 'react';
import Analytics from "../../shared/analytics/analytics";
import AllotmentTable from "./components/allotmentTable";
import AllotAssign from "./components/Assign/allotAssign";


function Allotment({tabId}) {
    const [assignShow, setAssignShow] = useState(false);


    return (
        <div>
            {!assignShow ? (
                <div>
                    <Analytics tabId={tabId} assignShow={assignShow} />
                    <AllotmentTable setAssignShow={setAssignShow}/>
                </div>
            ) : (
                <AllotAssign setAssignShow={setAssignShow}/>
            )}
        </div>
    );
}


    export default Allotment;