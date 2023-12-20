import React, { useContext, useEffect, useState } from "react";
import Analytics from "../../shared/analytics/analytics";
import AllotmentTable from "./components/allotmentTable";
import AllotAssign from "./components/assign/allotAssign";
import AllotmentContext from "./context/allotmentContext";

function Allotment({ tabId, filterString }) {
  const [assignShow, setAssignShow] = useState(false);
  const { crumbsState } = useContext(AllotmentContext);

  const { setAssignBreadCrums } = useContext(AllotmentContext);

  useEffect(() => {
    setAssignShow(false);
  }, [crumbsState]);
  return (
    <div>
      {!assignShow ? (
        <div>
          <Analytics
            tabId={tabId}
            assignShow={assignShow}
            title="Position Analytics"
          />
          <AllotmentTable
            filterString={filterString}
            setAssignShow={setAssignShow}
          />
        </div>
      ) : (
        <AllotAssign setAssignShow={setAssignShow} filterString={filterString}/>
      )}
    </div>
  );
}

export default Allotment;
