import React, {useState} from 'react';
import Analytics from "../../shared/analytics/analytics";
import AllotmentTable from "./components/allotmentTable";
import AllotAssign from "./components/assign/allotAssign";


function Allotment({tabId, filterString}) {
    const [assignShow, setAssignShow] = useState(false);


    return (
        <div>
            {!assignShow ? (
                <div>
                    <Analytics tabId={tabId} assignShow={assignShow} title="Allotment Analytics" />
                    <AllotmentTable filterString={filterString} setAssignShow={setAssignShow}/>
                </div>
            ) : (
                <AllotAssign setAssignShow={setAssignShow}/>
            )}
        </div>
    );
}


    export default Allotment;