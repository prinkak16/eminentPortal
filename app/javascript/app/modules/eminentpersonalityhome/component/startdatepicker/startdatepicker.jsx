import React from "react";
import {useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import './startdatepicker.scss'
const Startdatepicker = ({ startyear=""}) => {
    const [field, meta, helpers] = useField(startyear);

    const { value } = meta;
    const { setValue } = helpers;

    return (
        <DatePicker
            {...field}
            selected={value}
            onChange={(startdate) => setValue(startdate)}
            endIcon={<CalendarMonthIcon/>}
            startDate={startyear}
        />
    );
};
export default Startdatepicker