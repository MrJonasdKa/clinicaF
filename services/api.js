import axios from 'axios';

//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function login(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function register(nombres, apellidos, correo, contrasenia, rol, estadoMedico) {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/registrar`, { nombres, apellidos, correo, contrasenia, rol, estadoMedico });
    return response.data;
  } catch (error) {
    throw error;
  }
}
