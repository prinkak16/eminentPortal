import {Box,Typography} from "@mui/material";
import React from "react";

const Formheading=({number, heading})=>{
    return(<>
                <Typography variant="h5" content="h5">
                    <span className="detailnumbers d-inline-block" >{number}</span> {heading}
                </Typography>
             </>
        )

}
export  default  Formheading;