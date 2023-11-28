import React, {useContext, useEffect, useState} from "react";
import Header from "./header/header"
import {Grid, Typography} from '@mui/material';
import './eminentpersonalityhome.scss'
import FormWrap from "./formWrap/formwrap";
import {createSearchParams, useLocation, useSearchParams} from 'react-router-dom';
import {isValuePresent} from "../utils";
import {fetchMobile, fetchUser} from "../../api/eminentapis/endpoints";
import {ApiContext} from "../ApiContext";
const EminentPersonality=()=> {

    const {config, isCandidateLogin, setBackDropToggle,userData, setUserData} = useContext(ApiContext)
    let location = useLocation();
    const [userStateId, setUserStateId] = useState(location.state?.state_id)
    const fetchUserDetails = () => {
        setBackDropToggle(true)
        fetchUser(config).then(res => {
            setBackDropToggle(false)
            setUserData(res.data.data.data)
            setUserStateId(res.data.data.country_state_id)
        }).catch(err => {
            setBackDropToggle(false)
            console.log(err);
        });
    }


    const fetchUserByNumber = () => {
        let phoneNumber =  localStorage.getItem('eminent_number')
        if (phoneNumber) {
            setBackDropToggle(true)
            fetchMobile(phoneNumber, setBackDropToggle).then(res => {
                setUserData(res.data.data.data)
                setUserStateId(res.data.data.country_state_id)
                setBackDropToggle(false)
            }).catch(err => {
                setBackDropToggle(false)
                console.log(err);
            });
        }
    }

    useEffect(() => {
        if (isValuePresent(location.state?.user_data)) {
            setUserData(location.state?.user_data.data)
            setUserStateId(location.state?.user_data.country_state_id)
        } else {
            isCandidateLogin ? fetchUserDetails() : fetchUserByNumber()
        }

    }, []);


    return(
        <>
                <Grid className="detailHeading d-flex justify-content-center" sx={{textAlign:'center', mb:8, mt:15 }}>
                    <div className="detailHeading-dashed dashed-1"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="456" height="48" viewBox="0 0 456 48" fill="none">
                        <g opacity="0.7">
                            <path d="M22.6807 36H0.888672V0.911964H22.6807V6.57596H7.03267V15.6H21.0487V21.024H7.03267V30.336H22.6807V36Z" fill="#575C61"/>
                            <path d="M35.2938 36H29.4378V12.288H34.8138L35.2938 15.072C36.4938 13.104 38.8938 11.568 42.3018 11.568C45.9018 11.568 48.3978 13.344 49.6458 16.08C50.8458 13.344 53.6298 11.568 57.2298 11.568C62.9898 11.568 66.1578 15.024 66.1578 20.496V36H60.3498V22.032C60.3498 18.624 58.5258 16.848 55.7418 16.848C52.9098 16.848 50.7498 18.672 50.7498 22.56V36H44.8938V21.984C44.8938 18.672 43.1178 16.896 40.3338 16.896C37.5498 16.896 35.2938 18.72 35.2938 22.56V36Z" fill="#575C61"/>
                            <path d="M75.7945 7.53596C73.7785 7.53596 72.1945 5.95196 72.1945 3.98396C72.1945 2.01596 73.7785 0.479964 75.7945 0.479964C77.7145 0.479964 79.2985 2.01596 79.2985 3.98396C79.2985 5.95196 77.7145 7.53596 75.7945 7.53596ZM72.8665 36V12.288H78.7225V36H72.8665Z" fill="#575C61"/>
                            <path d="M91.5888 36H85.7328V12.288H91.1568L91.6368 15.36C93.1248 12.96 96.0048 11.568 99.2208 11.568C105.173 11.568 108.245 15.264 108.245 21.408V36H102.389V22.8C102.389 18.816 100.421 16.896 97.3968 16.896C93.7968 16.896 91.5888 19.392 91.5888 23.232V36Z" fill="#575C61"/>
                            <path d="M125.566 36.624C118.51 36.624 113.566 31.488 113.566 24.144C113.566 16.704 118.414 11.568 125.374 11.568C132.478 11.568 136.99 16.32 136.99 23.712V25.488L119.134 25.536C119.566 29.712 121.774 31.824 125.662 31.824C128.878 31.824 130.99 30.576 131.662 28.32H137.086C136.078 33.504 131.758 36.624 125.566 36.624ZM125.422 16.368C121.966 16.368 119.854 18.24 119.278 21.792H131.182C131.182 18.528 128.926 16.368 125.422 16.368Z" fill="#575C61"/>
                            <path d="M148.493 36H142.637V12.288H148.061L148.541 15.36C150.029 12.96 152.909 11.568 156.125 11.568C162.077 11.568 165.149 15.264 165.149 21.408V36H159.293V22.8C159.293 18.816 157.325 16.896 154.301 16.896C150.701 16.896 148.493 19.392 148.493 23.232V36Z" fill="#575C61"/>
                            <path d="M179.927 36H174.071V17.184H169.511V12.288H174.071V4.89596H179.927V12.288H184.535V17.184H179.927V36Z" fill="#575C61"/>
                            <path d="M217.769 23.904H210.041V36H203.897V0.911964H217.769C224.825 0.911964 229.385 5.51996 229.385 12.384C229.385 19.152 224.777 23.904 217.769 23.904ZM216.569 6.38396H210.041V18.432H216.473C220.697 18.432 222.953 16.176 222.953 12.336C222.953 8.49596 220.649 6.38396 216.569 6.38396Z" fill="#575C61"/>
                            <path d="M244.085 36.624C237.029 36.624 232.085 31.488 232.085 24.144C232.085 16.704 236.933 11.568 243.893 11.568C250.997 11.568 255.509 16.32 255.509 23.712V25.488L237.653 25.536C238.085 29.712 240.293 31.824 244.181 31.824C247.397 31.824 249.509 30.576 250.181 28.32H255.605C254.597 33.504 250.277 36.624 244.085 36.624ZM243.941 16.368C240.485 16.368 238.373 18.24 237.797 21.792H249.701C249.701 18.528 247.445 16.368 243.941 16.368Z" fill="#575C61"/>
                            <path d="M276.036 12.192V17.616H273.876C269.652 17.616 267.012 19.872 267.012 24.48V36H261.156V12.336H266.676L267.012 15.792C268.02 13.44 270.276 11.856 273.444 11.856C274.26 11.856 275.076 11.952 276.036 12.192Z" fill="#575C61"/>
                            <path d="M279.136 28.8H284.704C284.752 30.864 286.288 32.16 288.976 32.16C291.712 32.16 293.2 31.056 293.2 29.328C293.2 28.128 292.576 27.264 290.464 26.784L286.192 25.776C281.92 24.816 279.856 22.8 279.856 19.008C279.856 14.352 283.792 11.568 289.264 11.568C294.592 11.568 298.192 14.64 298.24 19.248H292.672C292.624 17.232 291.28 15.936 289.024 15.936C286.72 15.936 285.376 16.992 285.376 18.768C285.376 20.112 286.432 20.976 288.448 21.456L292.72 22.464C296.704 23.376 298.72 25.2 298.72 28.848C298.72 33.648 294.64 36.624 288.784 36.624C282.88 36.624 279.136 33.456 279.136 28.8Z" fill="#575C61"/>
                            <path d="M302.746 24.096C302.746 16.704 308.074 11.616 315.418 11.616C322.762 11.616 328.09 16.704 328.09 24.096C328.09 31.488 322.762 36.576 315.418 36.576C308.074 36.576 302.746 31.488 302.746 24.096ZM308.602 24.096C308.602 28.416 311.386 31.344 315.418 31.344C319.45 31.344 322.234 28.416 322.234 24.096C322.234 19.776 319.45 16.848 315.418 16.848C311.386 16.848 308.602 19.776 308.602 24.096Z" fill="#575C61"/>
                            <path d="M339.548 36H333.692V12.288H339.116L339.596 15.36C341.084 12.96 343.964 11.568 347.18 11.568C353.132 11.568 356.204 15.264 356.204 21.408V36H350.348V22.8C350.348 18.816 348.38 16.896 345.356 16.896C341.756 16.896 339.548 19.392 339.548 23.232V36Z" fill="#575C61"/>
                            <path d="M369.974 36.624C364.934 36.624 361.862 33.696 361.862 29.232C361.862 24.864 365.03 22.128 370.646 21.696L377.75 21.168V20.64C377.75 17.424 375.83 16.128 372.854 16.128C369.398 16.128 367.478 17.568 367.478 20.064H362.486C362.486 14.928 366.71 11.568 373.142 11.568C379.526 11.568 383.462 15.024 383.462 21.6V36H378.326L377.894 32.496C376.886 34.944 373.67 36.624 369.974 36.624ZM371.894 32.208C375.494 32.208 377.798 30.048 377.798 26.4V25.152L372.854 25.536C369.206 25.872 367.814 27.072 367.814 28.992C367.814 31.152 369.254 32.208 371.894 32.208Z" fill="#575C61"/>
                            <path d="M396.079 36H390.271V0.287964H396.079V36Z" fill="#575C61"/>
                            <path d="M406.11 7.53596C404.094 7.53596 402.51 5.95196 402.51 3.98396C402.51 2.01596 404.094 0.479964 406.11 0.479964C408.03 0.479964 409.614 2.01596 409.614 3.98396C409.614 5.95196 408.03 7.53596 406.11 7.53596ZM403.182 36V12.288H409.038V36H403.182Z" fill="#575C61"/>
                            <path d="M424.112 36H418.256V17.184H413.696V12.288H418.256V4.89596H424.112V12.288H428.72V17.184H424.112V36Z" fill="#575C61"/>
                            <path d="M431.256 46.992V42.096H434.76C437.064 42.096 438.504 41.568 439.512 38.784L440.184 37.008L430.632 12.288H436.824L442.92 29.568L449.352 12.288H455.4L443.784 41.28C442.008 45.696 439.512 47.52 435.624 47.52C433.992 47.52 432.552 47.328 431.256 46.992Z" fill="#575C61"/>
                        </g>
                    </svg>
                    <div className="detailHeading-dashed dashed-2"></div>
                </Grid>
            {userData && <FormWrap userData={userData} stateId={ userStateId}/>}
        </>
    )
}
export default EminentPersonality