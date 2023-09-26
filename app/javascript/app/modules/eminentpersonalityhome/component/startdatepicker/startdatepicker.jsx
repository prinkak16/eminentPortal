import React from "react";
import {useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const MyDatePicker = ({ startyear = ""}) => {
    const [field, meta, helpers] = useField(startyear);

    const { value } = meta;
    const { setValue } = helpers;

    return (
        <DatePicker
            {...field}
            selected={value}
            onChange={(date) => setValue(date)}
            endIcon={<CalendarMonthIcon/>}
        />
    );
};

const Startdatepicker=()=>{
    return (
        <MyDatePicker  startyear="date" />
    );
}
export default Startdatepicker