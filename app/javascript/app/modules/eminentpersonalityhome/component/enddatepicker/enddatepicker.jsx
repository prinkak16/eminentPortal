import React from "react";
import {useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const EndDate = ({endyear="" }) => {
    const [field, meta, helpers] = useField(endyear);

    const { value } = meta;
    const { setValue } = helpers;

    return (
        <DatePicker
            className="datepicker"
            {...field}
            selected={value}
            onChange={(date) => setValue(date)}
            endIcon={<CalendarMonthIcon/>}
        />
    )
};

const Enddatepicker=()=>{
    return (
        <EndDate  endyear="date" />
    );
}
export default Enddatepicker