import React, {useContext, useState} from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import Formheading from "../component/formheading/formheading";
import Savebtn from "../component/saveprogressbutton/button";
import Inputfield from "../component/inputfield/inputfield";
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
import {formFilledValues} from "../../utils";
import {ApiContext} from "../../ApiContext";

const Refferedform = (props) => {
    const {config, isCandidateLogin} = useContext(ApiContext)
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));

    const [comments, setComments] = useState(props?.formValues?.reference?.comments)

    const commentsChange = (e) => {
        setComments(e.target.value)
        props.formValues.reference.comments = e.target.value
    }

    const saveProgress = () => {
        const fieldsWithValues = formFilledValues(props?.formValues);
        getFormData(fieldsWithValues, props?.activeStep + 1, config).then(response => {
        });
    }

    return (
        <>
            <Box sx={{flexGrow: 1}}>

                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Referred by"/></Item>
                    <Item sx={{textAlign: 'right'}}><Savebtn onClick={saveProgress}/></Item>
                </Stack>
                <Grid container spacing={2} sx={{mb: 3}} className="grid-wrap">
                    <Grid item xs={6}>
                        <FormLabel>Name</FormLabel>
                        <Inputfield type="text"
                                    name={`reference.name`}
                                    value={props?.formValues?.reference?.name}
                                    placeholder="Enter Name"/>
                        <ErrorMessage name={`reference.name`} component="div"/>

                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Phone no.</FormLabel>
                        <Inputfield type="text"
                                    name={`reference.mobile`}
                                    value={props?.formValues?.reference?.mobile}
                                    placeholder="Enter phone no."/>
                        <ErrorMessage name={`reference.mobile`} component="div"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>BJP ID</FormLabel>
                        <Inputfield type="text"
                                    name={`reference.bjp_id`}
                                    value={props?.formValues?.reference?.bjp_id}
                                    placeholder="BJP ID"/>
                        <ErrorMessage name={`reference.bjp_id`} component="div"/>

                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Grade</FormLabel>
                        <Inputfield type="text"
                                    name={`reference.grade`}
                                    value={props?.formValues?.reference?.grade}
                                    placeholder="BJP ID"/>
                        <ErrorMessage name={`reference.grade`} component="div"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>comments</FormLabel>
                        <TextField
                            className='p-0'
                            fullWidth
                            name={`reference.comments`}
                            onChange={commentsChange}
                            value={comments}
                            multiline
                            minRows={3}
                            maxRows={4}
                            placeholder="Write something"
                        />
                        <ErrorMessage name={`reference.comments`} component="div"/>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
Refferedform.label = 'Referred By'
Refferedform.initialValues = {
    reference: {name: "", mobile: "", bjp_id: "", grade: "", comments: ""}


};
Refferedform.validationSchema = Yup.object().shape({
    reference: Yup.object().shape({
        name: Yup.string().required("Name is required"),
        mobile: Yup.string().required("Mobile is required"),
        bjp_id: Yup.string().required("BJP ID is required"),
        grade: Yup.string().required("Grade is required"),
        comments: Yup.string().required("Comments are required"),
    }),
});
export default Refferedform;