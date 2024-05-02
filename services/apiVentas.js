import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

//listara todos los ventas que estas con estado 1 o activo o true
export async function listarVentas() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//listar toas las ventas inactivas con estado 0
export async function listarNoVentas() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/no`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/pacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarMedicamentos() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/medicamentos`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//lo que hara es registrar nuevos ventas con sus datos correcpondientes
export async function registrar(id_medicamento, cantidad_vendida, paciente_id, fecha_venta, total_venta) {
    try {
        const response = await axios.post(`${BASE_URL}/ventas/registrar`, { id_medicamento, cantidad_vendida, paciente_id, fecha_venta, total_venta });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//actualizara los ventas que no esten bien registrados 
export async function actualizar(id_venta, id_medicamento, cantidad_vendida, paciente_id, fecha_venta, total_venta) {
    try {
        const response = await axios.put(`${BASE_URL}/ventas/modificar/${id_venta}`, { id_medicamento, cantidad_vendida, fecha_venta, paciente_id, total_venta });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

//eliminara o cambiara el estado de activo a inactivo de una venta en especifico 
export async function eliminar(id_venta) {
    try {
        const response = await axios.put(`${BASE_URL}/ventas/eliminar/${id_venta}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//eliminara o cambiara el estado de activo a inactivo de varias ventas
export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/ventas/eliminarventas`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//Estadisticas

export async function mostrarTotalVentas() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/ventaTotal`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarVentasPorMedicamento() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/ventaMedicamento`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarMedicamentoMasVendido() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/ventaMedicamentoMasVendido`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarPromedioVentasMes() {
    try {
        const response = await axios.get(`${BASE_URL}/ventas/ventasPromedioMes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}