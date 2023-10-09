import * as React from 'react';
import {useState} from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Image from "../../../../images/imagelogo.svg";
import SaralLogo from "../../../../../../../public/images/sarallogo.png";

import './header.scss'
import {
    Box,
    MenuItem,
    TextField,
    InputAdornment,
    Typography,
    Container
}
    from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import {Formik, Form, Field} from "formik";
import Selectfield from "../selectfield/selectfield";
import './header.scss'
const Headerrrrrr=()=>{
    return(
        <>
            <Box className="header py-4" sx={{ flexGrow: 1 }}>
                <Container maxWidth="lg">
                    <Grid  container spacing={3} className="align-content-center">
                        <Grid xs={6} >
                            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" alignItems="center">
                                {/*<Image width='100px' height='100px'/>*/}
<img src="../../../../../../../public/images/sarallogo.png"/>
                                <Typography sx={{ml:2}}>भारतीय जनता पार्टी</Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={6} sx={{textAlign:'right'   }}>
                            <Formik>
                                <Form >
                                    <Grid  container spacing={3}>
                                        <Grid xs={6} >
                                            <Selectfield name="language" />
                                        </Grid>
                                        <Grid xs={6} >
                                            <Selectfield name="user"/>
                                        </Grid>
                                    </Grid>

                                </Form>
                            </Formik>
                        </Grid>

                    </Grid>
                </Container>

            </Box>
        </>
    )
}
export default Headerrrrrr;