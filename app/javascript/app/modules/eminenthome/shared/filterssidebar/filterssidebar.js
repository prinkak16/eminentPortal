import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./filterssidebar.scss"

export default function FiltersSidebar() {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
const filtersResult = {
        "success": true,
        "data": {
        "filters": {
            "entry_type": {
                "type": "array",
                    "values": [
                    {
                        "value": 3,
                        "display_name": "Assam"
                    },
                    {
                        "value": 4,
                        "display_name": "Bihar"
                    },
                    {
                        "value": 30,
                        "display_name": "Delhi"
                    }
                ]
            },
            "channel": {
                "type": "array",
                    "values": [
                    {
                        "value": "Office",
                        "display_name": "Office"
                    },
                    {
                        "value": "Link",
                        "display_name": "Link"
                    }
                ]
            },
            "age_group": {
                "type": "array",
                    "values": [
                    {
                        "value": "age_18_to_25",
                        "display_name": "18-25"
                    },
                    {
                        "value": "age_25_to_30",
                        "display_name": "25-30"
                    },
                    {
                        "value": "age_30_to_35",
                        "display_name": "30-35"
                    },
                    {
                        "value": "age_35_to_40",
                        "display_name": "35-40"
                    },
                    {
                        "value": "age_40_to_45",
                        "display_name": "40-45"
                    },
                    {
                        "value": "age_45_to_50",
                        "display_name": "45-50"
                    },
                    {
                        "value": "age_50_to_65",
                        "display_name": "50-65"
                    },
                    {
                        "value": "age_greater_65",
                        "display_name": "65+"
                    }
                ]
            },
            "form_status": {
                "type": "array",
                    "values": [
                    {
                        "value": "pending",
                        "display_name": "Pending"
                    },
                    {
                        "value": "otp_verified",
                        "display_name": "OTP Verified"
                    },
                    {
                        "value": "incomplete",
                        "display_name": "Incomplete"
                    },
                    {
                        "value": "submitted",
                        "display_name": "Submitted"
                    },
                    {
                        "value": "rejected",
                        "display_name": "Re-edit"
                    },
                    {
                        "value": "approved",
                        "display_name": "Freeze"
                    }
                ]
            },
            "education": {
                "type": "array",
                    "values": [
                    {
                        "value": "Less than 10th",
                        "display_name": "Less than 10th"
                    },
                    {
                        "value": "10th Pass",
                        "display_name": "10th Pass"
                    },
                    {
                        "value": "12th Pass",
                        "display_name": "12th Pass"
                    },
                    {
                        "value": "Graduate",
                        "display_name": "Graduate"
                    },
                    {
                        "value": "Post Graduate",
                        "display_name": "Post Graduate"
                    },
                    {
                        "value": "Diploma/ITI",
                        "display_name": "Diploma/ITI"
                    },
                    {
                        "value": "PhD and Above",
                        "display_name": "PhD and Above"
                    }
                ]
            },
            "gender": {
                "type": "array",
                    "values": [
                    {
                        "value": "Male",
                        "display_name": "Male"
                    },
                    {
                        "value": "Female",
                        "display_name": "Female"
                    },
                    {
                        "value": "Others",
                        "display_name": "Others"
                    }
                ]
            },
            "profession": {
                "type": "array",
                    "values": [
                    {
                        "value": "Teacher",
                        "display_name": "Teacher"
                    },
                    {
                        "value": "Doctor",
                        "display_name": "Doctor"
                    },
                    {
                        "value": "Chartered Accountant",
                        "display_name": "Chartered Accountant"
                    },
                    {
                        "value": "Homemaker/Housewife",
                        "display_name": "Homemaker/Housewife"
                    },
                    {
                        "value": "Politician",
                        "display_name": "Politician"
                    },
                    {
                        "value": "Industrialist",
                        "display_name": "Industrialist"
                    },
                    {
                        "value": "Engineer",
                        "display_name": "Engineer"
                    },
                    {
                        "value": "Private Sector - Corporate jobs",
                        "display_name": "Private Sector - Corporate jobs"
                    },
                    {
                        "value": "Public sector - Government jobs",
                        "display_name": "Public sector - Government jobs"
                    },
                    {
                        "value": "Advocate / Judge",
                        "display_name": "Advocate / Judge"
                    },
                    {
                        "value": "Business / Self-employed",
                        "display_name": "Business / Self-employed"
                    },
                    {
                        "value": "NGO / Trustee / Social Work",
                        "display_name": "NGO / Trustee / Social Work"
                    },
                    {
                        "value": "Farmer - Agriculture",
                        "display_name": "Farmer - Agriculture"
                    },
                    {
                        "value": "Armed forces / Ex-Armed forces",
                        "display_name": "Armed forces / Ex-Armed forces"
                    },
                    {
                        "value": "Artists - Actor/Writer/Musician",
                        "display_name": "Artists - Actor/Writer/Musician"
                    },
                    {
                        "value": "Journalists and media related worker",
                        "display_name": "Journalists and media related worker"
                    },
                    {
                        "value": "Sports and fitness worker",
                        "display_name": "Sports and fitness worker"
                    },
                    {
                        "value": "Other / Workers not Classified by Occupations",
                        "display_name": "Other / Workers not Classified by Occupations"
                    },
                    {
                        "value": "Student",
                        "display_name": "Student"
                    },
                    {
                        "value": "Other Retired Servicemen",
                        "display_name": "Other Retired Servicemen"
                    },
                    {
                        "value": "Religious Worker",
                        "display_name": "Religious Worker"
                    },
                    {
                        "value": "Scientists",
                        "display_name": "Scientists"
                    },
                    {
                        "value": "Police",
                        "display_name": "Police"
                    },
                    {
                        "value": "Shopkeepers",
                        "display_name": "Shopkeepers"
                    },
                    {
                        "value": "Street Vendors",
                        "display_name": "Street Vendors"
                    },
                    {
                        "value": "Mechanic",
                        "display_name": "Mechanic"
                    },
                    {
                        "value": "Labourers or daily wage worker",
                        "display_name": "Labourers or daily wage worker"
                    }
                ]
            },
            "category": {
                "type": "array",
                    "values": [
                    {
                        "value": "GEN",
                        "display_name": "GEN"
                    },
                    {
                        "value": "OBC",
                        "display_name": "OBC"
                    },
                    {
                        "value": "SC",
                        "display_name": "SC"
                    },
                    {
                        "value": "ST",
                        "display_name": "ST"
                    },
                    {
                        "value": "Minority",
                        "display_name": "Minority"
                    },
                    {
                        "value": "Gen",
                        "display_name": "Gen"
                    },
                    {
                        "value": "Others",
                        "display_name": "Others"
                    }
                ]
            }
        }
    },
        "message": "User Assigned States"
    };

    return (
        <div>
            <Accordion className="accordian " expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className="filterType ms-2">
                    Entry Type
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                       <p><input type="checkbox" name="entryTypeAll" />
                           All
                       </p>
                        <p><input type="checkbox" name="entryTypeNational"/>
                            National
                        </p>
                        <p><input type="checkbox" name="entryTypeState"/>
                            State
                        </p>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className="filterType ms-2">Channel</Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox" name="channelall"/>
                            All
                        </p>
                        <p><input type="checkbox" name="channelnational"/>
                            Office
                        </p>
                        <p><input type="checkbox" name="channelstate"/>
                            Link
                        </p>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className="filterType ms-2">
                        Age Group
                    </Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox"/>
                            25-30
                        </p>
                        <p><input type="checkbox"/>
                            30-45
                        </p>
                        <p><input type="checkbox"/>
                            45-50
                        </p>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian " expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography className="filterType ms-2">Form Status</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox" name="formStatusNone"/>
                            None
                        </p>
                        <p><input type="checkbox" name="formStatusPending"/>
                            Pending
                        </p>
                        <p><input type="checkbox" name="formStatusOtpVerified"/>
                            OTP Verified
                        </p>
                        <p><input type="checkbox" name="formStatusIncomplete"/>
                            Incomplete
                        </p>
                        <p><input type="checkbox" name="formStatusSubmitted"/>
                            Submitted
                        </p>
                        <p><input type="checkbox" name="formStatusReedit"/>
                            Re-Edit
                        </p>
                        <p><input type="checkbox" name="formStatusFreeze"/>
                            Freeze
                        </p>

                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5bh-content"
                    id="panel4bh-header"
                >
                    <Typography className="filterType ms-2">Qualification</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox" name="qualPhd"/>
                            Ph.D
                        </p>
                        <p><input type="checkbox" name="qualPostGrad"/>
                            Post-Graduation
                        </p>
                        <p><input type="checkbox" name="qualGrad"/>
                            Graduation
                        </p>
                        <p><input type="checkbox" name="qual12th"/>
                            12th
                        </p>
                        <p><input type="checkbox" name="qual10th"/>
                            10th
                        </p>
                        <p><input type="checkbox" name="qualGreaterThan10th"/>
                            &#60;10th
                        </p>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel6bh-content"
                    id="panel4bh-header"
                >
                    <Typography className="filterType ms-2">Gender</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox" name="genderMale"/>
                            Male
                        </p>
                        <p><input type="checkbox" name="genderFemale"/>
                            Female
                        </p>


                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel7bh-content"
                    id="panel4bh-header"
                >
                    <Typography className="filterType ms-2">Profession</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <input type="text" placeholder="Search" className="form-control mb-2"/>
                        <p><input type="checkbox" name="professionAll"/>
                            All
                        </p>
                        <p><input type="checkbox" name="professionCACS"/>
                            CA/CS/ICWA
                        </p>
                        <p><input type="checkbox" name="professionTrader"/>
                            Trader
                        </p>
                        <p><input type="checkbox" name="professionLawyer"/>
                            Lawyer
                        </p>

                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className="accordian" expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel8bh-content"
                    id="panel4bh-header"
                >
                    <Typography className="filterType ms-2">Category</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className="ms-2 filterTypeOptions">
                        <p><input type="checkbox" name="categoryOBC"/>
                            OBC
                        </p>
                        <p><input type="checkbox" name="categoryGEN"/>
                            GEN
                        </p>
                        <p><input type="checkbox" name="categorySC"/>
                            SC
                        </p>
                        <p><input type="checkbox" name="categoryST"/>
                            ST
                        </p>


                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}