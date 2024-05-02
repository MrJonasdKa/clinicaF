import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import {listarNoProveedores, retornar, retornarVarios } from '../../services/apiProveedores';
import React, { use, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


const Inactivos = () => {
    let emptyService = {
        id_proveedor: 0,
        nombre_proveedor: '',
        representante:'',
        telefono:'',
        descripcion_proveedor: '',
    };

    const toast = useRef(null);
    const dt = useRef(null);

    const [proveedores, setProveedores] = useState([]); 

    const [returnSupplierDialog, setReturnSupplierDialog] = useState(false);
    const [returnSuppliersDialog, setReturnSuppliersDialog] = useState(false);

    const [supplier, setSupplier] = useState(emptyService);

    const [selectedSuppliers, setSelectedSuppliers] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const cargarProveedores = async () => {
        try {
            const proveedor = await listarNoProveedores();
            setProveedores(proveedor);
        } catch (error) {
            console.log(error);
        }
    };

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_proveedor);
        return selectedIds;
    };

    async function retornarProveedor() {
        try {
            const response = await retornar(supplier.id_proveedor);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Proveedor eliminado', life: 3000});
            await cargarProveedores();
            setReturnSupplierDialog(false);
            setSupplier(emptyService);
        } catch (error) {
            throw error;
        }
    }

    async function retornarProveedores() {
        try {
            if (selectedSuppliers) {
                const selectedIds = collectSelectedIds(selectedSuppliers);
                console.log(selectedIds);
                const response = await retornarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Proveedores eliminados', life: 3000 });
                await cargarProveedores();
                setReturnSuppliersDialog(false);
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
                const proveedores = await listarNoProveedores();
                console.log(proveedores);
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        cargarProveedores();
    },[]);

    const hideReturnSupplierDialog = () => {
        setReturnSupplierDialog(false);
    };

    const hideReturnSuppliersDialog = () => {
        setReturnSuppliersDialog(false);
    };

    const confirmReturnSupplier = (supplier) => {
        setSupplier(supplier);
        setReturnSupplierDialog(true);
    };

    const confirmReturnSelected = () => {
        setReturnSuppliersDialog(true);
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
                <Button icon="pi pi-undo" severity="success" rounded onClick={() => confirmReturnSupplier(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">Gestion de Proveedores Inactivos</h3>
            <Button label="Reactivar productos" icon="pi pi-undo" severity="warning" onClick={confirmReturnSelected} disabled={!selectedSuppliers || !selectedSuppliers.length} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const returnSupplierDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnSupplierDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarProveedor} />
        </>
    );
    const returnSuppliersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnSuppliersDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarProveedores} />
        </>
    );

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


                    <Dialog visible={returnSupplierDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnSupplierDialogFooter} onHide={hideReturnSupplierDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {supplier && (
                                <span>
                                    Esta seguro de reactivar el siguiente servicio: <b>{supplier.nombre_proveedor}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={returnSuppliersDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnSuppliersDialogFooter} onHide={hideReturnSuppliersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {supplier && 
                            <span>
                                Esta seguro de reactivar los siguiente servicios seleccionados?
                            </span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};
export default Inactivos;