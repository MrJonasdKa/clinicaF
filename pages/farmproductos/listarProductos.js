import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import {listarNoProductos, retornar, retornarVarios } from '../../services/apiProductos';
import React, { use, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Inactivos = () => {
    let emptyProduct = {
        id_medicamento: 0, 
        nombre_medicamento: '',
        precio: 0,
        cantidad: 0,
        fechacaducidad: null
    };

    const toast = useRef(null);
    const dt = useRef(null);

    const [productos, setProductos] = useState([]);  //servicios, setServicios
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null); 

    const [returnProductDialog, setReturnProductDialog] = useState(false); 
    const [returnProductsDialog, setReturnProductsDialog] = useState(false); 

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const cargarProductos = async () => {
        try {
            const productos = await listarNoProductos();
            setProductos(productos);
        } catch (error) {
            console.log(error);
        }
    };

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_medicamento);
        return selectedIds;
    };
    
    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    async function retornarProducto() {
        try {
            const response = await retornar(product.id_medicamento);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto Habilitado', life: 3000 });
            await cargarProductos();
            setReturnProductDialog(false);
        } catch (error) {
            throw error;
        }
    }
    async function retornarProductos() {
        try {
            if (selectedProducts) {
                const selectedIds = collectSelectedIds(selectedProducts);
                console.log(selectedIds);
                const response = await retornarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Productos Habilitados', life: 3000 });
                await cargarProductos();
                setReturnProductsDialog(false);
                setSelectedProducts(null);
            }
        } catch (error) {
            throw error;
        }
    }
    useEffect(()=>{
        async function listarMedicamentos() {
            try {
                const productos = await listarNoProductos();
                console.log(productos);
                setProductos(productos);
            } catch (error) {
                console.log(error);   
            }
        }
        listarMedicamentos();
    }, []);

    const hideReturnProductDialog = () => {
        setReturnProductDialog(false);
    };
    const hideReturnProductsDialog = () => {
        setReturnProductsDialog(false);
    };

    const confirmReturnProduct = (product) => {
        setProduct(product);
        setReturnProductDialog(true);
    };

    const confirmReturnSelected = () => {
        setReturnProductsDialog(true);
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_medicamento}
            </>
        );
    };
    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_medicamento}
            </>
        );
    };
    const proveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proveedor</span>
                {rowData.nombre_proveedor}
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
    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Unitario</span>
                {formatCurrency(rowData.precio_unitario)}
            </>
        );
    };
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad}
            </>
        );
    };
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Caducidad</span>
                {rowData.fecha_caducidad}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-undo" severity="success" rounded onClick={() => confirmReturnProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h3 className='m-0'>Lista Productos Inactivos</h3>
            <Button label='Habilitar Productos' icon='pi pi-undo' severity='warning' onClick={confirmReturnSelected} disabled={!selectedProducts || !selectedProducts.length} />
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type='search'onChange={(e) => setGlobalFilter(e.target.value)} placeholder='Buscar producto...'/>
            </span>
        </div>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnProductDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarProducto} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnProductsDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarProductos} />
        </>
    );
    return(
        <div className='grid crud-demo'>
            <div className='col-12'>
                <div className='card'>
                    <Toast ref={toast}/>

                    <DataTable 
                        ref={dt}
                        value={productos}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey='id_medicamento'
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5,10,25]}
                        className='datatable-responsive'
                        paginatorTemplate={"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"}
                        currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords} productos'
                        globalFilter={globalFilter}
                        emptyMessage='No se encontraron productos disponibles.'
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="nombre_medicamento" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="suplier" header="Proveedor" body={proveedorBodyTemplate} sortable></Column>  
                        <Column field="category" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Precio Unitario" sortable body={precioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="quantity" header="Cantidad" sortable body={cantidadBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="enddate" header="Fecha Caducidad" body={fechaBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={returnProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideReturnProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Esta seguro de habilitar el siguiente producto: <b>{product.nombre_medicamento}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={returnProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideReturnProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product &&
                            ( 
                                <span>Esta seguro de habilitar los siguientes servicios seleccionados?</span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}


export default Inactivos;
