import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { actualizar, mostrarUsuarios } from "../../services/apiUsuarios";
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

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef(null);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [rol, setRol] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await mostrarUsuarios();
      setUsuarios(response);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarUsuario = async (usuarioId) => {
    try {
      const response = await deleteUsuario(usuarioId);
      console.log(response);
      obtenerUsuarios();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario eliminado exitosamente",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario",
        life: 3000,
      });
    }
  };

  const confirmarEliminarUsuario = (usuario) => {
    const confirmEliminar = () => {
      setUsuarioSeleccionado(usuario);
      console.log("Se confirma la eliminacion");
      confirmDialog({
        message: `¿Estás seguro de que quieres eliminar a ${usuario.nombres}?`,
        header: "Confirmar Eliminación",
        icon: "pi pi-exclamation-triangle",
        accept: () => eliminarUsuario(usuario.id), // Pasa usuario.id en lugar de usuario
      });
    };

    confirmEliminar();
  };

  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombres(usuario.nombres);
    setApellidos(usuario.apellidos);
    setCorreo(usuario.correo);
    setContrasenia(usuario.contrasenia);
    setRol(usuario.rol);
    setDialogVisible(true);
  };

  const guardarCambios = async () => {
    if (!nombres || !apellidos || !correo || !rol) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
        life: 3000,
      });
      return;
    }

    try {
      await actualizar(
        usuarioSeleccionado.id,
        nombres,
        apellidos,
        correo,
        contrasenia,
        rol
      );
      obtenerUsuarios();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario actualizado exitosamente",
        life: 3000,
      });
      cerrarDialogo();
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el usuario",
        life: 3000,
      });
    }
  };

  const cerrarDialogo = () => {
    setUsuarioSeleccionado(null);
    setNombres("");
    setApellidos("");
    setCorreo("");
    setContrasenia("");
    setRol("");
    setDialogVisible(false);
  };

  const dialogFooter = (
    <div className="p-clearfix">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-secondary"
        onClick={cerrarDialogo}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-primary bg-orange-500"
        onClick={guardarCambios}
      />
    </div>
  );

  const opcionesRol = [
    { label: "Administrador", value: "administrador" },
    { label: "Recepcionista", value: "recepcionista" },
    { label: "Médico", value: "medico" },
    { label: "Farmacéutico", value: "farmaceutico" },
  ];

  return (
    <div className="card">
      <h5>Actualizar Usuario</h5>
      <span>Seleccione al usuario que desea editar o eliminar</span>
      <Toast ref={toast} />
      <DataTable value={usuarios} className="p-datatable-striped">
        <Column field="nombres" header="Nombres" />
        <Column field="apellidos" header="Apellidos" />
        <Column field="correo" header="Correo" />
        <Column field="rol" header="Rol" />
        <Column
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2 mr-3"
                onClick={() => editarUsuario(rowData)}
              />
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-danger"
                onClick={() => eliminarUsuario(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>
      <Dialog
        visible={dialogVisible}
        onHide={cerrarDialogo}
        header={usuarioSeleccionado ? "Editar Usuario" : "Agregar Usuario"}
        footer={dialogFooter}
        style={{ width: "50vw" }} // Aumenta el tamaño de la ventana emergente
      >
        <div className="p-grid p-fluid">
          <div className="p-col-4">
            <label htmlFor="nombre">Nombre</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="apellido">Apellido</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="correo">Correo</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="contrasenia">Contraseña</label>
          </div>
          <div className="p-col-8">
            <Password
              id="contrasenia"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              toggleMask
              feedback={false}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="rol">Rol</label>
          </div>
          <div className="p-col-8">
            <Dropdown
              id="rol"
              value={rol}
              options={opcionesRol}
              onChange={(e) => setRol(e.value)}
              placeholder="Seleccionar Rol"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Usuarios;
