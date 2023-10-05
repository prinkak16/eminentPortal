import axios from "axios";
import {apiBaseUrl, stepOne} from "../api_endpoints";

export const getSteps = axios.post(apiBaseUrl + stepOne);


export const getStepCtgry = axios.get(apiBaseUrl + 'metadata/categories');