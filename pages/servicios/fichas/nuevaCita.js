import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { listarCategorias, mostrarServiciosID, mostrarServiciosIDmedico, mostrarMedicosIDservicio, mostrarPacientes, registrarFicha, mostrarPacienteID } from '../../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../../utils/session';
import { decryptData } from '../../../services/crypto';

export default function ReservaCitas() {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'recepcionista'];

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

    const toast = useRef(null);
    const [paciente, setPaciente] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [filteredPacientes, setFilteredPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);
    const [servicios, setServicios] = useState(null);
    const [servicio, setServicio] = useState(null);
    const [serviciosDropdown, setServiciosDropdown] = useState([]);
    const [medico, setMedico] = useState(null);
    const [medicos, setMedicos] = useState([]);
    const [medicosDropdown, setMedicosDropdown] = useState([]);
    const [infoMedico, setInfoMedico] = useState(null);
    const [infoPaciente, setInfoPaciente] = useState(null);
    const [infoMedicos, setInfoMedicos] = useState([]);
    const [fecha, setFecha] = useState(obtenerFechaActual());
    const [medicosDelDia, setMedicosDelDia] = useState([]);

    const fechaActual = new Date();
    const opciones = { weekday: 'long' };
    const diaActual = new Intl.DateTimeFormat('es-ES', opciones).format(fechaActual);
    const diaActualCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);




    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);

                const categoriasDropdown = categorias.map(categoria => ({
                    label: categoria.nombre_categoria,
                    value: categoria.id
                }));

                setCategoriasDropdown(categoriasDropdown);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);


    useEffect(() => {
        async function listarServicios() {
            try {
                if (categoria) {
                    const servicios = await mostrarServiciosID(categoria);
                    console.log(servicios);
                    setServicios(servicios);

                    const serviciosDropdown = servicios.map(servicio => ({
                        label: servicio.nombre_servicio,
                        value: servicio.id
                    }));

                    setServiciosDropdown(serviciosDropdown);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, [categoria]);


    useEffect(() => {
        async function listarMedicos() {
            try {
                if (servicio) {
                    const medicos = await mostrarMedicosIDservicio(servicio);
                    console.log(medicos);
                    setMedicos(medicos);

                    const medicosDropdown = medicos.map(medico => ({
                        label: `${medico.nombres} ${medico.apellidos}`,
                        value: medico.id
                    }));

                    setMedicosDropdown(medicosDropdown);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarMedicos();
    }, [servicio]);

    useEffect(() => {
        async function obtenerInfoMedico() {
            try {
                if (medico) {
                    const infoMedicos = await mostrarServiciosIDmedico(medico);
                    console.log(infoMedicos);
                    setInfoMedicos(infoMedicos);

                    const medicosDelDia = infoMedicos.filter(infoMedico => infoMedico.dia_semana === diaActualCapitalizado);
                    setMedicosDelDia(medicosDelDia);
                    console.log(diaActualCapitalizado);
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerInfoMedico();
    }, [medico]);

    useEffect(() => {
        async function obtenerPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                console.log(pacientes);

                const suggestions = pacientes.map(paciente => ({
                    nombre: `${paciente.nombres} ${paciente.apellidos}`,
                    ...paciente
                }));

                setPacientes(suggestions);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes();
    }, []);

    useEffect(() => {
        async function obtenerPacienteID() {
            try {
                if (selectedPaciente) {
                    const infoPaciente = await mostrarPacienteID(selectedPaciente.id);
                    console.log(infoPaciente);

                    setInfoPaciente(infoPaciente);
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacienteID();
    }, [selectedPaciente]);

    function buscarPaciente(event) {
        let filteredPacientes = [];

        if (event.query.trim().length) {
            filteredPacientes = pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(event.query.toLowerCase()));
        } else {
            filteredPacientes = [...pacientes];
        }

        setFilteredPacientes(filteredPacientes);
    }

    async function añadirFicha() {
        try {
            if (selectedPaciente != null && medico != null && servicio != null && fecha.trim !== '' && medicosDelDia.length !== 0) {
                const response = await registrarFicha(selectedPaciente.id, medico, servicio, fecha);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Ficha registrada', life: 3000 });
                setCategoria(null);
                setMedico(null);
                setServicio(null);
                setInfoMedicos(null);
                setSelectedPaciente(null);
                setMedicosDelDia([]);
                setInfoPaciente(null);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos', life: 3000 });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
            } else {
                console.log(error);
            }
        }
    }

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${anio}/${mes}/${dia}`;
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/${day}`;
    }

    async function limpiarCampos() {
        setCategoria(null);
        setMedico(null);
        setServicio(null);
        setInfoMedicos(null);
        setSelectedPaciente(null);
        setMedicosDelDia([]);
        setInfoPaciente(null);
    }


    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">

                <div className="card p-fluid">
                    <h5>Registro de ficha</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="fecha">Fecha actual</label>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-calendar"></i>
                                    </span>
                                    <InputText id="fecha" value={fecha} onChange={(e) => setFecha(e.value)} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="categoria">Categoria</label>
                                <Dropdown id="categoria" value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder="Seleccione una categoria" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="servicio">Servicio</label>
                                <Dropdown id="servicio" value={servicio} onChange={(e) => { setServicio(e.value); }} options={serviciosDropdown} placeholder="Seleccione un servicio" disabled={!categoria} />
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="medico">Médico</label>
                        <Dropdown id="medico" value={medico} onChange={(e) => { setMedico(e.value); }} options={medicosDropdown} placeholder="Seleccione un médico" disabled={!servicio} />
                    </div>
                    <div className="card">
                        <div className="field">
                            <label className='font-bold' htmlFor="medico">Informacion del medico</label>
                            <ul className="list-none p-0 m-0">
                                {medicosDelDia.length > 0 ? (
                                    medicosDelDia.map(infoMedico => (
                                        <React.Fragment key={infoMedico.id}>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Servicio</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.nombre_servicio}</div>
                                            </li>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Dia actual</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                    <Chip label={infoMedico.dia_semana} className="mr-2" />
                                                </div>
                                            </li>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.nombres} {infoMedico.apellidos}</div>
                                            </li>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Especialidad</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.especialidad}</div>

                                            </li>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Horario</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{infoMedico.hora_inicio} - {infoMedico.hora_final}</div>
                                            </li>
                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Fichas disponibles</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{infoMedico.fichas_disponibles}</div>
                                            </li>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <label>Aun no ha seleccionado un medico disponible</label>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-12">
                            <div className="field">
                                <label htmlFor="nombre">Nombre del paciente</label>
                                <AutoComplete placeholder="Buscar" id="dd" dropdown value={selectedPaciente} onChange={(e) => { setSelectedPaciente(e.value); }} suggestions={filteredPacientes} completeMethod={buscarPaciente} field="nombre" />
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="card">
                                <div className="field">
                                    <label className='font-bold' htmlFor="medico">Informacion del paciente</label>
                                    <Divider />
                                    <ul className="list-none p-0 m-0">
                                        {infoPaciente ? infoPaciente.map((key) => (
                                            <div key={key}>
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Nombres</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.nombres}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Apellidos</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.apellidos}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Documento de identidad</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.ci}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Fecha de nacimiento</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{formatDate(key.fecha_nacimiento)} </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Telefono</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.telefono}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Genero</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                                <Tag className="mr-2" severity={key.sexo === 'Masculino' ? 'info' : 'danger'} value={key.sexo} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="grid">
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Ciudad</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.ciudad}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Provincia</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.provincia}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Zona</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.zona}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Calle</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.calle}</div>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>

                                        )) : <p>No se ha seleccionado ningún paciente.</p>}
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="card flex flex-wrap justify-content-end gap-3">
                        <Button
                            label="Reservar ficha"
                            onClick={añadirFicha}
                            className="p-mt-3 bg-orange-500"
                            style={{ width: 'auto' }}
                            disabled={!selectedPaciente || !medico || !servicio || !medicosDelDia.length}
                        />
                        <Button
                            icon="pi pi-refresh"
                            className="p-button-outlined p-button-danger p-mt-3"
                            style={{ width: 'auto' }}
                            onClick={limpiarCampos}
                            label="Limpiar"
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}
