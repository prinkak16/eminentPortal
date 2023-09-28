import {Button} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

const Savebtn=({handleSave})=>{
    return(<>
            <Button onClick={handleSave} variant="text" endIcon={<InfoIcon/>}>Save Progress</Button>
        </>
    )

}
export  default  Savebtn;