import React, {useContext, useEffect, useState} from "react"
import {Stack, Typography, Button, Box, Paper, Grid, FormLabel, TextField} from '@mui/material';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {styled} from '@mui/material/styles';
import Formheading from "../component/formheading/formheading";
import Inputfield from "../component/inputfield/inputfield";
import {getFormData} from "../../../api/stepperApiEndpoints/stepperapiendpoints";
import * as Yup from "yup";
import {disabledSaveProgressButton, formFilledValues, saveProgressButton} from "../../utils";
import {ApiContext} from "../../ApiContext";

const Refferedform = (props) => {
    const {config, isCandidateLogin} = useContext(ApiContext)
    const [mobile, setMobile] = useState(props?.formValues?.reference?.mobile)
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: 'transparent',
        boxShadow: 'none',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        flexGrow: 1,
    }));
    const [comments, setComments] = useState(props?.formValues?.reference?.comments)
    const [isViewDisabled, setIsViewDisabled] = useState(false)

    useEffect(() => {
        if (props.viewMode === 'view') {
            setIsViewDisabled(true)
        }

    },[props.viewMode])

    const commentsChange = (e) => {
        setComments(e.target.value)
        props.formValues.reference.comments = e.target.value
    }

    const saveProgress = () => {
        if (!isViewDisabled) {
            const fieldsWithValues = formFilledValues(props.formValues);
            getFormData(fieldsWithValues, props.activeStep + 1, config, true, isCandidateLogin, props.stateId).then(response => {
            });
        }
    }

    const enterMobileNumber = (event) => {
        const phoneNumber = event.target.value.replace(/[^\d०१२३४५६७८९]/g, '');
        if (/^[5-9५६७८९]/.test(phoneNumber)) {
            event.target.value = phoneNumber;
        } else {
            event.target.value = ''; // Clear the input value if it doesn't start with 5-9 or a Hindi digit
        }
        setMobile(event.target.value)
    }

    useEffect(() => {
        props.formValues.reference.mobile = mobile
    }, [mobile]);

    return (
        <>
            <Box sx={{flexGrow: 1}}>

                <Stack className="mb-4" direction="row" useFlexGap flexWrap="wrap">
                    <Item><Formheading number="1" heading="Referred by"/></Item>
                    <Item sx={{textAlign: 'right'}}>
                        <div onClick={saveProgress}>
                            {
                                isViewDisabled ?
                                    disabledSaveProgressButton :
                                    saveProgressButton
                            }
                        </div>
                    </Item>
                </Stack>
                <Grid container spacing={2} sx={{mb: 3}} className="grid-wrap">
                    <Grid item xs={6}>
                        <FormLabel>Name <mark>*</mark></FormLabel>
                        <Inputfield type="text"
                                    disabled={isViewDisabled}
                                    name={`reference.name`}
                                    value={props?.formValues?.reference?.name}
                                    placeholder="Enter Name"/>
                        <ErrorMessage name={`reference.name`}  style={{color:'red'}} component="p" />

                    </Grid>
                    <Grid item xs={6} className="d-grid">
                        <FormLabel>Phone no. <mark>*</mark></FormLabel>
                        <input
                            disabled={isViewDisabled}
                            maxLength={10}
                            placeholder='Enter Mobile Number'
                            value={mobile}
                            onChange={enterMobileNumber}
                            className="reff-mobile" />
                        <ErrorMessage name={`reference.mobile`} style={{color:'red'}} component="p" />
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>BJP ID</FormLabel>
                        <Inputfield type="text"
                                    disabled={isViewDisabled}
                                    name={`reference.bjp_id`}
                                    value={props?.formValues?.reference?.bjp_id}
                                    placeholder="BJP ID"/>
                        <ErrorMessage name={`reference.bjp_id`} style={{color:'red'}} component="p" />

                    </Grid>
                    <Grid item xs={6}>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>comments </FormLabel>
                        <TextField
                            disabled={isViewDisabled}
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
                        <ErrorMessage name={`reference.comments`} style={{color:'red'}} component="p" />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
Refferedform.label = 'Referred By'
Refferedform.initialValues = {
    reference: {name: "", mobile: "", bjp_id: "", comments: ""}


};
Refferedform.validationSchema = Yup.object().shape({
    reference: Yup.object().shape({
        name: Yup.string().required("Name is required"),
        mobile: Yup.string().required("Mobile is required"),
        bjp_id: Yup.string().max(10, "BJP ID must be at most 10 characters"),
    }),
});
export default Refferedform;