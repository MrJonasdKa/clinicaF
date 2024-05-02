import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function serviciosUtilizados() {
    try {
        const response = await axios.get(`${BASE_URL}/informes/serviciosutilizados`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function cantidadPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/informes/cantidadpacientes`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
