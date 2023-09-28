import React from "react"
import { Button } from "@mui/material"
const Primarybutton=({type, handleclick, buttonlabel, starticon, addclass, disabled})=>{
    return(
        <>
            <Button type={type} disabled={disabled} className={addclass} variant="contained"   startIcon={starticon} onClick={handleclick} >
                {buttonlabel}
            </Button>
        </>
    )
}
export default Primarybutton