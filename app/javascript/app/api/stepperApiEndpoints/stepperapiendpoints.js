import axios from "axios";
import {apiBaseUrl, allSteps} from "../api_endpoints";




export const getFormData = (data) => {
  return axios.post(apiBaseUrl + allSteps, data)
 .then((response) => {
   console.log("Response:", response.data);
   return response.data;
  })
  .catch((error) => {
   console.error("Error:", error);
   throw error;
  });
}

export const getStepCtgry = axios.get(apiBaseUrl + 'metadata/categories');
export const getReligionData = axios.get(apiBaseUrl + 'metadata/religions');
