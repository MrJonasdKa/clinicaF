import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';
//const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';
//const BASE_URL = "https://clinica-back-end.vercel.app/4000/api"

//Reportes usuarios
export async function mostrarUsuarios() {
    try {
        const response = await axios.get(`${BASE_URL}/reportes/usuarios`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function informeUsuarios(fechaInicio, fechaFin, estado) {
    try {
      let url = `${BASE_URL}/reportes/informeUsuarios?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
  
      if (estado) {
        url += `&estado=${estado}`; // Agregar el parámetro de estado a la URL si está presente
      }
  
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
}
  

//Reportes pacientes
export async function mostrarPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/reportes/pacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function informePacientes(fechaInicio, fechaFin, genero) {
    try {
      let url = `${BASE_URL}/reportes/informePacientes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
  
      if (genero && (genero === 'Masculino' || genero === 'Femenino')) {
        url += `&genero=${genero}`; // Agregar el parámetro de género a la URL si se selecciona un género válido
      }
  
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
}

//Reportes servicios
export async function mostrarFechaServicios() {
    try {
        const response = await axios.get(`${BASE_URL}/reportes/fechaServicios`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarCategorias() {
    try {
        const response = await axios.get(`${BASE_URL}/reportes/categorias`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function informeServicios(fechaInicio, fechaFin, categoria) {
    try {
      let url = `${BASE_URL}/reportes/informeServicios?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

      if (categoria && categoria.trim() !== '') {
        // Verificar que la categoría no sea vacía ni contenga solo espacios en blanco
        url += `&categoria=${categoria}`; // Agregar el parámetro de categoría a la URL si no está vacío
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
}

//Reportes proveedores
export async function mostrarProveedores() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/proveedores`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function informeProveedores(estado) {
  try {
    let url = `${BASE_URL}/reportes/informeProveedores?`;

    if (estado) {
      url += `&estado=${estado}`; // Agregar el parámetro de estado a la URL si está presente
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//Reportes productos
export async function mostrarProductos() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/productos`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function mostrarCategoriasProductos() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/categoriaProductos`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}


export async function informeProductos(fechaInicio, fechaFin, nombre_categoria) {
  try {
    let url = `${BASE_URL}/reportes/informeProductos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    if (nombre_categoria && nombre_categoria.trim() !== '') {
      // Verificar que la categoría no sea vacía ni contenga solo espacios en blanco
      url += `&nombre_categoria=${nombre_categoria}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//Reportes reabastecimiento
export async function mostrarReabastecimiento() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/reabastecimiento`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function mostrarNombreProveedorReabastecimiento() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/nombreProveedorReabastecimiento`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function informeReabastecimiento(fechaInicio, fechaFin, nombre_proveedor) {
  try {
    let url = `${BASE_URL}/reportes/informeReabastecimiento?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    if (nombre_proveedor && nombre_proveedor.trim() !== '') {
      // Verificar que la categoría no sea vacía ni contenga solo espacios en blanco
      url += `&nombre_proveedor=${nombre_proveedor}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}


//Reportes ventas
export async function mostrarVentas() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/ventas`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function mostrarNombreMedicamentoVentas() {
  try {
      const response = await axios.get(`${BASE_URL}/reportes/nombreMedicamentoVentas`);
      return response.data;
  }
  catch (error) {
      throw error;
  }
}

export async function informeVentas(fechaInicio, fechaFin, nombre_medicamento) {
  try {
    let url = `${BASE_URL}/reportes/informeVentas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    if (nombre_medicamento && nombre_medicamento.trim() !== '') {
      // Verificar que la categoría no sea vacía ni contenga solo espacios en blanco
      url += `&nombre_medicamento=${nombre_medicamento}`; // Agregar el parámetro de categoría a la URL si no está vacío
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
