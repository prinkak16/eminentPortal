import axios from 'axios';
import {apiBaseUrl} from "../api_endpoints";
import slotting from "../../modules/eminentHome/pages/slotting/slotting";


export const getFilters = ()  => {
    return axios.get(apiBaseUrl + 'filters/home');
}
export const getFiltersForGOM = (params) => {
    return axios.get(apiBaseUrl + 'filters/gom_management')
}

// export const getVacancy
export const getData = (filters = '') => {
    return axios.get(apiBaseUrl + 'custom_member_forms/list?type=eminent_personality' + filters);
}
export const getVacancyAnalytics=()=>{
    return axios.get(apiBaseUrl + 'vacancy/position_analytics');
}
export const statsData = () => {
    return axios.get(apiBaseUrl + '/stats/home');
}

export const deleteMember = (deleteId) => {
    return axios.delete(apiBaseUrl + 'custom_member_forms/delete_member?' + deleteId  );
}

export const updateState = (updatedState) => {
    return axios.post(apiBaseUrl + 'custom_member_forms/update_aasm_state', updatedState);
}

export const uploadVacancy = (formData) => {
    return axios.post(apiBaseUrl + 'vacancy/manual_upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const fetchMobile = (number) => {
    return axios.get(apiBaseUrl + 'custom_member_forms/fetch_by_number',{
        params: {
            phone_number: number
        }
    });
}

export const fetchUser = (config) => {
    return axios.get(apiBaseUrl + 'eminent/fetch',{
        params: {
        },
        headers: config?.headers
    });
}
export  const getSlottingTable =(params)=>{
    return axios.get(apiBaseUrl + 'slotting/list', {params})
}
export const getSlottingPsuData = (params ) => {
    return axios.get(apiBaseUrl + 'slotting/stats/' + params )

}

export  const assignSlottingVacancy = (formData) => {
    return axios.post(apiBaseUrl + 'slotting/slot', formData)
}

export const getSlottingFilters = () => {
    return axios.get(apiBaseUrl + 'filters/slotting')
}
export const getMinistryWiseData = (params, queryParams) => {
    return axios.get(`${apiBaseUrl}vacancy/list?${queryParams}`, { params });
}
export const getMinistryWiseFilterData = (params) => {
    return axios.get(apiBaseUrl + 'filters/vacancy_ministry_wise',{params});
}
export const getOrganizationWiseFilterData = (params) => {
    return axios.get(apiBaseUrl + 'filters/vacancy_organization_wise', { params });
}
export const getVacancyWiseFilterData = (params) => {
    return axios.get(apiBaseUrl + 'filters/vacancy_wise', {params});
}
export const getMinistry = () => {
    return axios.get(apiBaseUrl + 'ministry');
}

export const getMinisters = () => {
    return axios.get(apiBaseUrl + 'gom/minister_list');
}

export const getMinistryByFilters = (filterParams) => {
    return axios.get(apiBaseUrl + 'gom/assigned_ministries_by_filters?ministry_ids=' + filterParams.ministry_ids + '&minister_ids=' + filterParams.minister_ids)
}
export const getSlottingAnalytics=()=>{
    return axios.get(apiBaseUrl + 'slotting/position_analytics');
}

export const getGOMTableData = () => {
    return axios.get(apiBaseUrl + 'gom/assigned_ministries')
        .then(response => {
            return response.data; // You can return the data if needed
        })
        .catch(error => {
            throw error; // Rethrow the error to handle it at the caller's end
        });
}
export const assignMinistriesAndMinister = (ministryIds, ministerId) => {
    return axios.post(apiBaseUrl + `user/${ministerId}/assign_ministries`, {
        ministry_ids: ministryIds
    })
}