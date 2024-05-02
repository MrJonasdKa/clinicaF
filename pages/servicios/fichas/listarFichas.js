
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { listarFichas, eliminarFicha } from '../../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../../utils/session';
import { decryptData } from '../../../services/crypto';


export default function FrozenColumnsDemo() {

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

    let today = new Date();

    const [fecha, setFecha] = useState(obtenerFechaActual);
    const [fichas, setFichas] = useState([]);
    const [ficha, setFicha] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteFichaDialog, setDeleteFichaDialog] = useState(false);
    const toast = useRef(null);


    useEffect(() => {
        async function obtenerFichasActual() {
            try {
                const fechaBusqueda = formatDate(fecha);
                const fichas = await listarFichas(fechaBusqueda);
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
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Ficha cancelada', life: 3000 });
            setDeleteFichaDialog(false);
        }
        catch (error) {
            throw error;
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

        return `${year}-${month}-${day}`;
    }

    const hideDeleteFichaDialog = () => {
        setDeleteFichaDialog(false);
    };

    const confirmDeleteFicha = (ficha) => {
        setFicha(ficha);
        setDeleteFichaDialog(true);
    };

    const deleteFichaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFichaDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={cancelarFicha} />
        </>
    );

    const nombrePacienteTemplate = (rowData) => {
        return <span>{rowData.nombre_paciente} {rowData.apellido_paciente}</span>;
    };
    const nombreMedicoTemplate = (rowData) => {
        return <span>{rowData.nombre_medico} {rowData.apellido_medico}</span>;
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
        return <Button type="button" icon="pi pi-trash" severity='danger' rounded onClick={() => confirmDeleteFicha(rowData)} disabled={fichaEstado(rowData.estado_ficha) === 'success' || fichaEstado(rowData.estado_ficha) === 'danger'}></Button>;
    };

    const estadoTemplate = (rowData) => {
        return <Tag value={rowData.estado_ficha} severity={fichaEstado(rowData.estado_ficha)}></Tag>;
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Fichas reservadas</h5>

            <span className="block mt-2 md:mt-0">
                <Calendar value={fecha} onChange={(e) => { setFecha(e.value); }} maxDate={today} required autoFocus showIcon dateFormat="yy-mm-dd" placeholder='Buscar fecha...' />
            </span>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Busqueda..." />
            </span>
        </div>
    );

    return (
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
                <Column field="codigo" header="Codigo" style={{ minWidth: '100px' }}></Column>
                <Column field="nombre_paciente" header="Nombre" body={nombrePacienteTemplate} style={{ minWidth: '200px' }} ></Column>
                <Column field="ci" header="CI" style={{ minWidth: '100px' }}></Column>
                <Column field="sexo" header="Sexo" style={{ minWidth: '150px' }}></Column>
                <Column field="fecha_nacimiento" header="Fecha de nacimiento" body={fechaNacimientoTemplate} style={{ minWidth: '150px' }}></Column>
                <Column field="nombre_medico" header="Medico" body={nombreMedicoTemplate} style={{ minWidth: '200px' }}></Column>
                <Column field="nombre_servicio" header="Servicio" style={{ minWidth: '150px' }}></Column>
                <Column field="estado_ficha" header="Estado" body={estadoTemplate} style={{ minWidth: '100px' }} alignFrozen="right" frozen></Column>
                <Column header="Accion" headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} alignFrozen="right" frozen />
            </DataTable>

            <Dialog visible={deleteFichaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteFichaDialogFooter} onHide={hideDeleteFichaDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {ficha && (
                        <span>
                            Esta seguro de cancelar la siguiente ficha: <b>{ficha.codigo}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
