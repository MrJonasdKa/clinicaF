import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

//listara todos los proveedores que estas con estado 1 o activo o true
export async function listarProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/proveedores/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//listara todos los proveedores que estas con estado 0 o inactivo o false
export async function listarNoProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/proveedores/no`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//lo que hara es registrar nuevos proveedores con sus datos correcpondientes
export async function registrar(nombre_proveedor, representante, telefono, descripcion_proveedor) {
    try {
        const response = await axios.post(`${BASE_URL}/proveedores/registrar`, {nombre_proveedor, representante, telefono, descripcion_proveedor});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//actualizara los proveedores que no esten bien registrados 
export async function actualizar(id_proveedor ,nombre_proveedor, representante, telefono, descripcion_proveedor ){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/modificar/${id_proveedor}`,{nombre_proveedor, representante, telefono, descripcion_proveedor});
        return response.data;
    }
    catch(error){
        throw error;
    }

}

//eliminara o cambiara el estado de activo a inactivo de un proveedores en especifico 
export async function eliminar(id_medicamento){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/eliminar/${id_medicamento}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//eliminara o cambiara el estado de activo a inactivo de varios proveedores
export async function eliminarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/eliminarproveedores`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//reactivara o cambiara el estado de inactivo a activo de un proveedores en especifico 
export async function retornar(id_medicamento){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/regresar/${id_medicamento}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//reactivara o cambiara el estado de inactivo a activo de varios proveedores
export async function retornarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/regresarproveedores`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}
