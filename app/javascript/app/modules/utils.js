export const isValuePresent = (value) => {
    return value !== null && value !== undefined && value !== '' && value.length !== 0;
}

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
        },
        {
            key: 'college',
            na_button: false,
            name: "College / School",
            placeholder: 'Enter College / School',
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

export const educationProfessionJson = {
    title: 'Profession Profile',
    fields: [
        {
            key: 'profession',
            na_button: false,
            name: "Profession",
            placeholder: 'Enter profession',
            type: 'textField',
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