import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import './startdatepicker.scss'
import { Field } from "formik";
const Startdatepicker = ({year}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field name={name}>
                {({ field, form }) => (
                    <DatePicker
                        {...field} // Pass the field's props to the DatePicker
                        value={field.value} // Set the value explicitly if needed
                        onChange={(date) => form.setFieldValue(name, date)} // Handle date changes
                    />
                )}
            </Field>
        </LocalizationProvider>
    );
};
export default Startdatepicker