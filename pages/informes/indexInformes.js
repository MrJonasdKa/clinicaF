import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { ListBox } from 'primereact/listbox';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';

import { mostrarUsuarios, informeUsuarios, mostrarPacientes, informePacientes, mostrarFechaServicios, informeServicios, listarCategorias, mostrarProveedores, informeProveedores, mostrarProductos, mostrarCategoriasProductos, informeProductos, mostrarReabastecimiento, mostrarNombreProveedorReabastecimiento, informeReabastecimiento, mostrarVentas, mostrarNombreMedicamentoVentas, informeVentas } from '../../services/apiReportes';
import { getUsuario } from '../../services/apiUsuarios';

import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';

import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Informes = ({ usuarioId }) => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador'];

    useEffect(()=>{
        if (typeof window !== 'undefined') {
            const rolUsuarioEncriptado = localStorage.getItem('userRole');
            if (session == null || rolUsuarioEncriptado == null) {
                router.replace('/pages/notfound');
                return;
            }
            const rolUsuario = decryptData(rolUsuarioEncriptado);
            if (!rolesPermitidos.includes(rolUsuario)) {
                router.replace('/pages/notfound');
                return;
            }
        }
    });

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    const [id, setid] = useState(null);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');

    //Usuarios
    const [usuarios, setUsuarios] = useState([]);
    const [fechaInicioUsuarios, setFechaInicioUsuarios] = useState(null);
    const [fechaFinUsuarios, setFechaFinUsuarios] = useState(null);
    const [estadoUsuarios, setEstadoUsuarios] = useState('');

    //Pacientes
    const [pacientes, setPacientes] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [genero, setGenero] = useState('');

    //Servicios
    const [servicios, setServicios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [fechaInicioServicios, setFechaInicioServicios] = useState(null);
    const [fechaFinServicios, setFechaFinServicios] = useState(null);

    //Proveedores
    const [proveedores, setProveedores] = useState([]);
    const [estadoProveedores, setEstadoProveedores] = useState('');
    
    //Productos
    const [productos, setProductos] = useState([]);
    const [categoriasProductos, setCategoriasProductos] = useState([]);
    const [fechaInicioProductos, setFechaInicioProductos] = useState(null);
    const [fechaFinProductos, setFechaFinProductos] = useState(null);

    //Reabastecimiento
    const [reabastecimiento, setReabastecimiento] = useState([]);
    const [nombreProveedorReabastecimiento, setNombreProveedorReabastecimiento] = useState([]);
    const [fechaInicioReabastecimiento, setFechaInicioReabastecimiento] = useState(null);
    const [fechaFinReabastecimiento, setFechaFinReabastecimiento] = useState(null);

    //Ventas
    const [ventas, setVentas] = useState([]);
    const [nombreMedicamentoVentas, setNombreMedicamentoVentas] = useState([]);
    const [fechaInicioVentas, setFechaInicioVentas] = useState(null);
    const [fechaFinVentas, setFechaFinVentas] = useState(null);

    const [serviceDialogExportar, setServiceDialogExportar] = useState('');

    
    //Usuarios
    const cargarUsuarios = async () => {
        try {
            setFechaInicioUsuarios(null);
            setFechaFinUsuarios(null);
            setEstadoUsuarios(null);

            const usuarios = await mostrarUsuarios();
            setUsuarios(usuarios);
        } catch (error) {
            console.log(error);
        }
    };

    const cargarInformeUsuarios = async (fechaInicio, fechaFin, estado) => {
        try {
          const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
          const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
      
          console.log(fechaInicioFormateada);
          console.log(fechaFinFormateada);
          console.log(estado);
      
          const usuarios = await informeUsuarios(fechaInicioFormateada, fechaFinFormateada, estado);
      
          console.log(usuarios);
          setUsuarios(usuarios);
        } catch (error) {
          console.log(error);
        }
    };
      

    //Pacientes
    const cargarPacientes = async () => {
        try {
            setFechaInicio(null);
            setFechaFin(null);
            setGenero(null);
            const pacientes = await mostrarPacientes();
            setPacientes(pacientes);
        } catch (error) {
            console.log(error);
        }
    };

    const cargarInformePacientes = async (fechaInicio, fechaFin, genero) => {
        try {
            const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
            const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
            console.log(fechaInicioFormateada);
            console.log(fechaFinFormateada);
            const pacientes = await informePacientes(fechaInicioFormateada, fechaFinFormateada, genero); // Pasar el valor de género a la función
            console.log(pacientes);
            console.log(genero);
            setPacientes(pacientes);
        } catch (error) {
            console.log(error);
        }
    };

    //Servicios
    const cargarServicios = async () => {
        try {
            setFechaInicioServicios(null);
            setFechaFinServicios(null);
            setSeleccionarCategoria(null);
            const servicios = await mostrarFechaServicios();
            setServicios(servicios);
        } catch (error) {
            console.log(error);
        }
    };
      
    const cargarInformeServicios = async (fechaInicio, fechaFin, categoria) => {
        try {
          const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
          const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
      
          console.log(fechaInicioFormateada);
          console.log(fechaFinFormateada);
          console.log(seleccionarCategoria);

          const categoriaFormateada = typeof categoria === 'string' ? categoria.trim() : '';
      
          const servicios = await informeServicios(fechaInicioFormateada, fechaFinFormateada, categoriaFormateada);
      
          console.log(servicios);
          setServicios(servicios);
        } catch (error) {
          console.log(error);
        }
      };

    //Proveedores
    const cargarProveedores = async () => {
        try {
            setEstadoProveedores(null);

            const proveedores = await mostrarProveedores();
            setProveedores(proveedores);
        } catch (error) {
            console.log(error);
        }
    };

    const cargarInformeProveedores = async (estado) => {
        try {
          console.log(estado);
      
          const proveedores = await informeProveedores(estado);
      
          console.log(proveedores);
          setProveedores(proveedores);
        } catch (error) {
          console.log(error);
        }
    };


    //Productos
    const cargarProductos = async () => {
        try {
            setFechaInicioProductos(null);
            setFechaFinProductos(null);

            const productos = await mostrarProductos();
            setProductos(productos);
        } catch (error) {
            console.log(error);
        }
    };  

    const cargarInformeProductos = async (fechaInicio, fechaFin, nombre_categoria) => {
        try {
          const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
          const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
      
          console.log(fechaInicioFormateada);
          console.log(fechaFinFormateada);

          const nombreCartegoriaFormateada = typeof nombre_categoria === 'string' ? nombre_categoria.trim() : '';
          console.log(nombre_categoria);
      
          const productos = await informeProductos(fechaInicioFormateada, fechaFinFormateada, nombreCartegoriaFormateada);

          console.log(productos);
          setProductos(productos);
        } catch (error) {
          console.log(error);
        }
    };


    //Reabastecimiento
    const cargarReabastecimiento = async () => {
        try {
            setFechaInicioReabastecimiento(null);
            setFechaFinReabastecimiento(null);
            setSeleccionarNombreProveedorReabastecimiento(null);

            const reabastecimiento = await mostrarReabastecimiento();
            setReabastecimiento(reabastecimiento);
        } catch (error) {
            console.log(error);
        }
    };  

    const cargarInformeReabastecimiento = async (fechaInicio, fechaFin, nombre_proveedor) => {
        try {
          const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
          const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
      
          console.log(fechaInicioFormateada);
          console.log(fechaFinFormateada);

          const nombreProveeedorReabastecimientoFormateada = typeof nombre_proveedor === 'string' ? nombre_proveedor.trim() : '';
          console.log(nombre_proveedor);
      
          const reabastecimiento = await informeReabastecimiento(fechaInicioFormateada, fechaFinFormateada, nombreProveeedorReabastecimientoFormateada);
      
          console.log(reabastecimiento);
          setReabastecimiento(reabastecimiento);
        } catch (error) {
          console.log(error);
        }
    };

    //Ventas
    const cargarVentas = async () => {
        try {
            setFechaInicioVentas(null);
            setFechaFinVentas(null);
            setSeleccionarNombreMedicamento(null);

            const ventas = await mostrarVentas();
            setVentas(ventas);
        } catch (error) {
            console.log(error);
        }
    };  

    const cargarInformeVentas= async (fechaInicio, fechaFin, nombre_medicamento) => {
        try {
          const fechaInicioFormateada = fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : '';
          const fechaFinFormateada = fechaFin ? format(fechaFin, 'yyyy-MM-dd') : '';
      
          console.log(fechaInicioFormateada);
          console.log(fechaFinFormateada);

          const nombreMedicamentoFormateada = typeof nombre_medicamento === 'string' ? nombre_medicamento.trim() : '';
          console.log(nombre_medicamento);
      
          const ventas = await informeVentas(fechaInicioFormateada, fechaFinFormateada, nombreMedicamentoFormateada);
      
          console.log(ventas);
          setVentas(ventas);
        } catch (error) {
          console.log(error);
        }
    };


    ///////////////////////////////////////////////////////////////////////
    //Usuarios
    useEffect(() => {
        async function listarUsuarios() {
            try {
                const usuarios = await mostrarUsuarios();
                setUsuarios(usuarios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarUsuarios();
    }, []);

    const idUsuariosBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {usuarios.id}
            </>
        );
    };

    const nombresUsuariosBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {usuarios.nombres}
            </>
        );
    };

    const apellidosUsuariosBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {usuarios.apellidos}
            </>
        );
    };

    const fechaCreacionUsuarioBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Fecha Nacimiento</span>
                {usuarios.fecha_creacion}
            </>
        );
    };

    const correoElectronicoUsuarioBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {usuarios.correo}
            </>
        );
    };

    const rolUsuarioBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {usuarios.rol}
            </>
        );
    };

    const estadoUsuarioBodyTemplate = (usuarios) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {usuarios.estado === 1 ? "Activo" : "Inactivo"}
            </>
        );
    };


    //Pacientes
    useEffect(() => {
        async function listarPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                setPacientes(pacientes);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarPacientes();
    }, []);

    const idPacientesBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nombresBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.nombres}
            </>
        );
    };

    const apellidosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.apellidos}
            </>
        );
    };

    const fechaNacimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Nacimiento</span>
                {rowData.fecha_nacimiento}
            </>
        );
    };

    const sexoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sexo</span>
                {rowData.sexo}
            </>
        );
    };

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    };

    const correoElectronicoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.correo_electronico}
            </>
        );
    };


    //////////////////////////////////////////////////////////////////////
    //SERVICIOS

    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    useEffect(() => {
        async function listarServicios() {
            try {
                const servicios = await mostrarFechaServicios();
                setServicios(servicios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, []);


    const idServiciosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.codigo}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_servicio}
            </>
        );
    };


    const categoriaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.nombre_categoria}
            </>
        );
    };

    const fechaBodyTemplate = (rowData) => {
        //return formatDate(rowData.fecha_creacion);
        return (
            <>
                <span className="p-column-title">Fecha creacion</span>
                {rowData.fecha_creacion}
            </>
        );
    };

    //////////////////////////////////////////////////////////////////////
    //PROVEEDORES

    useEffect(() => {
        async function listarProveedores() {
            try {
                const proveedores = await mostrarProveedores();
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        listarProveedores();
    }, []);
    

    const idProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_proveedor}
            </>
        );
    };
    const nombreProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_proveedor}
            </>
        );
    };
    const representanteProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Representante</span>
                {rowData.representante}
            </>
        );
    };
    const telefonoProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    };
    const descripcionProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion_proveedor}
            </>
        );
    };
    const estadoProveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.estado === 1 ? "Activo" : "Inactivo"}
            </>
        );
    };

    //////////////////////////////////////////////////////////////////////
    //Productos
    useEffect(()=>{
        async function listarProductos() {
            try {
                const productos = await mostrarProductos();
                setProductos(productos);
            } catch (error) {
                console.log(error);   
            }
        }
        listarProductos();
    }, []);

    useEffect(() => {
        async function obtenerCategoriasProductos() {
            try {
                const categoriasProductos = await mostrarCategoriasProductos();
                console.log(categoriasProductos)
                setCategoriasProductos(categoriasProductos);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategoriasProductos();
    }, []);

    const idProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_medicamento}
            </>
        );
    };
    const nombreProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_medicamento}
            </>
        );
    };
    const proveedorProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proveedor</span>
                {rowData.nombre_proveedor}
            </>
        );
    };
    const categoriaProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.nombre_categoria}
            </>
        );
    };
    const precioProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Unitario</span>
                {rowData.precio_unitario}
            </>
        );
    };
    const cantidadProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad}
            </>
        );
    };
    const fechaProductosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Caducidad</span>
                {rowData.fecha_caducidad}
            </>
        );
    };

    //////////////////////////////////////////////////////////////////////
    //Reabastecimiento
    useEffect(() => {
        async function listarReabastecimientos() {
            try {
                const reabastecimiento = await mostrarReabastecimiento();
                setReabastecimiento(reabastecimiento);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarReabastecimientos();
    }, []);

    useEffect(()=>{
        async function listarNombreProveedorReabastecimiento() {
            try {
                const nombreProveedorReabastecimiento= await mostrarNombreProveedorReabastecimiento();
                setNombreProveedorReabastecimiento(nombreProveedorReabastecimiento);
            } catch (error) {
                console.log(error);
            }
        }
        listarNombreProveedorReabastecimiento();
    },[]);

    const idReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_reabastecimiento}
            </>
        );
    };
    const pedidoReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Pedido Producto</span>
                {rowData.pedido_producto}
            </>
        );
    };
    const proveedorReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proveedor</span>
                {rowData.nombre_proveedor}
            </>
        );
    };
    const cantidadReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad Pedida</span>
                {rowData.cantidad_reabastecida}
            </>
        );
    };
    const fechaReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Pedido</span>
                {rowData.fecha_reabastecimiento}
            </>
        );
    };
    const precioReabastecimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Total</span>
                {rowData.costo_total}
            </>
        );
    };

    //////////////////////////////////////////////////////////////////////
    //Reabastecimiento
    useEffect(()=>{
        async function listarVentas() {
            try {
                const ventas = await mostrarVentas();
                setVentas(ventas);
            } catch (error) {
                console.log(error);
            }
        }
        listarVentas();
    },[]);

    useEffect(()=>{
        async function listarNombreMedicamentosVentas() {
            try {
                const nombreMedicamentoVentas = await mostrarNombreMedicamentoVentas();
                setNombreMedicamentoVentas(nombreMedicamentoVentas);
            } catch (error) {
                console.log(error);
            }
        }
        listarNombreMedicamentosVentas();
    },[]);

    const idVentasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_venta}
            </>
        );
    };
    const nombreVentasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre </span>
                {rowData.nombre_medicamento}
            </>
        );
    };
    const cantidadVentasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad_vendida}
            </>
        );
    };
    const fechaVentasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Venta</span>
                {rowData.fecha_venta}
            </>
        );
    };
    const precioVentasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Total</span>
                {rowData.total_venta}
            </>
        );
    };
    

    //Exportar
    const openNewExportar = () => {
        setServiceDialogExportar(true);
    };
    const hideDialogExportar = () => {
        setServiceDialogExportar(false);
    };
    //Fin

    ///////////////////////////////////////////////////////////////////
    const [seleccionarInforme, setSeleccionarInforme] = useState(null);
    const informe = [
        { name: 'Usuarios', code: 'USU' },
        { name: 'Pacientes', code: 'PAC' },
        { name: 'Servicios', code: 'SER' },
        { name: 'Proveedores', code: 'PRO' },
        { name: 'Productos', code: 'PROD' },
        { name: 'Reabastecimiento', code: 'REA' },
        { name: 'Ventas', code: 'VEN' }
    ];

    const handleInformeChange = (e) => {
        setSeleccionarInforme(e.value);
    };

    /////////////////////////////////////////////////////////////////////////
    //DROPBOX

    //SERVICIOS
    const [seleccionarCategoria, setSeleccionarCategoria] = useState(null);

    const handleCategoriaChange = (event) => {
        setSeleccionarCategoria(event.value);
    };

    //SERVICIOS
    const [seleccionarCategoriaProductos, setSeleccionarCategoriaProductos] = useState(null);

    const handleCategoriaProductosChange = (event) => {
        setSeleccionarCategoriaProductos(event.value);
    };

    //REABASTECIMIENTO
    const [seleccionarNombreProveedorReabastecimiento, setSeleccionarNombreProveedorReabastecimiento] = useState(null);

    const handleNombreProveedorReabastecimientoChange = (event) => {
        setSeleccionarNombreProveedorReabastecimiento(event.value);
    };

    //VENTAS
    const [seleccionarNombreMedicamento, setSeleccionarNombreMedicamento] = useState(null);

    const handleNombreMedicamentoChange = (event) => {
        setSeleccionarNombreMedicamento(event.value);
    };
    ////////////////////////////////////////////////////////////////////

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de informes</h5>
            <Dropdown value={seleccionarInforme} onChange={handleInformeChange} options={informe} optionLabel="name" placeholder="Selecciona la categoria del informe" className="w-100 mw-100"/>
        </div>
    );

    ////////////////////////////////////////////////////////////
    const cargarUsuario = async (id) => {
        try {
          let usuario;
          if (id) {
            usuario = await getUsuario(id);
          } else {
            const userData = JSON.parse(localStorage.getItem('userData'));
            usuario = {
              id: userData.id,
              nombres: userData.nombres,
              apellidos: userData.apellidos,
            };
            console.log(usuario);
          }
          setid(usuario.id);
          setNombres(usuario.nombres);
          setApellidos(usuario.apellidos);
        } catch (error) {
          console.error('Error al cargar el usuario:', error);
        }
      };
    
    useEffect(() => {
        cargarUsuario(usuarioId);
      }, [usuarioId]);

    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Usuarios
    function exportToPDFUsuarios() {
        if (usuarios.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de usuarios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
      
            const doc = new jsPDF();
      
            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);
      
            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);
      
      
      
            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);
      
      
            // Título
            const title = 'Informe de usuarios';
            doc.setFontSize(18);
            doc.text(title, 10, 35);
      
            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los usuarios registrados en la clinica CIES. El informe incluye información relevante sobre cada usuario, como el nombre, apellido, correo y rol.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 70;
      
            const tableColumns = [
                { header: 'Nombre', dataKey: 'nombre' },
                { header: 'Apellido', dataKey: 'apellido' },
                { header: 'Correo', dataKey: 'correo' },
                { header: 'Rol', dataKey: 'rol' },
                { header: 'FechaCreacion', dataKey: 'fecha_creacion' },
                { header: 'Estado', dataKey: 'estado' } 
            ];
            
            const tableData = usuarios.map(usuarios => ({
                nombre: usuarios.nombres,
                apellido: usuarios.apellidos,
                correo: usuarios.correo,
                rol: usuarios.rol,
                fecha_creacion: usuarios.fecha_creacion,
                estado: usuarios.estado === 1 ? "Activo" : "Inactivo"
            }));
      
            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });
      
            doc.save('tabla_usuarios.pdf');
        }
    }
    
    
    function exportToExcelUsuarios() {
        if (usuarios.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de usuarios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Nombre', dataKey: 'nombre' },
                { header: 'Apellido', dataKey: 'apellido' },
                { header: 'Correo', dataKey: 'correo' },
                { header: 'Rol', dataKey: 'rol' },
                { header: 'FechaCreacion', dataKey: 'fecha_creacion' },
                { header: 'Estado', dataKey: 'estado' } 
            ];
            
            const tableData = usuarios.map(usuarios => ({
                nombre: usuarios.nombres,
                apellido: usuarios.apellidos,
                correo: usuarios.correo,
                rol: usuarios.rol,
                fecha_creacion: usuarios.fecha_creacion,
                estado: usuarios.estado === 1 ? "Activo" : "Inactivo"
                
            }));
        
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_usuarios.xlsx';
            excelLink.click();
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Pacientes
    async function exportToPDFPacientes() {
        if (pacientes.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de pacientes no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);



            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);


            // Título
            const title = 'Informe de pacientes';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los pacientes registrados en nuestra aplicación. El informe incluye información relevante sobre cada paciente, como sus nombres, apellidos, fecha de nacimiento, telefono, y el correo.';
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() + 10);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 70;

            const tableColumns = [
                { header: 'Nombres', dataKey: 'nombres' },
                { header: 'Apellidos', dataKey: 'apellidos' },
                { header: 'Fecha de nacimiento', dataKey: 'fecha_nacimiento' },
                { header: 'Genero', dataKey: 'sexo' },
                { header: 'Telefono', dataKey: 'telefono' },
                { header: 'Correo', dataKey: 'correo_electronico' },
                { header: 'Ciudad', dataKey: 'ciudad' },
            ];
            
            const tableData = pacientes.map(pacientes => ({
                nombres: pacientes.nombres,
                apellidos: pacientes.apellidos,
                fecha_nacimiento: new Date(pacientes.fecha_nacimiento).toLocaleDateString(),
                sexo: pacientes.sexo,
                telefono: pacientes.telefono,
                correo_electronico: pacientes.correo_electronico,
                ciudad: pacientes.ciudad
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_pacientes.pdf');
        }
        
    }


    function exportToExcelPacientes() {

        if (pacientes.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de pacientes no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
            console.log(seleccionarInforme);
            
            const tableColumns = [
            { header: 'Nombres', dataKey: 'nombres' },
            { header: 'Apellidos', dataKey: 'apellidos' },
            { header: 'Fecha de nacimiento', dataKey: 'fecha_nacimiento' },
            { header: 'Telefono', dataKey: 'telefono' },
            { header: 'Correo', dataKey: 'correo_electronico' },
            { header: 'Ciudad', dataKey: 'ciudad' },
            ];
        
            const tableData = pacientes.map(pacientes => ({
                nombres: pacientes.nombres,
                apellidos: pacientes.apellidos,
                fecha_nacimiento: new Date(pacientes.fecha_nacimiento).toLocaleDateString(),
                telefono: pacientes.telefono,
                correo_electronico: pacientes.correo_electronico,
                ciudad: pacientes.ciudad
            }));
        
            doc.autoTable(tableColumns, tableData, {
            startY: 60,
            margin: { top: 10 },
            });
        
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
        
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
        
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_pacientes.xlsx';
            excelLink.click();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Servicios
    function exportToPDFServicios() {
        if (servicios.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de servicios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);



            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

            // Título
            const title = 'Informe de Servicios';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los servicios disponibles en nuestra aplicación. Estos servicios son utilizados por nuestros clientes para satisfacer sus necesidades en diferentes áreas. El informe incluye información relevante sobre cada servicio, como su nombre, descripción, precio, categoría y fecha de creación. Esperamos que este informe sea útil para comprender mejor nuestra oferta de servicios.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 80;

            const tableColumns = [
                { header: 'Codigo', dataKey: 'codigo'},
                { header: 'Nombre', dataKey: 'nombre_servicio' },
                { header: 'Categoria', dataKey: 'nombre_categoria' },
                { header: 'Fecha creacion', dataKey: 'fecha_creacion' },
            ];

            const tableData = servicios.map(servicio => ({
                codigo: servicio.codigo,
                nombre_servicio: servicio.nombre_servicio,
                nombre_categoria: servicio.nombre_categoria,
                fecha_creacion: servicio.fecha_creacion
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_servicios.pdf');
        }
    }

    function exportToExcelServicios() {
        if (servicios.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de servicios está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de servicios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Codigo', dataKey: 'codigo'},
                { header: 'Nombre', dataKey: 'nombre_servicio' },
                { header: 'Categoria', dataKey: 'nombre_categoria' },
                { header: 'Fecha creacion', dataKey: 'fecha_creacion' },
            ];
            
            const tableData = servicios.map(servicio => ({
                codigo: servicio.codigo,
                nombre_servicio: servicio.nombre_servicio,
                nombre_categoria: servicio.nombre_categoria,
                fecha_creacion: servicio.fecha_creacion
            }));
            
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_servicios.xlsx';
            excelLink.click();
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Proveedores
    function exportToPDFProveedores() {
        if (proveedores.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de provedores está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de provedores no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);



            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

            // Título
            const title = 'Informe de proveedores';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los proveedores relacionados con la clinica CIES. El informe incluye información relevante sobre cada proveedor, como el nombre, representante, telefono y descripcion del proveedor. Esperamos que este informe sea útil para comprender mejor nuestros proveedores.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 75;

            const tableColumns = [
                { header: 'Nombre del proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Representante', dataKey: 'representante' },
                { header: 'Telefono', dataKey: 'telefono' },
                { header: 'Descripcion del proveedor', dataKey:'descripcion_proveedor' },
                { header: 'Estado', dataKey: 'estado' } 
            ];
            
            const tableData = proveedores.map(proveedores => ({
                nombre_proveedor: proveedores.nombre_proveedor,
                representante: proveedores.representante,
                telefono: proveedores.telefono,
                descripcion_proveedor: proveedores.descripcion_proveedor,
                estado: proveedores.estado === 1 ? "Activo" : "Inactivo"
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_provedores.pdf');
        }
    }

    function exportToExcelProveedores() {
        if (proveedores.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de proveedores está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de proveedores no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Nombre del proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Representante', dataKey: 'representante' },
                { header: 'Telefono', dataKey: 'telefono' },
                { header: 'Descripcion del proveedor', dataKey:'descripcion_proveedor' },
                { header: 'Estado', dataKey: 'estado' } 
            ];
            
            const tableData = proveedores.map(proveedores => ({
                nombre_proveedor: proveedores.nombre_proveedor,
                representante: proveedores.representante,
                telefono: proveedores.telefono,
                descripcion_proveedor: proveedores.descripcion_proveedor,
                estado: proveedores.estado === 1 ? "Activo" : "Inactivo"
            }));
            
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_provedores.xlsx';
            excelLink.click();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Productos
    function exportToPDFProductos() {
        if (productos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de productos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de productos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);

            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

            // Título
            const title = 'Informe de productos';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los productos disponibles en la clinica CIES. El informe incluye información relevante sobre cada producto, como el nombre, proveedor, categoria, precio unitario, cantida y fecha de caducidad. Esperamos que este informe sea útil para comprender mejor nuestros productos.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 75;

            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Categoría', dataKey: 'nombre_categoria' },
                { header: 'Precio unitario', dataKey:'precio_unitario' },
                { header: 'Cantidad', dataKey: 'cantidad' },
                { header: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
            ];
            
            const tableData = productos.map(productos => ({
                nombre_medicamento: productos.nombre_medicamento,
                nombre_proveedor: productos.nombre_proveedor,
                nombre_categoria: productos.nombre_categoria,
                precio_unitario: productos.precio_unitario,
                cantidad: productos.cantidad,
                fecha_caducidad: productos.fecha_caducidad,
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_productos.pdf');
        }
    }

    function exportToExcelProductos() {
        if (productos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de productos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de productos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Categoría', dataKey: 'nombre_categoria' },
                { header: 'Precio unitario', dataKey:'precio_unitario' },
                { header: 'Cantidad', dataKey: 'cantidad' },
                { header: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
            ];
            
            const tableData = productos.map(productos => ({
                nombre_medicamento: productos.nombre_medicamento,
                nombre_proveedor: productos.nombre_proveedor,
                nombre_categoria: productos.nombre_categoria,
                precio_unitario: productos.precio_unitario,
                cantidad: productos.cantidad,
                fecha_caducidad: productos.fecha_caducidad,
            }));
             
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_productos.xlsx';
            excelLink.click();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Reabastecimiento
    function exportToPDFReabastecimiento() {
        if (reabastecimiento.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de reabastecimientos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de reabastecimientos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);



            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

            // Título
            const title = 'Informe de Reabastecimientos';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado del reabastecimiento de productos de la clinica CIES. El informe incluye información relevante sobre cada pedido de reabastecimiento, como el nombre del producto solicitado, proveedor, cantidad, fecha del pedido y costo total.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 70;

            const tableColumns = [
                { header: 'Pedido Producto', dataKey: 'pedido_producto' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Cantidad', dataKey: 'cantidad_reabastecida' },
                { header: 'Fecha pedido', dataKey:'fecha_reabastecimiento' },
                { header: 'Costo total', dataKey: 'costo_total' }
            ];
            
            const tableData = reabastecimiento.map(reab => ({
                pedido_producto: reab.pedido_producto,
                nombre_proveedor: reab.nombre_proveedor,
                cantidad_reabastecida: reab.cantidad_reabastecida,
                fecha_reabastecimiento: reab.fecha_reabastecimiento,
                costo_total: reab.costo_total
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_reabastecimiento.pdf');
        }
    }

    function exportToExcelReabastecimiento() {
        if (reabastecimiento.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de reabastecimientos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Pedido Producto', dataKey: 'pedido_producto' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Cantidad', dataKey: 'cantidad_reabastecida' },
                { header: 'Fecha pedido', dataKey:'fecha_reabastecimiento' },
                { header: 'Costo total', dataKey: 'costo_total' }
            ];
            
            const tableData = reabastecimiento.map(reab => ({
                pedido_producto: reab.pedido_producto,
                nombre_proveedor: reab.nombre_proveedor,
                cantidad_reabastecida: reab.cantidad_reabastecida,
                fecha_reabastecimiento: reab.fecha_reabastecimiento,
                costo_total: reab.costo_total
            }));
            
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reabastecimiento');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_reabastecimientos.xlsx';
            excelLink.click();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //Exportar Ventas
    function exportToPDFVentas() {
        if (ventas.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de ventas está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de ventas no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Agregar nombre arriba a la derecha
            const name = "Este informe fue generado por: "+ nombres + " " + apellidos;
            const nameX = doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(name) * 5; // Ajustar posición X según el tamaño del texto
            const nameY = 10; // Ajustar posición Y según el tamaño del texto
            doc.setFontSize(12);
            doc.text(name, nameX, nameY);

            const currentDate = new Date().toLocaleDateString();
            doc.text("Fecha: " + currentDate, nameX, nameY + 10);



            const imageUrl = "/layout/images/logo-simple.png"; // Reemplaza con la dirección URL de la imagen que deseas agregar
            const imageX = 10; // Posición X de la imagen (izquierda)
            const imageY = 5; // Misma posición Y que el nombre
            const imageWidth = 15; // Ancho de la imagen
            const imageHeight = 15; // Alto de la imagen
            doc.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

            // Título
            const title = 'Informe de Ventas';
            doc.setFontSize(18);
            doc.text(title, 10, 35);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de las ventas que realizo la clinica CIES. El informe incluye información relevante sobre cada venta, como el nombre del medicamento, cantidad vendida, fecha venta y total de venta. Esperamos que este informe sea útil para comprender mejor nuestros productos.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 45);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 70;

            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Cantidad vendida', dataKey: 'cantidad_vendida' },
                { header: 'Fecha venta', dataKey: 'fecha_venta' },
                { header: 'Total de venta', dataKey:'total_venta' }
            ];
            
            const tableData = ventas.map(ventas => ({
                nombre_medicamento: ventas.nombre_medicamento,
                cantidad_vendida: ventas.cantidad_vendida,
                fecha_venta: ventas.fecha_venta,
                total_venta: ventas.total_venta
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_ventas.pdf');
        }
    }

    function exportToExcelVentas() {
        if (ventas.length === 0) {
        // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
        console.log('La tabla de ventas está vacía.');
        toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de ventas no se pudo exportar porque está vacía.', life: 3000 });
        return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Cantidad vendida', dataKey: 'cantidad_vendida' },
                { header: 'Fecha venta', dataKey: 'fecha_venta' },
                { header: 'Total de venta', dataKey:'total_venta' }
            ];
            
            const tableData = ventas.map(ventas => ({
                nombre_medicamento: ventas.nombre_medicamento,
                cantidad_vendida: ventas.cantidad_vendida,
                fecha_venta: ventas.fecha_venta,
                total_venta: ventas.total_venta
            }));

            
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_ventas.xlsx';
            excelLink.click();
        }
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    {header}
                </div>
                    <Toast ref={toast} />
                    {seleccionarInforme && seleccionarInforme.name === 'Usuarios' ? (
                        <div className="card">
                        <h5>Filtros:</h5>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ width: '45%' }}>
                                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                    <h5>Filtrar por fecha de creacion del usuario:</h5>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                        <Calendar id="fechaInicio" value={fechaInicioUsuarios} onChange={(e) => setFechaInicioUsuarios(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                        <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                        <Calendar id="fechaFin" value={fechaFinUsuarios} onChange={(e) => setFechaFinUsuarios(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                    </div>
                                    <h5>Filtrar por estado del usuario:</h5>
                                    <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="estado1" name="estado" value="1" onChange={(e) => setEstadoUsuarios(e.value)} checked={estadoUsuarios === '1'} />
                                        <label htmlFor="estado1" className="ml-2">Activo</label>
                                        </div>
                                        <div className="flex align-items-center">
                                        <RadioButton inputId="estado2" name="estado" value="0" onChange={(e) => setEstadoUsuarios(e.value)} checked={estadoUsuarios === '0'} />
                                        <label htmlFor="estado2" className="ml-2">Inactivo</label>
                                        </div>
                                        <div className="flex align-items-center">
                                        <RadioButton inputId="estado0" name="estado" value="N" onChange={(e) => setEstadoUsuarios(e.value)} checked={estadoUsuarios === 'N'} />
                                        <label htmlFor="estado0" className="ml-2">Ambos</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '45%' }}>
                                <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                    <div style={{ display: 'flex'}}>
                                        <Button className='bg-orange-500' label="Aplicar filtros" onClick={() => cargarInformeUsuarios(fechaInicioUsuarios, fechaFinUsuarios, estadoUsuarios)} />
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '10px' }}>
                                        <Button className='bg-orange-500' label="Eliminar filtros" onClick={cargarUsuarios} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                            <h5 className="m-0">Gestion de usuarios</h5>
                            <Button className='bg-green-600' label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                        </div>

                        <DataTable
                            ref={dt}
                            value={usuarios}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios"
                            globalFilter={globalFilter}
                            emptyMessage="No se encontraron usuarios."
                            responsiveLayout="scroll"
                        >
                            <Column field="code" header="ID" sortable body={idUsuariosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="nombres" header="Nombre" sortable body={nombresUsuariosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="apellidos" header="Apellidos" sortable body={apellidosUsuariosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="fecha_creacion" header="FechaCreacion" sortable body={fechaCreacionUsuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="correo" header="CorreoElectronico" sortable body={correoElectronicoUsuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="rol" header="Rol" sortable body={rolUsuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="estado" header="Estado" sortable body={estadoUsuarioBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                        
                        <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de usuarios" modal className="p-fluid" onHide={hideDialogExportar}>
                            <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de usuarios</label>
                            </div>
                            <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                <label htmlFor="formato">En que formato quiere el reporte</label>
                            </div>
                            
                            <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelUsuarios} />
                                <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFUsuarios} />
                            </div>
                        </Dialog>
                    </div>
                    ) : seleccionarInforme && seleccionarInforme.name === 'Pacientes' ? (
                        
                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                    <h5>Filtrar por fecha de nacimiento:</h5>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                        <Calendar id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                        <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                        <Calendar id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                    </div>
                                    <h5>Filtrar por género del paciente:</h5>
                                    <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                        <div className="flex align-items-center">
                                        <RadioButton inputId="genero1" name="genero" value="Masculino" onChange={(e) => setGenero(e.value)} checked={genero === 'Masculino'} />
                                        <label htmlFor="genero1" className="ml-2">Masculino</label>
                                        </div>
                                        <div className="flex align-items-center">
                                        <RadioButton inputId="genero2" name="genero" value="Femenino" onChange={(e) => setGenero(e.value)} checked={genero === 'Femenino'} />
                                        <label htmlFor="genero2" className="ml-2">Femenino</label>
                                        </div>
                                        <div className="flex align-items-center">
                                        <RadioButton inputId="genero0" name="genero" value="N" onChange={(e) => setGenero(e.value)} checked={genero === 'N'} />
                                        <label htmlFor="genero0" className="ml-2">Ambos</label>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                            <Button label="Aplicar filtros" onClick={() => cargarInformePacientes(fechaInicio, fechaFin, genero)} />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarPacientes} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de pacientes</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable
                                ref={dt}
                                value={pacientes}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} pacientes"
                                globalFilter={globalFilter}
                                emptyMessage="No se encontraron pacientes."
                                responsiveLayout="scroll"
                            >
                                <Column field="code" header="ID" sortable body={idPacientesBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="nombres" header="Nombre" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="apellidos" header="Apellidos" sortable body={apellidosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="fecha_nacimiento" header="FechaNacimiento" sortable body={fechaNacimientoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="sexo" header="Sexo" sortable body={sexoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="correo" header="Correo" body={correoElectronicoBodyTemplate} sortable></Column>
                            </DataTable>
                            
                            <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de pacientes" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de pacientes</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelPacientes} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFPacientes} />
                                </div>
                            </Dialog>
                        </div>

                    ) : seleccionarInforme && seleccionarInforme.name === 'Servicios' ? (

                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                        <h5>Filtrar por fecha de creacion:</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                            <Calendar id="fechaInicio" value={fechaInicioServicios} onChange={(e) => setFechaInicioServicios(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                            <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                            <Calendar id="fechaFin" value={fechaFinServicios} onChange={(e) => setFechaFinServicios(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                        </div>
                                        <h5>Filtrar por categorias de los servicios:</h5>
                                        <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                            <Dropdown value={seleccionarCategoria} onChange={handleCategoriaChange} options={categorias} optionLabel="nombre_categoria" placeholder="Selecciona la categoría del servicio" className="w-100 mw-100" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                        <Button
                                            label="Aplicar filtros"
                                            onClick={() => {
                                                if (seleccionarCategoria && seleccionarCategoria.nombre_categoria) {
                                                cargarInformeServicios(fechaInicioServicios, fechaFinServicios, seleccionarCategoria.nombre_categoria);
                                                } else {
                                                cargarInformeServicios(fechaInicioServicios, fechaFinServicios, null); // o un valor por defecto si no se proporciona la categoría
                                                }
                                            }}
                                        />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarServicios} />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de servicios</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable
                            ref={dt}
                            value={servicios}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} servicios"
                            globalFilter={globalFilter}
                            emptyMessage="No se encontraron servicios."
                            responsiveLayout="scroll"
                        >
                            <Column field="codigo" header="Codigo" sortable body={idServiciosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="nombre_servicio" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="nombre_categoria" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="fecha_creacion" header="Fecha creacion" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de servicios" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de servicios</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelServicios} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFServicios} />
                                </div>
                            </Dialog>
                        </div>
                    ) : seleccionarInforme && seleccionarInforme.name === 'Proveedores' ? (
                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                        <h5>Filtrar por estado del proveedor:</h5>
                                        <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="estado1" name="estado" value="1" onChange={(e) => setEstadoProveedores(e.value)} checked={estadoProveedores === '1'} />
                                            <label htmlFor="estado1" className="ml-2">Activo</label>
                                            </div>
                                            <div className="flex align-items-center">
                                            <RadioButton inputId="estado2" name="estado" value="0" onChange={(e) => setEstadoProveedores(e.value)} checked={estadoProveedores === '0'} />
                                            <label htmlFor="estado2" className="ml-2">Inactivo</label>
                                            </div>
                                            <div className="flex align-items-center">
                                            <RadioButton inputId="estado0" name="estado" value="N" onChange={(e) => setEstadoProveedores(e.value)} checked={estadoProveedores === 'N'} />
                                            <label htmlFor="estado0" className="ml-2">Ambos</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                            <Button label="Aplicar filtros" onClick={() => cargarInformeProveedores(estadoProveedores)} />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarProveedores} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de proveedores</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable
                                ref={dt}
                                value={proveedores}
                                dataKey="id_proveedor"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} proveedores"
                                emptyMessage="No se encontraron proveedores."
                                responsiveLayout="scroll"
                            >
                                <Column field="code" header="ID" sortable body={idProveedorBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                                <Column field="nombre_proveedor" header="Nombre Proveedor" sortable body={nombreProveedorBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="representante" header="Representante" body={representanteProveedorBodyTemplate} sortable></Column>
                                <Column field="telefono" header="Telefono" sortable body={telefonoProveedorBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="descripcion" header="Descripcion" body={descripcionProveedorBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="estado" header="Estado" sortable body={estadoProveedorBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                            
                            <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de proveedores" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de proveedores</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelProveedores} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFProveedores} />
                                </div>
                            </Dialog>
                            
                        </div>
                    ) : seleccionarInforme && seleccionarInforme.name === 'Productos' ? (

                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                        <h5>Filtrar por fecha de caducidad:</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                            <Calendar id="fechaInicio" value={fechaInicioProductos} onChange={(e) => setFechaInicioProductos(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                            <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                            <Calendar id="fechaFin" value={fechaFinProductos} onChange={(e) => setFechaFinProductos(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                        </div>
                                        <h5>Filtrar por nombre de la categoria del producto:</h5>
                                        <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                            <Dropdown value={seleccionarCategoriaProductos} onChange={handleCategoriaProductosChange} options={categoriasProductos} optionLabel="nombre_categoria" placeholder="Selecciona la categoria" className="w-100 mw-100" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                            <Button
                                                label="Aplicar filtros"
                                                onClick={() => {
                                                    if (seleccionarCategoriaProductos && seleccionarCategoriaProductos.nombre_categoria) {
                                                        cargarInformeProductos(fechaInicioProductos, fechaFinProductos, seleccionarCategoriaProductos.nombre_categoria);
                                                    } else {
                                                        cargarInformeProductos(fechaInicioProductos, fechaFinProductos, null);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarProductos} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de productos</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable 
                                ref={dt}
                                value={productos}
                                dataKey='id_medicamento'
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5,10,25]}
                                className='datatable-responsive'
                                paginatorTemplate={"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"}
                                currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords} productos'
                                emptyMessage='No se encontraron productos disponibles.'
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="code" header="ID" sortable body={idProductosBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                                <Column field="nombre_medicamento" header="Nombre" sortable body={nombreProductosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="suplier" header="Proveedor" body={proveedorProductosBodyTemplate} sortable></Column>  
                                <Column field="category" header="Categoria" sortable body={categoriaProductosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="price" header="Precio Unitario" sortable body={precioProductosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="quantity" header="Cantidad" sortable body={cantidadProductosBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="enddate" header="Fecha Caducidad" body={fechaProductosBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            </DataTable>
                            
                            <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de productos" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de productos</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelProductos} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFProductos} />
                                </div>
                            </Dialog>
                            
                        </div>
                    ) : seleccionarInforme && seleccionarInforme.name === 'Reabastecimiento' ? (

                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                        <h5>Filtrar por fecha de pedido:</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                            <Calendar id="fechaInicio" value={fechaInicioReabastecimiento} onChange={(e) => setFechaInicioReabastecimiento(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                            <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                            <Calendar id="fechaFin" value={fechaFinReabastecimiento} onChange={(e) => setFechaFinReabastecimiento(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                        </div>
                                        <h5>Filtrar por nombre del proveedor:</h5>
                                        <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                            <Dropdown value={seleccionarNombreProveedorReabastecimiento} onChange={handleNombreProveedorReabastecimientoChange} options={nombreProveedorReabastecimiento} optionLabel="nombre_proveedor" placeholder="Selecciona el proveedor" className="w-100 mw-100" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                            <Button
                                                label="Aplicar filtros"
                                                onClick={() => {
                                                    if (seleccionarNombreProveedorReabastecimiento && seleccionarNombreProveedorReabastecimiento.nombre_proveedor) {
                                                        cargarInformeReabastecimiento(fechaInicioReabastecimiento, fechaFinReabastecimiento, seleccionarNombreProveedorReabastecimiento.nombre_proveedor);
                                                    } else {
                                                        cargarInformeReabastecimiento(fechaInicioReabastecimiento, fechaFinReabastecimiento, null);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarReabastecimiento} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de reabastecimiento</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable
                                ref={dt}
                                value={reabastecimiento}
                                dataKey="id_reabastecimiento"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} reabastecimiento"
                                emptyMessage="No se encontraron registros."
                                responsiveLayout="scroll"
                            >
                                <Column field="code" header="ID" sortable body={idReabastecimientoBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                                <Column field="nombre_servicio" header="Pedido Producto" sortable body={pedidoReabastecimientoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="id_proveedor" header="Proveedor" body={proveedorReabastecimientoBodyTemplate} sortable></Column>
                                <Column field="cantidad_reabastecida" header="Cantidad" sortable body={cantidadReabastecimientoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="fecha_reabastecimiento" header="Fecha Pedido" body={fechaReabastecimientoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="costo_total" header="Costo Total" body={precioReabastecimientoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                            
                            <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de reabastecimiento" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de reabastecimiento</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelReabastecimiento} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFReabastecimiento} />
                                </div>
                            </Dialog>
                            
                        </div>
                    ) : seleccionarInforme && seleccionarInforme.name === 'Ventas' ? (

                        <div className="card">
                            <h5>Filtros:</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                                        <h5>Filtrar por fecha de venta:</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label htmlFor="fechaInicio" style={{ padding: '10px' }}>Fecha inicio:</label>
                                            <Calendar id="fechaInicio" value={fechaInicioVentas} onChange={(e) => setFechaInicioVentas(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha inicio" />
                                            <label htmlFor="fechaFin" style={{ padding: '10px' }}>Fecha fin:</label>
                                            <Calendar id="fechaFin" value={fechaFinVentas} onChange={(e) => setFechaFinVentas(e.value)} dateFormat="yy/mm/dd" placeholder="Fecha fin" />
                                        </div>
                                        <h5>Filtrar por nombre del producto:</h5>
                                        <div className="flex flex-wrap gap-3" style={{ alignItems: 'center' }}>
                                            <Dropdown value={seleccionarNombreMedicamento} onChange={handleNombreMedicamentoChange} options={nombreMedicamentoVentas} optionLabel="nombre_medicamento" placeholder="Selecciona el medicamento" className="w-100 mw-100" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '45%' }}>
                                    <div className="card" style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={{ display: 'flex'}}>
                                            <Button
                                                label="Aplicar filtros"
                                                onClick={() => {
                                                    if (seleccionarNombreMedicamento && seleccionarNombreMedicamento.nombre_medicamento) {
                                                        cargarInformeVentas(fechaInicioVentas, fechaFinVentas, seleccionarNombreMedicamento.nombre_medicamento);
                                                    } else {
                                                        cargarInformeVentas(fechaInicioVentas, fechaFinVentas, null);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            <Button label="Eliminar filtros" onClick={cargarVentas} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center" >
                                <h5 className="m-0">Gestion de ventas</h5>
                                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
                            </div>

                            <DataTable
                                ref={dt}
                                value={ventas}
                                dataKey="id_venta"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} ventas"
                                emptyMessage="No se encontró registro de ventas."
                                responsiveLayout="scroll"
                            >
                                <Column field="code" header="ID" sortable body={idVentasBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                                <Column field="nombre_mediamento" header="Nombre Producto" sortable body={nombreVentasBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="cantidad_vendida" header="Cantidad Vendida" body={cantidadVentasBodyTemplate} sortable></Column>
                                <Column field="fecha_venta" header="Fecha Venta" sortable body={fechaVentasBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="total_venta" header="Total Venta" body={precioVentasBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                            
                            <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar la tabla de ventas" modal className="p-fluid" onHide={hideDialogExportar}>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">Se exportara todo el contenido que se muestra en la tabla de gestion de ventas</label>
                                </div>
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <label htmlFor="formato">En que formato quiere el reporte</label>
                                </div>
                                
                                <div className="field" style={{ display: 'flex', gap: '10px' }}>
                                    <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcelVentas} />
                                    <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDFVentas} />
                                </div>
                            </Dialog>
                            
                        </div>
                            
                    ) : (
                        <div>No se ha seleccionado ninguna opción</div>
                    )}
            </div>
        </div>
    );
};


export default Informes;