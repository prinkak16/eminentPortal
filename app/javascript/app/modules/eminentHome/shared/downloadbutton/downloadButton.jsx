import React from "react";
import {Button} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const DownloadButton = ({handleExcelDownload}) => {
    const downloadButton = {
        borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.6)',
        background: 'transparent',
        color: 'rgba(0,0,0,0.6)',
        marginLeft: "10px"
    }
    return (

        <>
            <Button style={downloadButton} onClick={handleExcelDownload}>
                Download <ArrowDownwardIcon/>
            </Button>
        </>
    )
}
export default DownloadButton;