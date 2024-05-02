import axios from 'axios';

//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function registrar(nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia) {
    try {

        const response = await axios.post(`${BASE_URL}/pacientes/registrar`, { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function registrarHistoriaClinica(id_paciente, motivo_consulta, enfermedad_actual, antecedentes, diagnostico_cie, diagnostico_medico, tratamiento, observaciones, presion_arterial, peso, talla, temperatura_corporal, frecuencia_respiratoria, frecuencia_cardiaca, saturacion_oxigeno, examen_fisico_general, examen_piel) {
    try {

        const response = await axios.post(`${BASE_URL}/pacientes/registrarHistoriaClinica`, { id_paciente, motivo_consulta, enfermedad_actual, antecedentes, diagnostico_cie, diagnostico_medico, tratamiento, observaciones, presion_arterial, peso, talla, temperatura_corporal, frecuencia_respiratoria, frecuencia_cardiaca, saturacion_oxigeno, examen_fisico_general, examen_piel });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}



export async function actualizar(id, nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/actualizar/${id}`, { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function eliminar(id) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/delete/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/eliminarPacientes`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/pacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarHistoriaClinica(id) {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/historiaClinica/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarEvolucionPaciente(id) {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/evolucionPaciente/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarMedicoPerfil(id) {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/medico/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarFichasMedico(id, fecha) {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/fichasMedico/${id}/${fecha}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function finalizarFicha(id) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/finalizarFicha/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function insertarEvolucionMedica(id, id_paciente, nota_evolucion, peso, altura, imc, tratamiento, fecha_evolucion) {
    try {
        const response = await axios.post(`${BASE_URL}/pacientes/evolucionMedica`, { id, id_paciente, nota_evolucion, peso, altura, imc, tratamiento, fecha_evolucion });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
