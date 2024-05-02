import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

//listara todos los producto que estas con estado 1 o activo o true
export async function listarProductos(){
    try {
        const response = await axios.get(`${BASE_URL}/productos/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//listara todos los productos que no esten disponibles o eliminados
export async function listarNoProductos(){
    try {
        const response = await axios.get(`${BASE_URL}/productos/no`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//listara las diferentes categorias a las que puede pertenecer el producto o medicamneto
export async function listarCategorias(){
    try {
        const response = await axios.get(`${BASE_URL}/productos/categoriamed`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//listara los diferentes proveedores o laboratorios a las que puede pertenecer el producto o medicamneto
export async function listarProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/productos/proveedoresmed`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//lo que hara es registrar nuevos productos con sus datos correcpondientes
export async function registrar(nombre_medicamento,proveedor_id,categoria_id,precio_unitario,cantidad,fecha_caducidad) {
    try {
        const response = await axios.post(`${BASE_URL}/productos/registrar`, {nombre_medicamento,proveedor_id,categoria_id,precio_unitario,cantidad,fecha_caducidad});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//se registrar nueva categoria para productos
export async function registrarCategoria(nombre_categoria, descripcion) {
    try {
        const response = await axios.post(`${BASE_URL}/productos/registrarcategoria`, {nombre_categoria, descripcion});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//actualizara los productos que no esten bien registrados 
export async function actualizar(id_medicamento ,nombre_medicamento, proveedor_id ,categoria_id, precio_unitario, cantidad, fecha_caducidad ){
    try {
        const response = await axios.put(`${BASE_URL}/productos/modificar/${id_medicamento}`,{nombre_medicamento, proveedor_id ,categoria_id, precio_unitario, cantidad, fecha_caducidad});
        return response.data;
    }
    catch(error){
        throw error;
    }

}

//eliminara o cambiara el estado de activo a inactivo de un producto en especifico 
export async function eliminar(id_medicamento){
    try {
        const response = await axios.put(`${BASE_URL}/productos/eliminar/${id_medicamento}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//eliminara o cambiara el estado de activo a inactivo de varios productos
export async function eliminarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/productos/eliminarProductos`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//retornara o cambiara el estado de inactivo a activo de un producto en especifico 
export async function retornar(id_medicamento){
    try {
        const response = await axios.put(`${BASE_URL}/productos/regresar/${id_medicamento}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//retornara o cambiara el estado de inactivo a activo de varios productos
export async function retornarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/productos/regresarProductos`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}


