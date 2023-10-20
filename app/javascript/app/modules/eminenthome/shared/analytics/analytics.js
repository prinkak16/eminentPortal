import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg"
import CheckList from "./../../../../../../../public/images/checklist.svg"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IncompleteFile from './../../../../../../../public/images/incomplete.svg'
import {statsData} from "../../../../api/eminentapis/endpoints";
const Analytics = (props) => {
    const [analyticsHeading, setAnalyticsHeading] = useState('');
    const [cardLabel1, setCardLabel1] = useState('');
    const [cardLabel2, setCardLabel2] = useState('');
    const [cardLabel3, setCardLabel3] = useState('');
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [homeStats,setHomeStats] = useState([]);


    useEffect(() => {
        if(props.toggle===1){
            setAnalyticsHeading('Eminent Analytics')
            setCardLabel1('Total Eminent Personality')
            setCardLabel2('Total Completed Form')
            setCardLabel3('Total Incomplete Form')
        }
        else if(props.toggle===2){
            setAnalyticsHeading('Position Analytics')
            setCardLabel1('Total Slotted Psotion')
            setCardLabel2('Assigned')
            setCardLabel3('Yet to Assign')
        }
    }, [props.toggle]);

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
                    icon = <IncompleteFile />;
                    break;
                }
                case 'completed': {
                    label = 'Total Completed Form';
                    icon = <CheckList />;
                    break;
                }
                case 'overall': {
                    label = 'Total Eminent Personality';
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
