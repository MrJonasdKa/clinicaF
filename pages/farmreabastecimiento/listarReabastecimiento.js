import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { listarNoReabasteci,retornar, retornarVarios} from '../../services/apiReabastecimiento';

export const Inactivos = () => {
    let emptyRestock = {
        id_reabastecimiento: 0,
        cantidad_reabastecida: 0,
        fecha_reabastecimiento: '',
        costo_total: 0
    };

    const toast = useRef(null);
    const dt = useRef(null);

    const [reabastecimientos, setReabastecimientos] = useState([]);

    const [returnRestockDialog, setReturnRestockDialog] = useState(false);
    const [returnRestocksDialog, setReturnRestocksDialog] = useState(false);

    const [restock, setRestock] = useState(emptyRestock);

    const [selectedRestocks, setSelectedRestocks] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);


    const cargarReabastecimientos = async () => {
        try {
            const reabaste = await listarNoReabasteci();
            setReabastecimientos(reabaste);
        } catch (error) {
            console.log(error);
        }
    };

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_reabastecimiento);
        return selectedIds;
    };

    async function retornarReabastecimiento() {
        try {

            const response = await retornar(restock.id_reabastecimiento);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Registro eliminado', life: 3000 });
            await cargarReabastecimientos();
            setReturnRestockDialog(false);
            setRestock(emptyRestock);
        }
        catch (error) {
            throw error;
        }
    }
    async function retornarReabastecimientos() {
        try {
            if (selectedRestocks) {
                const selectedIds = collectSelectedIds(selectedRestocks);
                console.log(selectedIds);
                const response = await retornarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Registros eliminados', life: 3000 });
                await cargarReabastecimientos();
                setReturnRestocksDialog(false);
                setSelectedRestocks(null);
            }
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        async function mostrarReabastecimientos() {
            try {
                const reab = await listarNoReabasteci();
                console.log(reab);
                setReabastecimientos(reab);
            }
            catch (error) {
                console.log(error);
            }
        }
        mostrarReabastecimientos();
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    const hideReturnRestockDialog = () => {
        setReturnRestockDialog(false);
    };

    const hideReturnRestocksDialog = () => {
        setReturnRestocksDialog(false);
    };

    const confirmReturnRestock = (restock) => {
        setRestock(restock);
        setReturnRestockDialog(true);
    };

    const confirmReturnSelected = () => {
        setReturnRestocksDialog(true);
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_reabastecimiento}
            </>
        );
    };
    const pedidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Pedido Producto</span>
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
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad Pedida</span>
                {rowData.cantidad_reabastecida}
            </>
        );
    };
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Pedido</span>
                {rowData.fecha_reabastecimiento}
            </>
        );
    };
    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Total</span>
                {formatCurrency(rowData.costo_total)}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-undo" severity="warning" rounded onClick={() => confirmReturnRestock(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">listado de Reabastecimiento Inactivos</h3>
            <Button label="Reactivar Registros" icon="pi pi-undo" severity="warning" onClick={confirmReturnSelected} disabled={!selectedRestocks || !selectedRestocks.length} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const returnRestockDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnRestockDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarReabastecimiento} />
        </>
    );
    const returnRestocksDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideReturnRestocksDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={retornarReabastecimientos} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    
                    <DataTable
                        ref={dt}
                        value={reabastecimientos}
                        selection={selectedRestocks}
                        onSelectionChange={(e) => setSelectedRestocks(e.value)}
                        dataKey="id_reabastecimiento"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} reabastecimiento"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron registros."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="producto_id" header="Pedido Producto" sortable body={pedidoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="proveedor_id" header="Proveedor" body={proveedorBodyTemplate} sortable></Column>
                        <Column field="cantidad_reabastecida" header="Cantidad" sortable body={cantidadBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="fecha_reabastecimiento" header="Fecha Pedido" body={fechaBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="costo_total" header="Costo Total" body={precioBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={returnRestockDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnRestockDialogFooter} onHide={hideReturnRestockDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {restock && (
                                <span>
                                    Esta seguro de eliminar el siguiente registro: <b>{restock.id_reabastecimiento}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={returnRestocksDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnRestocksDialogFooter} onHide={hideReturnRestocksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {restock && 
                            (
                                <span>Esta seguro de eliminar los siguientes registros seleccionados?</span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>

    );
};
export default Inactivos;