import axios from "axios";
import {apiBaseUrl, allSteps} from "../api_endpoints";
export const getFormData = (data) => {
  return axios.post(apiBaseUrl + allSteps, data)
      .then((response) => {
          // console.log('API response:', response.data);
      })
      .catch((error) => {
          // console.error('API error:', error);
      });
}

export const getStepCtgry = axios.get(apiBaseUrl + 'metadata/categories');
export const getReligionData = axios.get(apiBaseUrl + 'metadata/religions');
export const getGenderData = axios.get(apiBaseUrl + 'metadata/genders');
export const getStateData = axios.get(apiBaseUrl + 'metadata/states');
export const getEducationData = axios.get(apiBaseUrl + 'metadata/educations');
export const getPartyData = axios.get(apiBaseUrl + 'metadata/state_party_list');
export const getPinCodeData = axios.get('https://api.postalpincode.in/pincode/122017')