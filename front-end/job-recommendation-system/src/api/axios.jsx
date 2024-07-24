import axios from 'axios';

//let ip="192.168.1.8";
//let ip="localhost";
 let ip="career-go.centralindia.cloudapp.azure.com"

export const authAPI =axios.create({
     baseURL: `http://${ip}:8000/`
});

export const userAPI=axios.create({
    baseURL:  `http://${ip}:8001/`
});

export const jobAPI=axios.create({
    baseURL:  `http://${ip}:8002/`
});
export const utilsAPI = axios.create({
    baseURL: `http://${ip}:8003/`
});
export const modelAPI = axios.create({
    baseURL: `http://${ip}:8004/`
});
export default authAPI;


