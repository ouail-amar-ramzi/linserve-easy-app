import axios from "axios";

export default axios.create({
    baseURL: "http://waft-dz.com/main_service/api",
    headers: {
        'Content-Type': 'multipart/form-data', // Set the Content-Type header
    }
})