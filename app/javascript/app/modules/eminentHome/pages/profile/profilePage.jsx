import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Box, Typography, Paper, Grid} from '@mui/material';
import {getProfileData} from "../../../../api/eminentapis/endpoints";
import {useEffect, useState} from "react";


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

    },
    permission:{
        span:{
            marginRight:'2px',
            ':last-child': {
                display: 'none',
            },
        }
    }
}

const Profile = () => {
    const [profileDetail, setProfileDetail] = useState(null)
    const [permissions, setPermissions] = useState([]);
    const [allottedStates, setAllottedStates] = useState([]);
    const [ministries, setMinistries] = useState([]);
    const profileData = () => {
        getProfileData().then((response) => {
            setProfileDetail(response.data.data)
            setPermissions(response.data.data.permissions)
            setAllottedStates(response.data.data.allotted_states)
            setMinistries(response.data.data.assigned_ministries)
        })
    }
    useEffect(() => {
        profileData()
    }, []);

    return (
        <>
                <Box sx={profileStyle}>
                <Grid container spacing={2} className="justify-content-center">
                    {profileDetail && (
                        <Grid item xs={12} md={7}>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p"><b>Name:</b> {profileDetail.name}</Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p"><b>Email:</b> {profileDetail.email}</Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p"><b>Phone:</b> {profileDetail.phone}</Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p"><b>Role:</b> {profileDetail.role}</Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p" sx={profileStyle.permission}><b>Permissions: </b>
                                    {permissions.map(permission => (
                                        <>
                                        <span>{permission.action} - {permission.permission_name}</span><span>, </span>
                                        </>
                                    ))}
                                </Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p" sx={profileStyle.permission}><b>Allotted States: </b>
                                    {allottedStates.map(states => (
                                        <>
                                            <span> {states.name}</span> <span>, </span>
                                        </>

                                    ))}
                                </Typography>
                            </Grid>
                            <Grid sx={profileStyle.card}>
                                <Typography variant="p" ><b>Assigned Ministries: </b>
                                    {ministries.map(ministry => (
                                        <>
                                        <span>{ministry.ministry_name}</span>
                                        </>
                                    ))}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}



                </Grid>
            </Box>
        </>

    );
}
export default Profile