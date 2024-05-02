import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function registrar(producto_id, proveedor_id, cantidad_reabastecida, fecha_reabastecimiento, costo_total) {
    try {
        //formData.append('imagen', imagen); //crea folder es especifico -> para lo que quiero productos 
        const response = await axios.post(`${BASE_URL}/reabastecer/registrar`, {producto_id, proveedor_id, cantidad_reabastecida, fecha_reabastecimiento, costo_total});
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export async function actualizar(id_reabastecimiento, producto_id,proveedor_id, cantidad_reabastecida, fecha_reabastecimiento , costo_total) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/actualizar/${id_reabastecimiento}`, { producto_id,proveedor_id, cantidad_reabastecida, fecha_reabastecimiento , costo_total });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function eliminar(id_reabastecimiento) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/eliminar/${id_reabastecimiento}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/eliminarVarios`, {ids});
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function retornar(id) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/regresar/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function retornarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/regresarVarios`, {ids});
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/proveedores`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function listarProductos(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/productos`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function listarReabasteci(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
export async function listarNoReabasteci(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/no`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}