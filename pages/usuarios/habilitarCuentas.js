import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from 'primereact/tag';
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { mostrarUsuariosEstado, actualizarEstadoHabilitado, actualizarEstadoDeshabilitado } from "../../services/apiUsuarios";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteUsuario } from "../../services/apiUsuarios";
import { Dialog } from "primereact/dialog";
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const Usuarios = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador'];

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

    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioDeshabilitadoDialog, setUsuarioDeshabilitadoDialog] = useState(false);
    const [usuarioHabilitadoDialog, setUsuarioHabilitadoDialog] = useState(false);
    const toast = useRef(null);


    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await mostrarUsuariosEstado();
            console.log(response);
            setUsuarios(response);
        } catch (error) {
            console.log(error);
        }
    };

    async function deshabilitarUsuario() {
        try {

            const response = await actualizarEstadoDeshabilitado(usuario.id);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Usuario deshabilitado', life: 3000 });
            setUsuarioDeshabilitadoDialog(false);
            obtenerUsuarios();
        }
        catch (error) {
            throw error;
        }
    }

    async function habilitarUsuario() {
        try {

            const response = await actualizarEstadoHabilitado(usuario.id);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario habilitado', life: 3000 });
            setUsuarioHabilitadoDialog(false);
            obtenerUsuarios();
        }
        catch (error) {
            throw error;
        }
    }

    const usuarioEstado = (value) => {
        switch (value) {
            case 1:
                return 'success';

            case 0:
                return 'danger';

            default:
                return null;
        }
    };

    const usuarioEstadoTexto = (value) => {
        switch (value) {
            case 1:
                return 'Habilitado';

            case 0:
                return 'Deshabilitado';

            default:
                return null;
        }
    };

    const hideUsuarioDeshabilitadoDialog = () => {
        setUsuarioDeshabilitadoDialog(false);
    };
    const hideUsuarioHabilitadoDialog = () => {
        setUsuarioHabilitadoDialog(false);
    };

    const confirmUsuarioDeshabilitado = (usuario) => {
        setUsuario(usuario);
        setUsuarioDeshabilitadoDialog(true);
    };

    const confirmUsuarioHabilitado = (usuario) => {
        setUsuario(usuario);
        setUsuarioHabilitadoDialog(true);
    };

    const usuarioDeshabilitadoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideUsuarioDeshabilitadoDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deshabilitarUsuario} />
        </>
    );

    const usuarioHabilitadoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideUsuarioHabilitadoDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={habilitarUsuario} />
        </>
    );

    const estadoTemplate = (rowData) => {
        return <Tag value={usuarioEstadoTexto(rowData.estado)} severity={usuarioEstado(rowData.estado)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-check"
                    severity="success" rounded className="mr-2"
                    onClick={() => confirmUsuarioHabilitado(rowData)}
                />
                <Button
                    icon="pi pi-times"
                    severity="danger" rounded
                    onClick={() => confirmUsuarioDeshabilitado(rowData)}
                />
            </>
        );
    };

    return (
        <div className="card">
            <h5>Habilitar/Deshabilitar usuarios</h5>
            <span>Seleccione al usuario que desea habilitar o deshabilitar</span>
            <Toast ref={toast} />
            <DataTable value={usuarios} className="p-datatable-striped">
                <Column field="nombres" header="Nombres" />
                <Column field="apellidos" header="Apellidos" />
                <Column field="correo" header="Correo" />
                <Column field="rol" header="Rol" />
                <Column field="estado" header="Estado" body={estadoTemplate} />
                <Column header="Accion" body={actionBodyTemplate} />
            </DataTable>
            <Dialog visible={usuarioDeshabilitadoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={usuarioDeshabilitadoDialogFooter} onHide={hideUsuarioDeshabilitadoDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            Esta seguro de deshabilitar la cuenta de: <b>{usuario.nombres} {usuario.apellidos}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={usuarioHabilitadoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={usuarioHabilitadoDialogFooter} onHide={hideUsuarioHabilitadoDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            Desea habilitar la cuenta de: <b>{usuario.nombres} {usuario.apellidos}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default Usuarios;
