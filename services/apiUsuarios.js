import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

export async function addUsuarios(nombres, apellidos, correo, contrasenia, rol) {
    try {
        const response = await axios.post(`${BASE_URL}/usuarios/registrar`, { nombres, apellidos, correo, contrasenia, rol });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addMedicos(id_usuario, id_servicio, especialidad) {
    try {
        const response = await axios.post(`${BASE_URL}/usuarios/registrarMedico`, { id_usuario, id_servicio, especialidad });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addHorarioMedico(id_medico, dia_semana, hora_inicio, hora_final, fichas_disponibles) {
    try {
        const response = await axios.post(`${BASE_URL}/usuarios/registrarHorarioMedico`, { id_medico, dia_semana, hora_inicio, hora_final, fichas_disponibles });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function actualizar(id, nombres, apellidos, correo, contrasenia, rol) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/actualizar/${id}`, { nombres, apellidos, correo, contrasenia, rol });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function actualizarFotoPerfil(id, imagen) {
    try {
        const formData = new FormData();
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const response = await axios.put(`${BASE_URL}/usuarios/actualizarImagenPerfil/${id}`, formData, {
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

export async function actualizarEstadoHabilitado(id) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/estadoHabilitado/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function actualizarEstadoDeshabilitado(id) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/estadoDeshabilitado/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUsuario(id) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function mostrarUsuarios() {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function mostrarUsuariosEstado() {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/usuariosEstado`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function mostrarUsuariosMedicos() {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/medicos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUsuario(id) {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/usuario/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getHorariosID(id_medico) {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/horariosID/${id_medico}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMedicoID(id_usuario) {
    try {
      const response = await axios.get(`${BASE_URL}/usuarios/medicoID/${id_usuario}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

export async function updateUsuario(id, nombres, apellidos, correo) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/actualizar/${id}`, {
            nombres,
            apellidos,
            correo
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function filtrarUsuarios(nombres, correo) {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/filtrar?nombres=${nombres}&correo=${correo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
