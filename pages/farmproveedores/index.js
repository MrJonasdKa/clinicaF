import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { listarProveedores, actualizar, eliminar, eliminarVarios } from '../../services/apiProveedores';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { InputNumber } from 'primereact/inputnumber';

const Proveedores = () => {
    let emptyService = {
        id_proveedor: 0,
        nombre_proveedor: '',
        representante:'',
        telefono:'',
        descripcion_proveedor: '',
    };

    const [proveedores, setProveedores] = useState([]); //[servicios, setServicios]
    const [telefono, setTelefono] = useState('');
    const [supplierUpdateDialog, setSupplierUpdateDialog] = useState(false);
    const [deleteSupplierDialog, setDeleteSupplierDialog] = useState(false);
    const [deleteSuppliersDialog, setDeleteSuppliersDialog] = useState(false);
    const [supplier, setSupplier] = useState(emptyService);
    const [selectedSuppliers, setSelectedSuppliers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);


    const cargarProveedores = async() => {
        try {
            const proveedores = await listarProveedores();
            setProveedores(proveedores);
        } catch (error) {
            console.log(error);
        }
    };

    async function actualizarProveedor() {
        try {
            const response = await actualizar(supplier.id_proveedor,supplier.nombre_proveedor,supplier.representante,supplier.telefono,supplier.descripcion_proveedor);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio actualizado', life: 3000 })
            await cargarProveedores();
            setSupplierUpdateDialog(false);
            setSupplier(emptyService);
        } catch (error) {
            console.log(error);
        }
    }
    function onSubmitActualizar() {
        actualizarProveedor();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_proveedor);
        return selectedIds;
    };

    async function eliminarProveedor() {
        try {
            const response = await eliminar(supplier.id_proveedor);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Proveedor eliminado', life: 3000});
            await cargarProveedores();
            setDeleteSupplierDialog(false);
            setSupplier(emptyService);
        } catch (error) {
            throw error;
        }
    }
    async function eliminarProveedores() {
        try {
            if (selectedSuppliers) {
                const selectedIds = collectSelectedIds(selectedSuppliers);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Proveedores eliminados', life: 3000 });
                await cargarProveedores();
                setDeleteSuppliersDialog(false);
                setSelectedSuppliers(null);
            }
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(()=>{
        async function cargarProveedores() {
            try {
                const proveedores = await listarProveedores();
                console.log(proveedores);
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        cargarProveedores();
    },[]);

    const hideDialog = () => {
        setSubmitted(false);
        setSupplierUpdateDialog(false);
    };

    const hideDeleteSupplierDialog = () => {
        setDeleteSupplierDialog(false);
    };

    const hideDeleteSuppliersDialog = () => {
        setDeleteSuppliersDialog(false);
    };

    const editSupplier = (supplier) => {
        setSupplier({ ...supplier });
        console.log(supplier);
        setSupplierUpdateDialog(true);
    };

    const confirmDeleteSupplier = (supplier) => {
        setSupplier(supplier);
        setDeleteSupplierDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteSuppliersDialog(true);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSupplier(prevSupplier => ({
            ...prevSupplier,
            [name]: value
        }));
    };
    const handleTelefonoChange = (event) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
        const limitedValue = numericValue.slice(0, 10); // Limita a 10 caracteres

        setTelefono(limitedValue);
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_proveedor}
            </>
        );
    };
    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_proveedor}
            </>
        );
    };
    const representanteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Representante</span>
                {rowData.representante}
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
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion_proveedor}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="info" rounded className="mr-2" onClick={() => editSupplier(rowData)} />
                <Button icon="pi pi-times" severity="danger" rounded onClick={() => confirmDeleteSupplier(rowData)} />
            </>
        );
    };

    const openNewExportar = () => {
        setServiceDialogExportar(true);
    };
    const hideDialogExportar = () => {
        setServiceDialogExportar(false);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">Gestion y Atualizacion de Proveedores</h3>
            <Button visible={false} label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedSuppliers || !selectedSuppliers.length} />
            <Button visible={false} label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const supplierUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deleteSupplierDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSupplierDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarProveedor} />
        </>
    );
    const deleteSuppliersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSuppliersDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarProveedores} />
        </>
    );

    function exportToPDF() {
        if (proveedores.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de provedores está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de provedores no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Título
            const title = 'Informe de proveedores';
            doc.setFontSize(18);
            doc.text(title, 10, 10);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los proveedores relacionados con la clinica CIES. El informe incluye información relevante sobre cada proveedor, como el nombre, representante, telefono y descripcion del proveedor. Esperamos que este informe sea útil para comprender mejor nuestros proveedores.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 20);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

            const tableColumns = [
                { header: 'Nombre del proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Representante', dataKey: 'representante' },
                { header: 'Telefono', dataKey: 'telefono' },
                { header: 'Descripcion del proveedor', dataKey:'descripcion_proveedor' }
            ];
            
            const tableData = proveedores.map(proveedores => ({
                nombre_proveedor: proveedores.nombre_proveedor,
                representante: proveedores.representante,
                telefono: proveedores.telefono,
                descripcion_proveedor: proveedores.descripcion_proveedor
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_provedores.pdf');
        }
    }

    function exportToExcel() {
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
                { header: 'Descripcion del proveedor', dataKey:'descripcion_proveedor' }
            ];
            
            const tableData = proveedores.map(proveedores => ({
                nombre_proveedor: proveedores.nombre_proveedor,
                representante: proveedores.representante,
                telefono: proveedores.telefono,
                descripcion_proveedor: proveedores.descripcion_proveedor
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
            excelLink.download = 'tabla_provedores.xlsx';
            excelLink.click();
        }
    }


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable
                        ref={dt}
                        value={proveedores}
                        selection={selectedSuppliers}
                        onSelectionChange={(e) => setSelectedSuppliers(e.value)}
                        dataKey="id_proveedor"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} proveedores"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron proveedores."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="nombre_proveedor" header="Nombre Proveedor" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="representante" header="Representante" body={representanteBodyTemplate} sortable></Column>
                        <Column field="telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="descripcion_proveedor" header="Descripcion" body={descripcionBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={supplierUpdateDialog} style={{ width: '450px' }} header="Editar Proveedor" modal className="p-fluid" footer={supplierUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre_proveedor">Nombre del Proveedor</label>
                            <InputText id="nombre_proveedor" name="nombre_proveedor" value={supplier.nombre_proveedor} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !supplier.nombre_proveedor })} />
                            {submitted && !supplier.nombre_proveedor && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className='field'>
                            <label htmlFor='Representante'>Representante del Proveedor</label>
                            <InputText id='representante' name='representante' value={supplier.representante} onChange={onInputChange} required autoFocus className={classNames({'p-invalid' : submitted && !supplier.representante})}/>
                            {submitted && !supplier.representante && <small className='p-invalid'>Nombre del Representante del Proveedor, requerido.</small>}
                        </div>

                        <div className='field'>
                            <label htmlFor='telefono'>Telefono de la Proveedora</label>
                            <InputNumber
                                id='telefono'
                                name='telefono'
                                value={supplier.telefono}
                                onValueChange={(e) => setSupplier({ ...supplier, telefono: e.target.value })}
                                required
                                autoFocus
                                useGrouping={false}
                                maxLength={8}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="descripcion_proveedor">Descripcion</label>
                            <InputTextarea id="descripcion_proveedor" name="descripcion_proveedor" value={supplier.descripcion_proveedor} onChange={onInputChange} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSupplierDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSupplierDialogFooter} onHide={hideDeleteSupplierDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {supplier && (
                                <span>
                                    Esta seguro de eliminar el siguiente servicio: <b>{supplier.nombre_proveedor}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSuppliersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSuppliersDialogFooter} onHide={hideDeleteSuppliersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {supplier && 
                            <span>
                                Esta seguro de eliminar los siguiente servicios seleccionados?
                            </span>}
                        </div>
                    </Dialog>

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
        </div>
    );
};
export default Proveedores