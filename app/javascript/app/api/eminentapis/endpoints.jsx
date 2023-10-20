import axios from 'axios';
import {apiBaseUrl} from "../api_endpoints";

export const getFilters = ()  => {
    return axios.get(apiBaseUrl + 'metadata/config/home');
}

export const getData = (filters = '') => {
    return axios.get(apiBaseUrl + 'custom_member_forms/list?type=eminent_personality' + filters);
}