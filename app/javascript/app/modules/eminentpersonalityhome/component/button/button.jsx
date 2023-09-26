import {Button} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

const Savebtn=()=>{
    return(<>
            <Button variant="text" endIcon={<InfoIcon/>}>Save Progress</Button>
        </>
    )

}
export  default  Savebtn;