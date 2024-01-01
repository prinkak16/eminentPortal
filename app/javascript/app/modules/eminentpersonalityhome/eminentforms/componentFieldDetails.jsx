import * as React from "react";
import {Button, Grid, Paper, Typography} from "@mui/material";
import {componentsFieldHeaders, isValuePresent} from "../../utils";
import {useState} from "react";
import "./componentFieldDetails.css"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';

const ComponentFieldDetails = ({data, type, disabled,  editForm, deleteFields}) => {
    const headers = componentsFieldHeaders[type]
    const [showAll, setShowAll] =useState(false)
    const [showList, setShowList] = useState()
    const openList = (id) => {
        if (showList === id) {
            setShowList(null)
        } else {
            setShowList(id)
        }
    }
    const dt = [
        {
            "id": "f09456af-5592-4ee4-af61-38e32fb26884",
            "course": "COurse",
            "college": "hbhjbbhj",
            "end_year": 2015,
            "start_year": 2001,
            "university": "jhbh",
            "qualification": "Diploma/ITI",
            "highest_qualification": false
        },
        {
            "id": "f09456af-5592-4ee4-af61-38e32fb26884",
            "course": "COurse",
            "college": "hbhjbbhj",
            "end_year": 2015,
            "start_year": 2001,
            "university": "jhbh",
            "qualification": "Diploma/ITI",
            "highest_qualification": false
        }
    ]
    return (
        <Grid className="main-container">
            {dt && dt.map((item, i) => (
                <div>
                    {i === 0 || showAll ?
                        <Grid container spacing={2} className="d-flex">
                            <Grid xs={11} className="details-container">
                                {isValuePresent(headers) && Object.keys(headers).map((header, i) => (
                                    <Grid className="d-flex gap-2">
                                       <span className=" min-wid-11 header">{headers[header]}</span>
                                       <span className="header-value">{item[header]}</span>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid xs={1}>
                                <div className='edit-button-logo' id='list-container'>
                                    <Button id='list-icon-button' disabled={disabled}
                                            onClick={() => openList(item.id)}
                                            className="bg-transparent text-black display-contents">
                                        <MoreVertIcon id='list-icon'/>
                                    </Button>
                                    {showList === item.id && (
                                        <Paper className='details-edit-list'>
                                            <Typography sx={{p: 2}} className='details-edit-buttons'
                                                        onClick={() => editForm(type, item.id)}><FontAwesomeIcon icon={["fas", "pencil"]}  className="details-edit-button-icons"/>Edit</Typography>
                                            <Typography onClick={() => deleteFields(type, item.id)}
                                                        className='details-edit-buttons'
                                                        sx={{p: 2}}><DeleteIcon style={{width: '0.7rem'}}/>Delete</Typography>
                                        </Paper>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                        : null
                    }
                </div>
            ))}
            <div className="d-flex">
                <span className="details-length" onClick={() => setShowAll(!showAll)}> {showAll ? "Close" :
                    <span>+{dt.length - 1} more {type}</span>}</span>
            </div>
        </Grid>
    )
}

export default ComponentFieldDetails