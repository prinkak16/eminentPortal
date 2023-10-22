import React from "react";
import { useField } from "formik"; // Import useField from Formik

const PdfUpload = ({ name, isSubmitting, cardName }) => {
    const [field, , helpers] = useField(name); // Use useField to get field and helpers

    const handlePdfFileChange = (e) => {
        if (e.target.files.length > 0) {
            helpers.setValue(e.target.files[0]); // Use helpers.setValue to set the field value
        }
    };

    return (
        <div>
            <label htmlFor={name}>{cardName}</label>
            <input
                type="file"
                id={name}
                name={name}
                onChange={handlePdfFileChange}
                accept=".pdf"
                disabled={isSubmitting}
            />
        </div>
    );
};

export default PdfUpload;
