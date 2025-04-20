import axios from "axios"
import { postRequest } from "../../utils"

async function getToken(params) {
    const response = await axios.post(`http://localhost:8000/getToken`, params)
    console.log("🚀 ~ getToken ~ response:", response)
    return response
}

export const vcService = {
    getToken
}