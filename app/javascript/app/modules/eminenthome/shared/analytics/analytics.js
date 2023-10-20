import React, {useEffect, useState} from "react";
import "./analytics.css"
import Usergroup from "../../../../../../../public/images/usergroup.svg"
import CheckList from "./../../../../../../../public/images/checklist.svg"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IncompleteFile from './../../../../../../../public/images/incomplete.svg'
const Analytics = (props) => {
    const [analyticsHeading, setAnalyticsHeading] = useState('');
    const [cardLabel1, setCardLabel1] = useState('');
    const [cardLabel2, setCardLabel2] = useState('');
    const [cardLabel3, setCardLabel3] = useState('');
    const [showSeeMore, setShowSeeMore] = useState(false);


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

    return (
        <>
            <div className="analyticsDiv">
                <div className="headdiv">
                    <p className="analyticsHeading">{analyticsHeading}</p>
                </div>

                <div className="d-flex grid gap-0 column-gap-4 row me-5">
                    <div className="col">
                        <div className="card">
                            <div className="card-body d-flex p-0">
                                <div><p className="align-middle"><Usergroup/></p></div>
                                <div className="ms-4">
                                    <p className="cardlabel mb-0">{cardLabel1}</p>
                                    <p className="cardvalue">Value</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body p-0 d-flex">
                                <div><CheckList/></div>
                                <div className="ms-4">
                                    <p className="cardlabel mb-0">{cardLabel2}</p>
                                    <p className="cardvalue">Value</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body d-flex p-0">
                                <div><IncompleteFile /></div>
                                    <div className="ms-4">
                                        <p className="cardlabel mb-0">{cardLabel3}</p>
                                        <p className="cardvalue">Value</p>
                                    </div>
                            </div>
                        </div>
                    </div>
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
                    }                    {/*<Accordion>*/}
                    {/*    <div className="d-flex justify-content-end mt-3">*/}
                    {/*        <AccordionSummary>*/}

                    {/*        <Typography className='seemorebutton'>See More</Typography>*/}
                    {/*            <ExpandMoreIcon />*/}

                    {/*        </AccordionSummary>*/}
                    {/*    </div>*/}
                    {/*    <AccordionDetails>*/}
                    {/*        <Typography>*/}
                    {/*            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse*/}
                    {/*            malesuada lacus ex, sit amet blandit leo lobortis eget.*/}
                    {/*        </Typography>*/}
                    {/*    </AccordionDetails>*/}
                    {/*</Accordion>*/}
                </div>
            </div>
        </>
    )
}
export default Analytics;
