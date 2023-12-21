import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Box, Typography, Paper, Grid} from '@mui/material';


const profileStyle = {
    marginTop:'8rem',
    card:{
        backgroundColor:'#fff',
        border: '1px solid rgba(0,0,0,.125)',
        borderRadius: '0.25rem',
        padding:'1rem',
        marginBottom: '0.5rem',
        span:{
            fontSize:'1rem',
        }
    }
}

const Profile = () => {
    return (
        <Box sx={profileStyle}>
            <Grid container spacing={2} className="justify-content-center">
                <Grid item xs={12} md={7}>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Name:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Email:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Phone:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Role:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Permissions:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Allotted States:</b></Typography>
                        </Grid>
                        <Grid sx={profileStyle.card}>
                            <Typography variant="p"><b>Allotted Ministries:</b></Typography>
                        </Grid> 
                </Grid>
            </Grid>
        </Box>
    );
}
export default Profile