import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function registrar(nombre_servicio, descripcion_servicio, id_categoria, imagen) {
    try {
        const formData = new FormData();
        formData.append('nombre_servicio', nombre_servicio);
        formData.append('descripcion_servicio', descripcion_servicio);
        formData.append('id_categoria', id_categoria);
        formData.append('imagen', imagen);

        const response = await axios.post(`${BASE_URL}/servicios/registrar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function registrarCategoria(nombre_categoria, descripcion_categoria, imagen) {
    try {
        const formData = new FormData();
        formData.append('nombre_categoria', nombre_categoria);
        formData.append('descripcion_categoria', descripcion_categoria);
        formData.append('imagenCategoria', imagen);

        const response = await axios.post(`${BASE_URL}/servicios/registrarCategoria`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function actualizar(id, nombre_servicio, descripcion_servicio, id_categoria, imagen) {
    try {
        const formData = new FormData();
        formData.append('nombre_servicio', nombre_servicio);
        formData.append('descripcion_servicio', descripcion_servicio);
        formData.append('id_categoria', id_categoria);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const response = await axios.put(`${BASE_URL}/servicios/actualizar/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}



export async function eliminar(id) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminar/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminarServicios`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarServicios() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarServiciosID(id_categoria) {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/servicios/${id_categoria}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarServiciosIDmedico(id_medico) {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/serviciosMedico/${id_medico}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarMedicosIDservicio(id_servicio) {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/medicos/${id_servicio}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//Categorias

export async function listarCategorias() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/categorias`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function actualizarCategoria(id, nombre_categoria, descripcion_categoria) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/actualizarCategoria/${id}`, { nombre_categoria, descripcion_categoria });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function habilitarServicio(id) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/estadoHabilitado/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarCategoria(id) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminarCategoria/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarVariasCategorias(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminarCategorias`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function mostrarPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/pacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


//FICHAJE
export async function registrarFicha(id_paciente, id_medico, id_servicio, fecha) {
    try {
        const response = await axios.post(`${BASE_URL}/servicios/registrarFicha`, {id_paciente, id_medico, id_servicio, fecha});
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarPacienteID(id) {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/pacienteID/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarFichas(fecha){
    try {
        const response = await axios.get(`${BASE_URL}/servicios/fichas/${fecha}`);
        return response.data;
    }
    catch (error){
        throw error;
    }
}

export async function eliminarFicha(id) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/cancelarFicha/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

//Estadisticas

export async function mostrarFichasServicio(id_categoria) {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/conteoFichasServicio/${id_categoria}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarFichasMasSolicitadas() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/conteoFichasTotal`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarFichasTotales() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/conteoFichasTotalTabla`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarPacientesTotal() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/conteoPacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function mostrarVentasPorMes() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/conteoVentasPorMes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}