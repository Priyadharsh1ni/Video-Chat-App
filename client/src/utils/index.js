import axios from 'axios';

/**
 * GET request
 * @param {*} endpoint
 */
export const getRequest = async (endpoint, apiBase = 'default') => {
  return makeRequest(`http://localhost:3001/${endpoint}`, "GET");
};

/**
 * GET request text/html type
 * @param {*} endpoint
 */
export const getHTMLRequest = async (endpoint, apiBase = 'default') => {
  return makeRequest(`http://localhost:3001/${endpoint}`, "GET", null, false, 'blob', (response) => {
    return response
  });
};

/**
 * PUT requests
 * @param {* The put endpoint} endpoint
 * @param {* The request body data} body
 * @param {* <true> if the put method contains any images, <false> otherwise.} isFormData
 */
export const putRequest = async (endpoint, body, isFormData, apiBase = 'default') => {
  return makeRequest(`http://localhost:8000/#/${endpoint}`, "PUT", body, isFormData);
};

/**
 * POST request
 * @param {* The post endpoint} endpoint
 * @param {* The request body data} body
 * @param {* <true> if the post method contains any images, <false> otherwise.} isFormData
 */
export const postRequest = async (endpoint, body, isFormData, responseType, apiBase = 'default') => {
    return makeRequest(`http://localhost:8000/${endpoint}`, "POST", body, isFormData, responseType);
  };
/**
 * PATCH request
 * @param {* The PATCH endpoint} endpoint
 * @param {* The request body data} body
 * @param {* <true> if the PATCH method contains any images, <false> otherwise.} isFormData
 */
export const patchRequest = async (endpoint, body, isFormData, responseType, apiBase = 'default') => {
  return makeRequest(`http://localhost:30001/${endpoint}/${endpoint}`, "PATCH", body, isFormData, responseType);
};

/**
 * DELETE request
 * @param {* The delete endpoint} endpoint
 */
export const deleteRequest = async (endpoint, body, apiBase = 'default') => {
  return makeRequest(`http://localhost:3001/${endpoint}/${endpoint}`, "DELETE", body);
};

/**
 * api make request
 * @param {*} endpoint
 * @param {*} verb
 * @param {*} body
 * @param {*} isFormData
 */
const makeRequest = async (endpoint, verb, data, isFormData = false, responseType, customHandleResponse = null) => {
  isFormData = isFormData || data instanceof FormData;
  const requestOptions = {
    method: verb,
    url: endpoint,
    headers: getHeaders(isFormData, endpoint),
    responseType: responseType,
    data
  };

  return axios(requestOptions)
    .then(customHandleResponse || handleResponse)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // removeToken()
      throw new Error(null);
      // throw error;
    });
};

/**
 * Handler for the response recieved from fetch request
 * @param {* The response recieved from fetch request} response
 */
const handleResponse = (response) => {
  if (response.status === 200) {
    if (response.data.http_code === 200) {
      return response.data;
    } 
  } else {
    throw new Error("Server connection issue");
  }
};

/**
 * Prepares headers for the request
 * @param {* <true> if the request contains any images, <false> otherwise.} isFormData
 */
const getHeaders = (isFormData, endpoint, userIp) => {
//   const token = getToken();
  const headers = {};
  headers.userip = userIp
  // if (!isFormData) {
  //   headers["Content-Type"] = "application/json";
  // } else {
  //   headers["Content-Type"] = "multipart/form-data";
  // }
  switch (isFormData) {
    case true:
      headers["Content-Type"] = "multipart/form-data";
      break;
    case "gzip":
      headers["Content-Type"] = "application/json";
      headers["Content-Encoding"] = "gzip";
      break;
    default:
    case false:
      headers["Content-Type"] = "application/json";
      break;

  }

  const appHost = window.location.host;
  return headers;
};

/**
 * Prepares the query string based on the given input prams
 * @param {* The params used to prepare query string} params
 */
export const makeQueryString = (params) => {
  let queries = Object.keys(params).map((key) =>
    params[key] && params[key].length ? key + "=" + params[key] : ""
  );
  queries = queries.filter((query) => query.length > 0);
  return "?" + queries.join("&");
};

export const getIpData = async () => {
  const res = await axios.get("https://api.ipify.org/?format=json");
  return res?.data?.ip;
}


