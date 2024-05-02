import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { mostrarUsuariosMedicos, addMedicos, getMedicoID, getHorariosID, addHorarioMedico } from "../../services/apiUsuarios";
import { listarCategorias, mostrarServiciosID } from '../../services/apiService';

export default function MedicoNuevo() {

    let emptyMedico = {
        id: 0,
        id_servicio: 0,
        especialidad: ''
    }

    let emptyHorario = {
        id_medico: 0,
        dia_semana: null,
        hora_inicio: null,
        hora_final: null,
        fichas_disponibles: 0
    }

    const toast = useRef(null);
    const [servicios, setServicios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);
    const [serviciosDropdown, setServiciosDropdown] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState(emptyMedico);
    const [horario, setHorario] = useState(emptyHorario);
    const [horarios, setHorarios] = useState([]);
    const [medico, setMedico] = useState(null);
    const [medicoRegisterDialog, setMedicoRegisterDialog] = useState(false);
    const [horarioRegisterDialog, setHorarioRegisterDialog] = useState(false);
    const [deleteMedicoDialog, setDeleteMedicoDialog] = useState(false);
    const [medicoDialog, setMedicoDialog] = useState(false);
    const [horarioDialog, setHorarioDialog] = useState(false);

    const diasDisponiblesSemana = [
        { label: 'Lunes', value: 'Lunes' },
        { label: 'Martes', value: 'Martes' },
        { label: 'Miércoles', value: 'Miércoles' },
        { label: 'Jueves', value: 'Jueves' },
        { label: 'Viernes', value: 'Viernes' },
        { label: 'Sábado', value: 'Sábado' },
        { label: 'Domingo', value: 'Domingo' }
    ];

    const cargarMedicos = async () => {
        try {
            const usuarios = await mostrarUsuariosMedicos();
            setUsuarios(usuarios);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        async function obtenerMedicos() {
            try {
                const usuarios = await mostrarUsuariosMedicos();
                console.log(usuarios);
                setUsuarios(usuarios);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerMedicos();
    }, []);

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


    async function obtenerMedicoID(id) {
        try {
            const medico = await getMedicoID(id);
            console.log(medico);
            setMedico(medico);

            obtenerHorarioID(medico[0].id);

        } catch (error) {
            console.log(error);
        }
    }

    async function obtenerHorarioID(id) {
        try {
            const horarios = await getHorariosID(id);
            console.log(horarios);
            setHorarios(horarios);

        } catch (error) {
            console.log(error);
        }
    }


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

    async function añadirMedico() {
        try {
            if (usuario.id !== 0 && usuario.id_servicio !== 0 && usuario.especialidad.trim !== '') {
                const response = await addMedicos(usuario.id, usuario.id_servicio, usuario.especialidad);
                console.log(response);
                cargarMedicos();
                setMedicoRegisterDialog(false);
                setUsuario(emptyMedico);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Medico registrado', life: 3000 });

            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos', life: 3000 });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function añadirHorario() {
        try {
            if (medico !== null && horario.dia_semana !== null && horario.hora_inicio !== null && horario.hora_final !== null && horario.fichas_disponibles !== 0) {
                const response = await addHorarioMedico(medico[0].id, horario.dia_semana, onTimeChange(horario.hora_inicio), onTimeChange(horario.hora_final), horario.fichas_disponibles);
                console.log(response);
                obtenerHorarioID(medico[0].id);
                setHorario(emptyHorario);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Horario registrado', life: 3000 });

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

    const dialogMedico = (usuario) => {
        setUsuario({ ...usuario });
        console.log(usuario);
        setMedicoRegisterDialog(true);
    };

    const dialogHorarios = (usuario) => {
        setUsuario(usuario);
        setHorarioRegisterDialog(true);
        obtenerMedicoID(usuario.id);
        setHorario(emptyHorario);
    };


    const confirmDeleteMedico = (usuario) => {
        setUsuario(usuario);
        setDeleteMedicoDialog(true);
    };

    const confirmDeleteHorario = (horario) => {
        setHorario(horario);
    };

    const hideDialog = () => {
        setMedicoDialog(false);
        setMedicoRegisterDialog(false);
    };

    const hideDialogHorario = () => {
        setHorarioDialog(false);
        setHorarioRegisterDialog(false);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    function onTimeChange(fechaHora) {

        let date = new Date(fechaHora);
        let hours = date.getHours();
        let minutes = date.getMinutes();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes}`;

    }


    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombres} {rowData.apellidos}
            </>
        );
    };

    const estadoMedicoTag = (value) => {
        switch (value) {
            case 'Registrado':
                return 'success';

            case 'No registrado':
                return 'danger';

            default:
                return null;
        }
    };

    const estadoTemplate = (rowData) => {
        return <Tag value={rowData.estadoMedico} severity={estadoMedicoTag(rowData.estadoMedico)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="info" rounded className="mr-2" onClick={() => dialogMedico(rowData)} disabled={estadoMedicoTag(rowData.estadoMedico) === 'success'} />
                <Button icon="pi pi-calendar-plus" severity="success" rounded className="mr-2" onClick={() => dialogHorarios(rowData)} disabled={estadoMedicoTag(rowData.estadoMedico) === 'danger'} />
                <Button icon="pi pi-times" severity="danger" rounded onClick={() => confirmDeleteMedico(rowData)} />
            </>
        );
    };

    const actionHorarioBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-trash" severity="danger" rounded/>
            </>
        );
    };

    const medicoRegisterDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={añadirMedico} />
        </>
    );
    const horarioRegisterDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialogHorario} />
            <Button label="Guardar" icon="pi pi-check" text onClick={añadirHorario} />
        </>
    );
    const deleteServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text />
            <Button label="Si" icon="pi pi-check" text />
        </>
    );


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable value={usuarios} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="nombres" header="Nombre" body={nombreBodyTemplate} style={{ width: '25%' }}></Column>
                        <Column field="correo" header="Correo" style={{ width: '25%' }}></Column>
                        <Column field="rol" header="Rol" style={{ width: '10%' }}></Column>
                        <Column field="estadoMedico" header="Estado" body={estadoTemplate} style={{ width: '25%' }}></Column>
                        <Column field="accion" header="Registrar" body={actionBodyTemplate} style={{ width: '25%' }}></Column>
                    </DataTable>

                    <Dialog visible={medicoRegisterDialog} style={{ width: '450px' }} header="Registrar medico" modal className="p-fluid" footer={medicoRegisterDialogFooter} onHide={hideDialog}>
                        <InputText id="id" name="id" value={usuario.id} onChange={onInputChange} type='hidden' />
                        <div className="field">
                            <label htmlFor="categoria">Categoria</label>
                            <Dropdown id="categoria" value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder="Seleccione una categoria" />
                        </div>
                        <div className="field">
                            <label htmlFor="servicio">Servicio</label>
                            <Dropdown id="servicio" value={usuario.id_servicio} onChange={(e) => setUsuario({ ...usuario, id_servicio: e.target.value })} options={serviciosDropdown} placeholder="Seleccione un servicio" disabled={!categoria} />
                        </div>
                        <div className="field">
                            <label htmlFor="id">Especialidad</label>
                            <InputText id="id" name="id" value={usuario.especialidad} onChange={(e) => setUsuario({ ...usuario, especialidad: e.target.value })} placeholder='Especialidad del medico' />
                        </div>
                    </Dialog>

                    <Dialog visible={horarioRegisterDialog} style={{ width: '700px' }} header="Registrar horarios" modal className="p-fluid" footer={horarioRegisterDialogFooter} onHide={hideDialogHorario} >
                        <div className="grid">
                            <InputText id="id" name="id" value={medico && medico.length > 0 ? medico[0].id : ''} onChange={onInputChange} type='hidden' />
                            <div className="col-12 md:col-12">
                                <div className="field">
                                    <label htmlFor="dias_semana">Dias disponibles</label>
                                    <Dropdown id="dia_semana" value={horario.dia_semana} onChange={(e) => setHorario({ ...horario, dia_semana: e.target.value })} options={diasDisponiblesSemana} placeholder="Seleccione un dia" />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="hora_inicio">Hora de inicio de atencion</label>
                                    <Calendar id="hora_inicio" value={horario.hora_inicio} onChange={(e) => setHorario({ ...horario, hora_inicio: e.target.value })} timeOnly />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="hora_final">Hora final de atencion</label>
                                    <Calendar id="hora_final" value={horario.hora_final} onChange={(e) => setHorario({ ...horario, hora_final: e.target.value })} timeOnly />
                                </div>
                            </div>
                            <div className="col-12 md:col-12">
                                <div className="field">
                                    <label htmlFor="fichas_disponibles">Fichas disponibles para el medico</label>
                                    <InputNumber inputId="fichas_disponibles" value={horario.fichas_disponibles} onValueChange={(e) => setHorario({ ...horario, fichas_disponibles: e.target.value })} showButtons min={0} max={20} />
                                </div>
                            </div>
                            <div className="col-12 md:col-12">
                                <div className="field">
                                    <DataTable value={horarios || []} tableStyle={{ minWidth: '30rem' }} emptyMessage="No se encontraron horarios disponibles para el medico">
                                        <Column field="dia_semana" header="Dia" style={{ width: '20%' }}></Column>
                                        <Column field="hora_inicio" header="Horario inicio" style={{ width: '20%' }}></Column>
                                        <Column field="hora_final" header="Horario fin" style={{ width: '20%' }}></Column>
                                        <Column field="fichas_disponibles" header="Fichas disponibles" style={{ width: '20%' }}></Column>
                                        <Column field="accion" header="Accion" body={actionHorarioBodyTemplate} style={{ width: '20%' }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>

    );
}