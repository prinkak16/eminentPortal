import {Button} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

const Savebtn=({handleSave, onClick})=>{
    const onClicked = () => {
        onClick()
    }
    return(<>
            <Button onClick={onClicked} disabled={handleSave} variant="text" endIcon={<InfoIcon/>}>Save Progress</Button>
        </>
    )

}
export  default  Savebtn;