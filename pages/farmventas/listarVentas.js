import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { listarNoVentas,actualizar, eliminar, eliminarVarios } from '../../services/apiVentas';

export const Inactivos = () => {
    let emptySale = {
        id_ventas: 0,
        id_medicamento:0,
        cantidad_vendida: 0,
        fecha_venta: null,
        total_venta: 0
    };

    const dt = useRef(null);
    const toast = useRef(null);

    const [medicamentos, setMedicamentos] = useState([]);
    

    const [ventas, setVentas] = useState([]);
    const [listboxValue, setListboxValue] = useState(null);
    const [saleUpdateDialog, setSaleUpdateDialog] = useState(false);
    const [deleteSaleDialog, setDeleteSaleDialog] = useState(false);
    const [deleteSalesDialog, setDeleteSalesDialog] = useState(false);
    const [sale, setSale] = useState(emptySale);
    const [selectedSales, setSelectedSales] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    

    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [showDates, setShowDates] = useState(false);

    const cargarVentas = async () => {
        try {
            const venta = await listarNoVentas();
            setVentas(venta);
        } catch (error) {
            console.log(error);
        }
    };

    async function actualizarVenta() {
        try {
            const response = await actualizar(sale.id_ventas,sale.id_medicamento,sale.cantidad_vendida,sale.fecha_venta,sale.total_venta);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Venta actualizada', life: 3000 });
            await cargarVentas();
            setSaleUpdateDialog(false);
            setSale(emptySale);
        } catch (error) {
            console.log(error);
        }
    }
    function onSubmitActualizar() {
        actualizarVenta();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_ventas);
        return selectedIds;
    };

    async function eliminarVenta() {
        try {
            const response = await eliminar(sale.id_ventas);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Venta eliminada', life: 3000});
            await cargarVentas();
            setDeleteSaleDialog(false);
            setSale(emptySale);
        } catch (error) {
            throw error;
        }
    }
    async function eliminarVentas() {
        try {
            if (selectedSales) {
                const selectedIds = collectSelectedIds(selectedSales);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Ventas eliminadas', life: 3000 });
                await cargarVentas();
                setDeleteSalesDialog(false);
                setSelectedSales(null);
            }
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(()=>{
        async function cargarMedicamentos() {
            try {
                const ventas = await listarMedicamentos();
                console.log(ventas);
                setMedicamentos(ventas);
            } catch (error) {
                console.log(error);
            }
        }
        cargarMedicamentos();
    },[]);

    useEffect(()=>{
        async function cargarVentas() {
            try {
                const ventas = await listarNoVentas();
                console.log(ventas);
                setVentas(ventas);
            } catch (error) {
                console.log(error);
            }
        }
        cargarVentas();
    },[]);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSaleUpdateDialog(false);
    };

    const hideDeleteSaleDialog = () => {
        setDeleteSaleDialog(false);
    };

    const hideDeleteSalesDialog = () => {
        setDeleteSalesDialog(false);
    };

    const editSale = (sale) => {
        setSale({ ...sale });
        console.log(sale);
        setSaleUpdateDialog(true);
    };

    const confirmDeleteSale = (sale) => {
        setSale(sale);
        setDeleteSaleDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteSalesDialog(true);
    };
    
    function onMedicinChangeUpdate(medicamentoId) {
        setSale(prevSale => {
            if (prevSale.id_medicamento === medicamentoId) {
                return { ...prevSale, id_medicamento: null };
            } else {
                return { ...prevSale, id_medicamento: medicamentoId };
            }
        });
    }

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setSale(prevSale => ({
            ...prevSale,
            [name]: parseFloat(value)
        }));
    };
    const onDateChange = (e) => {
        setSale(prevProduct => ({
            ...prevProduct,
            fecha_venta: e.value
        }));
    };


    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_venta}
            </>
        );
    };
    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre </span>
                {rowData.nombre_medicamento}
            </>
        );
    };
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad_vendida}
            </>
        );
    };
    const pacienteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Paciente</span>
                {rowData.nombres}
            </>
        );
    };
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Venta</span>
                {rowData.fecha_venta}
            </>
        );
    };
    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Total</span>
                {formatCurrency(rowData.total_venta)}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-undo" severity="warning" rounded onClick={() => confirmDeleteSale(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">Listado de Ventas Inactivas</h3>
            <Button label="Reactivar Venta" icon="pi pi-undo" severity="warning" onClick={confirmDeleteSelected} disabled={!selectedSales || !selectedSales.length} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const deleteSaleDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSaleDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarVenta} />
        </>
    );
    const deleteSalesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteSalesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarVentas} />
        </>
    );

    function exportToPDF() {
        if (ventas.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de ventas está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de ventas no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Título
            const title = 'Informe de Ventas';
            doc.setFontSize(18);
            doc.text(title, 10, 10);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de las ventas que realizo la clinica CIES. El informe incluye información relevante sobre cada venta, como el nombre del medicamento, cantidad vendida, fecha venta y total de venta. Esperamos que este informe sea útil para comprender mejor nuestros productos.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 20);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Cantidad vendida', dataKey: 'cantidad_vendida' },
                { header: 'Fecha venta', dataKey: 'fecha_venta' },
                { header: 'Total de venta', dataKey:'total_venta' }
            ];
            
            const tableData = ventas.map(ventas => ({
                nombre_medicamento: ventas.nombre_medicamento,
                cantidad_vendida: ventas.cantidad_vendida,
                fecha_venta: ventas.fecha_venta,
                total_venta: ventas.total_venta
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_ventas.pdf');
        }
    }

    function exportToExcel() {
            if (ventas.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de ventas está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de ventas no se pudo exportar porque está vacía.', life: 3000 });
            return;
            } else {
                const doc = new jsPDF();
            
                const tableColumns = [
                    { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                    { header: 'Cantidad vendida', dataKey: 'cantidad_vendida' },
                    { header: 'Fecha venta', dataKey: 'fecha_venta' },
                    { header: 'Total de venta', dataKey:'total_venta' }
                ];
                
                const tableData = ventas.map(ventas => ({
                    nombre_medicamento: ventas.nombre_medicamento,
                    cantidad_vendida: ventas.cantidad_vendida,
                    fecha_venta: ventas.fecha_venta,
                    total_venta: ventas.total_venta
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
                excelLink.download = 'tabla_ventas.xlsx';
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
                        value={ventas}
                        selection={selectedSales}
                        onSelectionChange={(e) => setSelectedSales(e.value)}
                        dataKey="id_venta"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} ventas"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontró registro de ventas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="nombre_medicamento" header="Nombre Producto" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cantidad_vendida" header="Cantidad Vendida" body={cantidadBodyTemplate} sortable></Column>
                        <Column field="nombre_paciente" header="Nombre Paciente" sortable body={pacienteBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="fecha_venta" header="Fecha Venta" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="total_venta" header="Total Venta" body={precioBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={deleteSaleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSaleDialogFooter} onHide={hideDeleteSaleDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {sale && (
                                <span>
                                    Esta seguro de reactivar la siguiente venta: <b>{sale.nombre_medicamento}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSalesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSalesDialogFooter} onHide={hideDeleteSalesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {sale && 
                            <span>
                                Esta seguro de reactivar las siguientes ventas seleccionadas?
                            </span>}
                        </div>
                    </Dialog>
                </div>
            </div>    
        </div>
    );
};
export default Inactivos;