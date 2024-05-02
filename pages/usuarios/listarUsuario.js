import React, { useState, useEffect } from "react";
import { mostrarUsuarios } from "../../services/apiUsuarios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const App = () => {

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
  const [searchText, setSearchText] = useState("");
  const [serviceDialogExportar, setServiceDialogExportar] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const usuarios = await mostrarUsuarios();
      console.log(usuarios);
      setUsuarios(usuarios);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filtrarUsuariosTabla = (usuarios) => {
    if (!usuarios || usuarios.length === 0) {
      return [];
    }

    if (searchText === "") {

      return usuarios;
    } else {
      const filtrarUsuarios = usuarios.filter(
        (usuario) =>
          (usuario.nombres && usuario.nombre.includes(searchText)) ||
          (usuario.apellidos && usuario.apellido.includes(searchText)) ||
          (usuario.correo && usuario.correo.includes(searchText))
      );
      console.log("Usuarios filtrados:", filtrarUsuarios);
      return filtrarUsuarios;
    }
  };

  const idBodyTemplate = (rowData) => {
    return <span>{rowData.id}</span>;
  };

  const nombreBodyTemplate = (rowData) => {
    return <span>{rowData.nombres}</span>;
  };

  const apellidoBodyTemplate = (rowData) => {
    return <span>{rowData.apellidos}</span>;
  };

  const correoElectronicoBodyTemplate = (rowData) => {
    return <span>{rowData.correo}</span>;
  };
  //Informes
  const openNewExportar = () => {
    setServiceDialogExportar(true);
  };
  const hideDialogExportar = () => {
    setServiceDialogExportar(false);
  };
  //Fin informes
  //Informes
  function exportToPDF() {
    if (usuarios.length === 0) {
      // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
      toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de usuarios no se pudo exportar porque está vacía.', life: 3000 });
      return;
    } else {

      const doc = new jsPDF();

      // Título
      const title = 'Informe de usuarios';
      doc.setFontSize(18);
      doc.text(title, 10, 10);

      // Párrafo introductorio
      const introText = 'A continuación se presenta un informe detallado de los usuarios registrados en la clinica CIES. El informe incluye información relevante sobre cada usuario, como el nombre, apellido, correo y rol.';

      const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
      doc.setFontSize(12);
      doc.text(splitIntroText, 10, 20);

      const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

      const tableColumns = [
        { header: 'Nombre', dataKey: 'nombre' },
        { header: 'Apellido', dataKey: 'apellido' },
        { header: 'Correo', dataKey: 'correo' },
        { header: 'Rol', dataKey: 'rol' }
      ];

      const tableData = usuarios.map(usuarios => ({
        nombre: usuarios.nombres,
        apellido: usuarios.apellidos,
        correo: usuarios.correo,
        rol: usuarios.rol
      }));

      doc.autoTable(tableColumns, tableData, {
        startY,
        margin: { top: 5 },
      });

      doc.save('tabla_usuarios.pdf');
    }
  }


  function exportToExcel() {
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
        { header: 'Rol', dataKey: 'rol' }
      ];

      const tableData = usuarios.map(usuarios => ({
        nombre: usuarios.nombres,
        apellido: usuarios.apellidos,
        correo: usuarios.correo,
        rol: usuarios.rol
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
      excelLink.download = 'tabla_usuarios.xlsx';
      excelLink.click();
    }
  }


  return (
    <div className="card">
      <div className="container">
        <div className="header">
          <h5 >Lista de Usuarios</h5>
        </div>

        <div className="search-bar" style={{ display: 'inline-block', marginRight: '1px' }}>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar Usuario"
            />
          </span>
        </div>
        
        <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} style={{ float: 'right' }} />

        <DataTable

          value={filtrarUsuariosTabla(usuarios)}
          dataKey="id"
          className="p-datatable-gridlines p-datatable-striped"
          emptyMessage="No se encontraron usuarios."
        >

          <Column field="id" header="ID" body={idBodyTemplate} sortable />
          <Column field="nombres" header="Nombre" body={nombreBodyTemplate} sortable />
          <Column field="apellidos" header="Apellido" body={apellidoBodyTemplate} sortable />
          <Column field="correo_electronico" header="Correo Electrónico" body={correoElectronicoBodyTemplate} sortable />
        </DataTable>
        <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar" modal className="p-fluid" onHide={hideDialogExportar}>

          <div className="field" style={{ display: 'flex', gap: '10px' }}>
            <label htmlFor="formato">En que formato quiere el reporte</label>
          </div>

          <div className="field" style={{ display: 'flex', gap: '10px' }}>
            <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcel} />
            <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDF} />
          </div>
        </Dialog>
      </div>
    </div>
  );
};


export default App;
