import {getFileUpload, getFormData} from "../api/stepperApiEndpoints/stepperapiendpoints";
import { toast } from 'react-toastify';
import moment from "moment/moment";
import {Button} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {styled} from "@mui/material/styles";
const dayjs = require('dayjs');

export const isValuePresent = (value) => {
    return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== false &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === 'object' && Object.keys(value).length === 0)
    );
};



export const educationDetailsJson = {
    title: 'Education Details',
    fields: [
        {
            type: 'dropdown',
            na_button: false,
            list: ['Less than 10th', '10th Pass', 'Diploma/ITI', '12th Pass', 'Graduate', 'Post Graduate', 'PhD and Above'],
            name: 'Qualification',
            key: 'qualification',
            placeholder: 'Select Party level',
            isRequired: true
        },
        {
            key: 'course',
            na_button: false,
            name: "Course / Branch / Subject",
            placeholder: 'Enter Course / Branch / Subject',
            type: 'textField',
        },
        {
            key: 'university',
            na_button: false,
            name: "University / Board",
            placeholder: 'Enter University / Board',
            type: 'textField',
            isRequired: true
        },
        {
            key: 'college',
            na_button: false,
            name: "College / School",
            placeholder: 'Enter College / School',
            type: 'textField',
            isRequired: true
        },
        {
            key: 'start_year',
            na_button: false,
            name: "Start Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
        {
            key: 'end_year',
            na_button: false,
            name: "End Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
    ]
}
export const ProfessionJson = {
    title: 'Profession Profile',
    fields: [
        {
            key: 'profession',
            na_button: false,
            name: "Profession",
            placeholder: 'Enter profession',
            type: 'textField',
            isRequired: true
        },
        {
            key: 'position',
            na_button: false,
            name: "Position",
            placeholder: 'Enter position',
            type: 'textField',
        },
        {
            key: 'organization',
            na_button: false,
            name: "Organization",
            placeholder: 'Enter organization name',
            type: 'textField',
        },
        {
            key: 'start_year',
            na_button: false,
            name: "Start Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
        {
            key: 'end_year',
            na_button: true,
            na_type:'end_date',
            na_massage: "Current Working",
            name: "End Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
    ]
}
export const politicalProfileJson = {
    title: 'Political Profile',
    fields: [
        {
            key: 'party_level',
            na_button: false,
            name: "Party Level",
            placeholder: 'Enter party level',
            type: 'textField',
        },
        {
            key: 'unit',
            na_button: false,
            name: "Unit",
            placeholder: 'Enter unit',
            type: 'textField',
        },
        {
            key: 'designation',
            na_button: false,
            name: "Designation",
            placeholder: 'Enter designation',
            type: 'textField',
        },
        {
            key: 'start_year',
            na_button: false,
            name: "Start Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
        {
            key: 'end_year',
            na_button: false,
            name: "End Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
    ]
}
export const otherPartyJson = {
    title: 'Other Party Profile',
    fields: [
        {
            key: 'party',
            na_button: false,
            name: "Party",
            placeholder: 'Enter party',
            type: 'textField',

        },
        {
            key: 'position',
            na_button: false,
            name: "Position (Senior Most)",
            placeholder: 'Enter Position',
            type: 'textField',
        },
        {
            key: 'start_year',
            na_button: false,
            name: "Start Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
        {
            key: 'end_year',
            na_button: false,
            name: "End Year",
            placeholder: 'Select Start Year',
            type: 'date',
        },
    ]
}

export const electionTypeList = ["Lok sabha", "Rajya sabha", "Legislative Assembly (Vidhan Sabha)", "Legislative Council (Vidhan Parishad)", "Urban Local body", "Rural Local body", "Other"]

const electionWin =  {
    type: 'radio',
    name: 'Did You Win?',
    key: 'election_win',
    list:['Yes', 'No']
}

const ministerPortfolio = {
    is_conditional: true,
    condition_key: 'election_win',
    condition_value:'Yes',
    type: 'radio',
    name: 'Do you have any portfilio as Minister',
    key: 'minister_portfolio',
    list:['Yes', 'No']
}
const ministryName = {
    is_conditional: true,
    condition_key: 'minister_portfolio',
    condition_value:'Yes',
    type: 'textField',
    name: 'Name Of Ministry',
    key: 'ministry_name',
    placeholder: 'Enter Name of Ministry',
    combo_fields: [
    {
        type: 'textField',
        name: 'Designation',
        key: 'designation',
        placeholder: 'Designation'

    }
]
}
const ministryDuration = {
    is_conditional: true,
    condition_key: 'minister_portfolio',
    condition_value:'Yes',
    type: 'numField',
    name: 'Duration',
    key: 'ministry_duration',
    placeholder: 'Enter Duration (in Months)'
}

const afterElectionFields = [electionWin, ministerPortfolio, ministryName, ministryDuration];

export const electionWiseJson =
    {
        lok_sabha: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                    list: ['data','data1'],
                    combo_fields:[{
                        type: 'dropdown',
                        name: 'Parliamentary Constituency',
                        key: 'ParliamentaryConstituency',
                        placeholder: 'Pc',
                        list: ['data','data1'],
                    }],
                },
                ...afterElectionFields
            ]
        },
        rajya_sabha: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                },
                ...afterElectionFields
            ]
        },
        legislative_assembly_vidhan_sabha: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                    combo_fields:[{
                            type: 'dropdown',
                            name: 'Assembly Constituency',
                            key: 'AssemblyConstituency',
                            placeholder: 'Ac'
                    }]
                },
                ...afterElectionFields,
            ]
        },
        legislative_council_vidhan_sabha: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                    combo_fields:[
                        {
                            type: 'dropdown',
                            name: 'Type of constituency',
                            key: 'AssemblyConstituency',
                            placeholder: 'Constituency'
                        }
                    ]
                },
                ...afterElectionFields,
            ]
        },
        urban_local_body: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                    combo_fields:[{
                        type: 'dropdown',
                        name: 'Administrative District',
                        key: 'AdministrativeDistrict',
                        placeholder: 'Ad'
                    }]
                },
                {
                    type: 'textField',
                    name: 'Name of body',
                    key: 'urban_local_body',
                    placeholder: 'Enter Body'
                },
                ...afterElectionFields,
            ]
        },
        rural_local_body: {
            fields: [
                {
                    type: 'dropdown',
                    name: 'State',
                    key: 'State',
                    placeholder: 'State',
                    combo_fields:[{
                        type: 'dropdown',
                        name: 'Administrative District',
                        key: 'AdministrativeDistrict',
                        placeholder: 'Ad'
                    },]
                },
                {
                    type: 'textField',
                    name: 'Name of body',
                    key: 'rural_local_body',
                    placeholder: 'Enter Body'
                },
                ...afterElectionFields,
            ]
        },
        other: {}
    }

export  const enterPhoneNumber = (event) => {
        const phoneNumber = event.target.value.replace(/[^\d०१२३४५६७८९]/g, '');
        if (/^[5-9५६७८९]/.test(phoneNumber)) {
            event.target.value = phoneNumber;
        } else {
            event.target.value = ''; // Clear the input value if it doesn't start with 5-9 or a Hindi digit
        }

        return event.target.value
    }


export const languagesName = [
        'Hindi',
        'Bengali',
        'Telugu',
        'Marathi',
        'Tamil',
        'Urdu',
        'Gujarati',
        'Kannada',
        'Odia',
        'Punjabi',
        'Malayalam',
        'Assamese',
        'Maithili',
        'Santali',
        'Kashmiri',
        'Nepali',
        'Konkani',
        'Sindhi',
        'Dogri',
        'Manipuri',
        'Bodo',
        'Sanskrit',
        'Other Indian languages'
    ];


export const saveProgress = (formValues, activeStep) => {
    const fieldsWithValues = {};
    for (const fieldName of Object.keys(formValues)) {
        const fieldValue = formValues[fieldName];
        if (fieldValue) {
            if (formValues[fieldName] === 'mobile') {
                fieldsWithValues[fieldName] = [fieldValue];
            } else {
                fieldsWithValues[fieldName] = fieldValue;
            }
        }
    }
    getFormData(fieldsWithValues, activeStep).then(response => {
    });
}

export const formFilledValues = (formValues) => {
    const fieldsWithValues = {};
    for (const fieldName of Object.keys(formValues)) {
        const fieldValue = formValues[fieldName];
        if (fieldValue) {
            if (formValues[fieldName] === 'mobile') {
                fieldsWithValues[fieldName] = [fieldValue];
            } else {
                fieldsWithValues[fieldName] = fieldValue;
            }
        }
    }
    return fieldsWithValues
}

export const showSuccessToast = (massage) => {
    const isContainerPresent = document.querySelector('.Toastify__toast--success');
    if (isContainerPresent) {
        isContainerPresent.remove();
    }

    toast.success(massage, {
        position: 'top-right',
        autoClose: 3000, // milliseconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

}

export const showErrorToast = (massage) => {
    const isContainerPresent = document.querySelector('.Toastify__toast-theme--light.Toastify__toast--error.Toastify__toast--close-on-click');

    if (!isContainerPresent) {
        toast.error(massage, {
            position: 'top-right',
            autoClose: 3000, // milliseconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
}

export const yearToDateConvert = (year) => {
    const dateObject = new Date(parseInt(year), 0)
    return dateObject.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        timeZone: 'Asia/Kolkata', // Use the appropriate time zone for India
    });
}

export const  toSnakeCase = (inputString) => {
    const cleanedString = inputString.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return cleanedString.replace(/\s+/g, '_').toLowerCase();
}

export const dobFormat = (date) => {
    return dayjs(moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD').toString())
}

export const calculateAge = (dob) => {
    if (dob.$y === null) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;

};

export const saveProgressButton=
    <Button>Save Progress
        <Tooltip title="">
            <FontAwesomeIcon className='save-progress-info' icon={faInfoCircle} style={{ color: "#3f96fd" }} />
        </Tooltip>
    </Button>


export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
