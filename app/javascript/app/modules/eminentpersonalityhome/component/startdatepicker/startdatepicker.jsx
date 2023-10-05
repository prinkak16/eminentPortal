import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import './startdatepicker.scss'
const Startdatepicker = ({year}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker name={year}/>
        </LocalizationProvider>
    );
};
export default Startdatepicker