import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg";
import Checklist from "./../../../../../../../public/images/checklist.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Incompletefile from './../../../../../../../public/images/incomplete.svg';
import iconUrl from './../../../../../../../public/images/plus.svg';
import {statsData} from "../../../../api/eminentapis/endpoints";
const Analytics = (props) => {

    const [showSeeMore, setShowSeeMore] = useState(false);
    const [homeStats,setHomeStats] = useState([]);



    useEffect(()=>{
        statsData().then(res=> {
            setHomeStats(res.data.data);
        })

    },[])

    const createAnalyticCard = () => {
        return Object.keys(homeStats).map(value=>{
            let label = '';
            let icon = null;
            switch (value) {
                case 'incomplete': {
                    label = 'Total Incomplete Form';
                    icon = <Incompletefile />;
                    break;
                }
                case 'completed': {
                    label = 'Total Completed Form';
                    icon = <Checklist />;
                    break;
                }
                case 'overall': {
                    label = 'Total Eminent Personality';
                    icon = <Usergroup />;
                    break;
                }
            }
            return <div className="col" key={value}>
               <div className="card">
                   <div className="card-body d-flex p-0">
                       <div><p className="align-middle">{icon}</p></div>
                       <div className="ms-4">
                           <p className="cardlabel mb-0">{label}</p>
                           <p className="cardvalue">{homeStats[value]}</p>
                       </div>
                   </div>
               </div>
           </div>
        })
    }

    return (
        <>
            <div className="analyticsDiv">
                <div className="headdiv">
                    <p className="analyticsHeading">Eminent Analytics</p>
                </div>

                <div className="d-flex grid gap-0 column-gap-4 row me-5">
                    {createAnalyticCard()}
                </div>
                <div>

                    <div onClick={()=> setShowSeeMore(!showSeeMore)} className='d-flex mt-3 justify-content-end'>
                        <p className="seemorebutton">See More</p>
                    <ExpandMoreIcon className='expandicon'/>
                    </div>

                    { showSeeMore &&
                        <div className="card seemorecard">
                           <div className="card-body"> More Analytics </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default Analytics;
