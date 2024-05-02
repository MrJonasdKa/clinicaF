
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataView } from 'primereact/dataview';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { mostrarMedicoPerfil, mostrarFichasMedico, mostrarEvolucionPaciente, mostrarHistoriaClinica, insertarEvolucionMedica } from '../../services/apiPacientes';
import { listarFichas, eliminarFicha } from '../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export default function BasicDemo() {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['medico'];

    useEffect(() => {
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

    const events = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
        { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
        { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];


    let emptyEvolucion = {
        nota_evolucion: '',
        peso: null,
        altura: null,
        imc: null,
        tratamiento: ''
    }

    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState(obtenerFechaActual);
    const [fichas, setFichas] = useState([]);
    const [ficha, setFicha] = useState(null);
    const [historiaClinica, setHistoriaClinica] = useState(null);
    const [evolucionPaciente, setEvolucionPaciente] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteFichaDialog, setDeleteFichaDialog] = useState(false);
    const [listaEvolucionDialog, setListaEvolucionDialog] = useState(false);
    const [historiaDialog, setHistoriaDialog] = useState(false);
    const [evolucionDialog, setEvolucionDialog] = useState(false);
    const [medico, setMedico] = useState([]);
    const [evolucion, setEvolucion] = useState(emptyEvolucion);
    const toast = useRef(null);

    useEffect(() => {
        async function obtenerPerfilMedico() {
            const idUsuarioEncriptado = localStorage.getItem('userID');
            const idUsuario = decryptData(idUsuarioEncriptado);
            try {
                const medico = await mostrarMedicoPerfil(idUsuario);
                console.log(medico);

                setMedico(medico);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPerfilMedico();
    }, []);

    async function cargarFichas() {
        try {
            const idUsuarioEncriptado = localStorage.getItem('userID');
            const idUsuario = decryptData(idUsuarioEncriptado);
            const fechaBusqueda = formatDate(fecha);
            const fichas = await mostrarFichasMedico(idUsuario, fechaBusqueda);
            console.log(fechaBusqueda);
            setFichas(fichas);
            console.log(fichas);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function obtenerFichasActual() {
            try {
                const idUsuarioEncriptado = localStorage.getItem('userID');
                const idUsuario = decryptData(idUsuarioEncriptado);
                const fechaBusqueda = formatDate(fecha);
                const fichas = await mostrarFichasMedico(idUsuario, fechaBusqueda);
                console.log(fechaBusqueda);
                setFichas(fichas);
                console.log(fichas);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerFichasActual()
    }, [fecha]);

    async function cancelarFicha() {
        try {

            const response = await eliminarFicha(ficha.id);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Ficha cancelada', life: 3000 });
            setDeleteFichaDialog(false);
            cargarFichas();
        }
        catch (error) {
            throw error;
        }
    }


    async function mostrarHistoriaClinicaDialog(ficha) {
        if (ficha) {
            try {
                const result = await mostrarHistoriaClinica(ficha.id_paciente);
                console.log(result);
                if (result) {
                    setHistoriaClinica(result);
                    setError(null);

                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No existe historia clínica para este paciente', life: 3000 });
                    setHistoriaDialog(false);
                }
            } catch (error) {
                console.error(error);
                setError(error);
            }
        }
    };

    async function mostrarEvolucionPacienteDialog(ficha) {
        if (ficha) {
            try {
                const result = await mostrarEvolucionPaciente(ficha.id_paciente);
                console.log(result);
                if (result) {
                    setEvolucionPaciente(result);
                    setError(null);
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'El paciente no tiene evoluciones registradas.', life: 3000 });
                    setEvolucionDialog(false);
                }
            } catch (error) {
                console.error(error);
                setError(error);
            }
        }
    };



    async function insertarEvolucionMedicaPaciente() {
        if (!ficha || !ficha.id_paciente) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'ID del paciente no proporcionado', life: 3000 });
            return;
        }

        if (!evolucion.nota_evolucion || evolucion.nota_evolucion.trim().length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'La nota de evolución es requerida', life: 3000 });
            return;
        }

        if (!evolucion.peso || evolucion.peso <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El peso debe ser mayor a 0', life: 3000 });
            return;
        }

        if (!evolucion.altura || evolucion.altura <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'La altura debe ser mayor a 0', life: 3000 });
            return;
        }

        if (!evolucion.imc || evolucion.imc <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El IMC debe ser mayor a 0', life: 3000 });
            return;
        }

        if (!evolucion.tratamiento || evolucion.tratamiento.trim().length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El tratamiento es requerido', life: 3000 });
            return;
        }

        try {
            const response = await insertarEvolucionMedica(ficha.id, ficha.id_paciente, evolucion.nota_evolucion, evolucion.peso, evolucion.altura, evolucion.imc, evolucion.tratamiento, fecha);
            console.log(response);
            setEvolucionDialog(false);
            setEvolucion(emptyEvolucion);
            cargarFichas();
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Evolución médica registrada', life: 3000 });
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
            } else {
                console.log(error);
            }
        }
    }


    useEffect(() => {
        if (evolucion.peso && evolucion.altura) {
            const imcCalculado = calcularIMC(evolucion.peso, evolucion.altura);
            setEvolucion({ ...evolucion, imc: imcCalculado });
        }
    }, [evolucion.peso, evolucion.altura]);

    const calcularIMC = (peso, altura) => {
        return (peso / (altura * altura)).toFixed(2);
    };


    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${anio}-${mes}-${dia} ${hora}:${minutos}`;
    }


    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }


    const getSeverity = (medico) => {
        switch (medico.estadoMedico) {
            case 'Registrado':
                return 'success';

            case 'No registrado':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Fichas reservadas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Busqueda..." />
            </span>
        </div>
    );

    const headerMedico = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Consulta medica</h5>
        </div>
    );

    const hideDeleteFichaDialog = () => {
        setDeleteFichaDialog(false);
    };

    const hideHistoriaDialog = () => {
        setHistoriaDialog(false);
    };

    const hideEvolucionDialog = () => {
        setEvolucionDialog(false);
    };

    const hideListaEvolucionDialog = () => {
        setListaEvolucionDialog(false);
    };

    const confirmDeleteFicha = (ficha) => {
        setFicha(ficha);
        setDeleteFichaDialog(true);
    };

    const confirmHistoria = (ficha) => {
        mostrarHistoriaClinicaDialog(ficha)
        setHistoriaDialog(true);
    };

    const confirmEvolucion = (ficha) => {
        setFicha(ficha);
        setEvolucionDialog(true);
    };

    const confirmListaEvolucion = (ficha) => {
        mostrarEvolucionPacienteDialog(ficha)
        setListaEvolucionDialog(true);
    };

    const deleteFichaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFichaDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={cancelarFicha} />
        </>
    );

    const evolucionDialogFooter = (
        <>
            <Button label="Cerrar" icon="pi pi-times" text onClick={hideEvolucionDialog} />
            <Button label="Registrar" icon="pi pi-check" text onClick={insertarEvolucionMedicaPaciente} />
        </>
    );

    const historiaDialogFooter = (
        <>
            <Button label="Cerrar" icon="pi pi-times" text onClick={hideHistoriaDialog} />
        </>
    );

    const listaEvolucionDialogFooter = (
        <>
            <Button label="Cerrar" icon="pi pi-times" text onClick={hideListaEvolucionDialog} />
        </>
    );

    const nombrePacienteTemplate = (rowData) => {
        return <span>{rowData.nombre_paciente} {rowData.apellido_paciente}</span>;
    };

    const fechaNacimientoTemplate = (rowData) => {
        return <span>{formatDate(rowData.fecha_nacimiento)}</span>;
    };

    const fichaEstado = (value) => {
        switch (value) {
            case 'Finalizado':
                return 'success';

            case 'Pendiente':
                return 'warning';

            case 'Cancelado':
                return 'danger';

            default:
                return null;
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-book" severity="info" rounded className="mr-2" onClick={() => confirmHistoria(rowData)} />
                <Button icon="pi pi-check" severity="success" rounded className="mr-2" onClick={() => confirmEvolucion(rowData)} disabled={fichaEstado(rowData.estado_ficha) === 'success'} />
                <Button severity="danger" icon="pi pi-times" rounded className="mr-2" onClick={() => confirmDeleteFicha(rowData)} disabled={fichaEstado(rowData.estado_ficha) === 'success'} />
                <Button icon="pi pi-book" severity="warning" rounded className="mr-2" onClick={() => confirmListaEvolucion(rowData)} />
            </>
        );
    };

    const estadoTemplate = (rowData) => {
        return <Tag value={rowData.estado_ficha} severity={fichaEstado(rowData.estado_ficha)}></Tag>;
    };


    const customizedContent = (item) => {
        return (
            <Card title={item.fecha_evolucion} style={{ color: '#FF9300' }}>
                <p style={{ color: '#000', fontWeight: 'bold' }}>Nota:</p>
                <p style={{ color: '#666' }}>{item.nota_evolucion}</p>
                <p style={{ color: '#000', fontWeight: 'bold' }}>Tratamiento:</p>
                <p style={{ color: '#666' }}>{item.tratamiento}</p>
                <div className='grid'>
                    <div className='col-12 md:col-4'>
                        <p style={{ color: '#000', fontWeight: 'bold' }}>Peso:</p>
                        <p style={{ color: '#666' }}>{item.peso}</p>
                    </div>
                    <div className='col-12 md:col-4'>
                        <p style={{ color: '#000', fontWeight: 'bold' }}>Altura:</p>
                        <p style={{ color: '#666' }}>{item.altura}</p>
                    </div>
                    <div className='col-12 md:col-4'>
                        <p style={{ color: '#000', fontWeight: 'bold' }}>IMC:</p>
                        <p style={{ color: '#666' }}>{item.imc}</p>
                    </div>
                </div>
            </Card>
        );
    };


    const itemTemplate = (medico) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png`} alt={medico.rol} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{medico.nombres} {medico.apellidos}</div>
                            <span>{medico.correo}</span>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-user"></i>
                                    <span className="font-semibold">{medico.nombre_servicio}</span>
                                </span>
                                <Tag value={medico.estadoMedico} severity={getSeverity(medico)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{medico.especialidad}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="card">
                <DataView header={headerMedico} value={medico} itemTemplate={itemTemplate} />
            </div>
            <div className="card">
                <Toast ref={toast} />
                <DataTable value={fichas} dataKey="id"
                    scrollable
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} fichas"
                    emptyMessage="No se encontraron fichas de la fecha."
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll">
                    <Column field="nombre_paciente" header="Nombre" body={nombrePacienteTemplate} style={{ minWidth: '200px' }} ></Column>
                    <Column field="ci" header="CI" style={{ minWidth: '100px' }}></Column>
                    <Column field="sexo" header="Sexo" style={{ minWidth: '150px' }}></Column>
                    <Column field="fecha_nacimiento" header="Fecha de nacimiento" body={fechaNacimientoTemplate} style={{ minWidth: '150px' }}></Column>
                    <Column field="estado_ficha" header="Estado" body={estadoTemplate} style={{ minWidth: '100px' }}></Column>
                    <Column header="Accion" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} alignFrozen="right" frozen />
                </DataTable>

                <Dialog visible={historiaDialog} style={{ width: 'auto' }} header="Historia Clínica" modal footer={historiaDialogFooter} onHide={hideHistoriaDialog}>
                    <div className="flex align-items-center justify-content-center">
                        {error && error.response.status === 404 ? (
                            <div>{error.response.data.message}</div>
                        ) : (
                            historiaClinica && historiaClinica.length > 0 && (
                                <div className="field">
                                    <div className="grid">
                                        <div className="col-12 md:col-4">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Motivo de la consulta</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].motivo_consulta}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Enfermedad actual</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].enfermedad_actual}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Antecedentes</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].antecedentes}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="grid">
                                        <div className="col-12 md:col-3">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Diagnostico CIE</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].diagnostico_cie}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Diagnostico Medico</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].diagnostico_medico}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Tratamiento</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].tratamiento}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-3">
                                            <div className="field">
                                                <div className="text-500 w-full md:w-8 font-medium">Observaciones</div>
                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].observaciones}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className='card'>
                                        <h6 className='font-bold'>Examen fisico del paciente</h6>
                                        <div className="grid">
                                            <div className="col-12 md:col-3">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Presion arterial</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].presion_arterial}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-3">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Peso (Kilogramos)</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].peso}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-3">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Talla (Metros)</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].talla}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-3">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Temperatura corporal (Grados centigrados)</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].temperatura_corporal}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className="grid">
                                            <div className="col-12 md:col-4">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Frecuencia respiratoria</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].frecuencia_respiratoria}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-4">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Frecuencia cardiaca</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].frecuencia_cardiaca}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-4">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Saturacion de oxigeno</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].saturacion_oxigeno}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className="grid">
                                            <div className="col-12 md:col-6">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Examen de piel</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].examen_piel}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-6">
                                                <div className="field">
                                                    <div className="text-500 w-full md:w-8 font-medium">Examen fisico general del paciente</div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{historiaClinica[0].examen_fisico_general}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </Dialog>


                <Dialog visible={deleteFichaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteFichaDialogFooter} onHide={hideDeleteFichaDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {ficha && (
                            <span>
                                Esta seguro de cancelar la cita con: <b>{ficha.nombre_paciente} {ficha.apellido_paciente}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>


                <Dialog visible={evolucionDialog} style={{ width: '450px' }} header="Registrar Evolucion" modal footer={evolucionDialogFooter} onHide={hideEvolucionDialog} className="p-fluid">
                    <div className="field">
                        <div className="field">
                            <label htmlFor="nota_evolucion">Nota de Evolución</label>
                            <InputTextarea id="nota_evolucion" value={evolucion.nota_evolucion} onChange={(e) => setEvolucion({ ...evolucion, nota_evolucion: e.target.value })} required rows={5} cols={20} placeholder='Escriba la nota de evolucion del paciente' />
                        </div>
                        <div className="field">
                            <label htmlFor="peso">Peso (Kilogramos)</label>
                            <InputNumber id="peso" value={evolucion.peso} onValueChange={(e) => setEvolucion({ ...evolucion, peso: e.value })} mode="decimal" minFractionDigits={2} placeholder='0.00' />
                        </div>
                        <div className="field">
                            <label htmlFor="altura">Altura (Metros)</label>
                            <InputNumber id="altura" value={evolucion.altura} onValueChange={(e) => setEvolucion({ ...evolucion, altura: e.value })} mode="decimal" minFractionDigits={2} placeholder='0.00' />
                        </div>
                        <div className="field">
                            <label htmlFor="imc">IMC</label>
                            <InputNumber id="imc" value={evolucion.imc} mode="decimal" minFractionDigits={2} disabled placeholder='0.00' />
                        </div>
                        <div className="field">
                            <label htmlFor="tratamiento">Tratamiento</label>
                            <InputTextarea id="tratamiento" value={evolucion.tratamiento} onChange={(e) => setEvolucion({ ...evolucion, tratamiento: e.target.value })} required rows={3} cols={20} placeholder='Escriba el tratamiento para el paciente' />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={listaEvolucionDialog} style={{ width: 'auto' }} header="Evolucion del paciente" modal footer={listaEvolucionDialogFooter} onHide={hideListaEvolucionDialog} className="p-fluid">
                    {error && error.response.status === 404 ? (
                        <div>{error.response.data.message}</div>
                    ) : (
                        <div className="field">
                            <div className="card">
                                <Timeline value={evolucionPaciente} align="alternate" className="customized-timeline" content={customizedContent} />
                            </div>
                        </div>
                    )}
                </Dialog>

            </div>
        </div>
    )
}
