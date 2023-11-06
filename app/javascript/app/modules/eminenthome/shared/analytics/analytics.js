import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg"
import CheckList from "./../../../../../../../public/images/checklist.svg"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IncompleteFile from './../../../../../../../public/images/incomplete.svg'
import {statsData} from "../../../../api/eminentapis/endpoints";
const Analytics = (props) => {
    const {analyticsHeading, icon, label} = props
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
                    switch (props.tabId) {
                        case '1':
                            label = 'Total Eminent Personality';
                            break;
                        case '2':
                            label = 'Total Position';
                            break;
                    }
                    icon = <IncompleteFile />;
                    break;
                }
                case 'completed': {
                    switch (props.tabId) {
                        case '1':
                            label = 'Total Completed Form';
                            break;
                        case '2':
                            label = 'Occupied';
                            break;
                    }
                    icon = <CheckList />;
                    break;
                }
                case 'overall': {
                    switch (props.tabId) {
                        case '1':
                            label = 'Total incompleted Form';
                            break;
                        case '2':
                            label = 'Vacant';
                            break;
                    }
                    icon = <Usergroup />;
                    break;
                }


            }
           return <div className="col">
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
                    <p className="analyticsHeading">{analyticsHeading}</p>
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
