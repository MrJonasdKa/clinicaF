import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Rating } from 'primereact/rating';
import { listarCategorias, mostrarServicios, habilitarServicio, actualizar, eliminar, eliminarVarios } from '../../services/apiService';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Servicios = () => {

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

    let emptyService = {
        id: 0,
        nombre_servicio: '',
        descripcion_servicio: '',
        precio: 0,
        ruta_imagen: ''
    };

    const fileUploadRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [services, setServices] = useState(null);
    const [serviceDialog, setServiceDialog] = useState(false);
    const [serviceUpdateDialog, setServiceUpdateDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [habilitarServiceDialog, setHabilitarServiceDialog] = useState(false);
    const [deleteServicesDialog, setDeleteServicesDialog] = useState(false);
    const [service, setService] = useState(emptyService);
    const [descripcion_servicio, setDescripcion_servicio] = useState('');
    const [selectedServices, setSelectedServices] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    const cargarServicios = async () => {
        try {
            const servicios = await mostrarServicios();
            setServicios(servicios);
        } catch (error) {
            console.log(error);
        }
    };


    async function actualizarServicio() {
        if (service.nombre_servicio.trim() !== "" &&
            service.descripcion_servicio.trim() !== "" &&
            service.id_categoria != null &&
            (selectedImage || currentImage)) {
            try {
                const imageToUpload = selectedImage !== currentImage ? selectedImage : null;
                const response = await actualizar(service.id, service.nombre_servicio, descripcion_servicio, service.id_categoria, imageToUpload);
                console.log(response);
                console.log(selectedImage);
                console.log(imageToUpload);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio actualizado', life: 3000 });
                await cargarServicios();
                setServiceUpdateDialog(false);
                setService(emptyService);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }


    function onSubmitActualizar() {
        actualizarServicio();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id);
        return selectedIds;
    };

    async function eliminarServicio() {
        try {

            const response = await eliminar(service.id);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio eliminado', life: 3000 });
            await cargarServicios();
            setDeleteServiceDialog(false);
            setService(emptyService);
        }
        catch (error) {
            throw error;
        }
    }

    async function habilitarServicioID() {
        try {

            const response = await habilitarServicio(service.id);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio habilitado', life: 3000 });
            await cargarServicios();
            setHabilitarServiceDialog(false);
            setService(emptyService);
        }
        catch (error) {
            throw error;
        }
    }

    async function eliminarServicios() {
        try {
            if (selectedServices) {
                const selectedIds = collectSelectedIds(selectedServices);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicios eliminados', life: 3000 });
                await cargarServicios();
                setDeleteServicesDialog(false);
                setSelectedServices(null);
            }

        }
        catch (error) {
            throw error;
        }
    }


    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    useEffect(() => {
        async function listarServicios() {
            try {
                const servicios = await mostrarServicios();
                console.log(servicios);
                setServicios(servicios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, []);

    const handleFileUpload = (event) => {
        console.log('Image selected');
        const file = event.files[0];
        setSelectedImage(file);
        console.log(file);
        setImageURL(null);
        setImageURL(URL.createObjectURL(file));
        fileUploadRef.current.clear();
    };



    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const headerEditor = renderHeader();

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    //Informes
    const openNewExportar = () => {
        setServiceDialogExportar(true);
    };
    const hideDialogExportar = () => {
        setServiceDialogExportar(false);
    };
    //Fin informes

    const hideDialog = () => {
        setSubmitted(false);
        setServiceDialog(false);
        setServiceUpdateDialog(false);
    };

    const hideDeleteServiceDialog = () => {
        setDeleteServiceDialog(false);
    };

    const hideHabilitarServiceDialog = () => {
        setHabilitarServiceDialog(false);
    };

    const hideDeleteServicesDialog = () => {
        setDeleteServicesDialog(false);
    };


    const editService = (service) => {
        setService({ ...service });
        console.log(service);
        setDescripcion_servicio(service.descripcion_servicio);
        setServiceUpdateDialog(true);
        setImageURL(null);
        setCurrentImage(service.ruta_imagen);
        console.log(currentImage);
    };

    const confirmDeleteService = (service) => {
        setService(service);
        setDeleteServiceDialog(true);
    };

    const confirmHabilitarService = (service) => {
        setService(service);
        setHabilitarServiceDialog(true);
    };


    const confirmDeleteSelected = () => {
        setDeleteServicesDialog(true);
    };


    function onCategoryChangeUpdate(categoriaId) {
        setService(prevService => {
            if (prevService.id_categoria === categoriaId) {
                return { ...prevService, id_categoria: null };
            } else {
                return { ...prevService, id_categoria: categoriaId };
            }
        });
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setService(prevService => ({
            ...prevService,
            [name]: value
        }));
    };



    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.codigo}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_servicio}
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

    const fechaBodyTemplate = (rowData) => {
        return formatDate(rowData.fecha_creacion);
    };

    const estadosColor = (estadoColor) => {
        if (estadoColor === 'Pendiente') {
            return 'lowstock';
        }
        if (estadoColor === 'Habilitado') {
            return 'instock';
        }
        if (estadoColor === 'Deshabilitado') {
            return 'outofstock';
        }
        return estadoColor;
    }

    const estadoBodyTemplate = (rowData) => {
        const estadoColor = estadosColor(rowData.estado_servicio);
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`product-badge status-${estadoColor}`}>{rowData.estado_servicio}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="info" rounded className="mr-2" onClick={() => editService(rowData)} />
                <Button icon="pi pi-check" severity="success" rounded className="mr-2" onClick={() => confirmHabilitarService(rowData)} />
                <Button icon="pi pi-times" severity="danger" rounded onClick={() => confirmDeleteService(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Servicios</h5>
            <Button visible={false} label="Dar de baja" icon="pi pi-times" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServices || !selectedServices.length} />
            <Button visible={false} label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );



    const serviceUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const habilitarServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideHabilitarServiceDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={habilitarServicioID} />
        </>
    );
    const deleteServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServiceDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarServicio} />
        </>
    );
    const deleteServicesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServicesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarServicios} />
        </>
    );

    //Informes
    function exportToPDF() {
        if (servicios.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de servicios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Título
            const title = 'Informe de Servicios';
            doc.setFontSize(18);
            doc.text(title, 10, 10);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los servicios disponibles en nuestra aplicación. Estos servicios son utilizados por nuestros clientes para satisfacer sus necesidades en diferentes áreas. El informe incluye información relevante sobre cada servicio, como su nombre, descripción, precio, categoría y fecha de creación. Esperamos que este informe sea útil para comprender mejor nuestra oferta de servicios.';

            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 20);

            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

            const tableColumns = [
                { header: 'Codigo', dataKey: 'codigo' },
                { header: 'Nombre', dataKey: 'nombre_servicio' },
                { header: 'Categoria', dataKey: 'nombre_categoria' },
                { header: 'Estado', dataKey: 'estado_servicio' },
                { header: 'Fecha creacion', dataKey: 'fecha_creacion' },
            ];

            const tableData = servicios.map(servicio => ({
                codigo: servicio.codigo,
                nombre_servicio: servicio.nombre_servicio,
                nombre_categoria: servicio.nombre_categoria,
                estado_servicio: servicio.estado_servicio,
                fecha_creacion: formatDate(servicio.fecha_creacion)
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_servicios.pdf');
        }
    }


    function exportToExcel() {
        if (servicios.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de servicios está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de servicios no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();

            const tableColumns = [
                { header: 'Codigo', dataKey: 'codigo' },
                { header: 'Nombre', dataKey: 'nombre_servicio' },
                { header: 'Categoria', dataKey: 'nombre_categoria' },
                { header: 'Estado', dataKey: 'estado_servicio' },
                { header: 'Fecha creacion', dataKey: 'fecha_creacion' },
            ];

            const tableData = servicios.map(servicio => ({
                codigo: servicio.codigo,
                nombre_servicio: servicio.nombre_servicio,
                nombre_categoria: servicio.nombre_categoria,
                estado_servicio: servicio.estado_servicio,
                fecha_creacion: formatDate(servicio.fecha_creacion)
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
            excelLink.download = 'tabla_servicios.xlsx';
            excelLink.click();
        }
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar> */}

                    <DataTable
                        ref={dt}
                        value={servicios}
                        selection={selectedServices}
                        onSelectionChange={(e) => setSelectedServices(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} servicios"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron servicios."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="codigo" header="Codigo" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre_servicio" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre_categoria" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="fecha_creacion" header="Fecha creacion" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="inventoryStatus" header="Estado" body={estadoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={serviceUpdateDialog} style={{ width: '450px' }} header="Actualizar Servicio" modal className="p-fluid" footer={serviceUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre_servicio">Nombre del servicio</label>
                            <InputText id="nombre_servicio" name="nombre_servicio" value={service.nombre_servicio} onChange={(e) => setService({ ...service, nombre_servicio: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion_servicio">Descripcion</label>
                            <Editor id="descripcion_servicio" name="descripcion_servicio" value={descripcion_servicio} onTextChange={(e) => setDescripcion_servicio(e.htmlValue)} headerTemplate={headerEditor} style={{ height: '200px' }} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Categoria</label>
                            <div className="formgrid grid">
                                {categorias.map((categoria) => (
                                    <div className="field-radiobutton col-6" key={categoria.id}>
                                        <RadioButton
                                            inputId={`category${categoria.id}`}
                                            name="categoria"
                                            value={categoria.id}
                                            onChange={() => onCategoryChangeUpdate(categoria.id)}
                                            checked={service.id_categoria === categoria.id}


                                        />
                                        <label htmlFor={`category${categoria.id}`}>{categoria.nombre_categoria}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label>Imagen servicio</label>
                            <div className="flex justify-content-center">
                                <Image id="ruta_imagen" name="ruta_imagen" src={imageURL || service.ruta_imagen} alt="galleria" width={400} preview />
                            </div>
                            <div className="mt-2 flex justify-content-end">
                                <FileUpload
                                    ref={fileUploadRef}
                                    mode="basic"
                                    chooseLabel="Actualizar imagen"
                                    customUpload
                                    auto
                                    uploadHandler={handleFileUpload}
                                />
                            </div>

                        </div>

                    </Dialog>

                    <Dialog visible={habilitarServiceDialog} style={{ width: '450px' }} header="Confirmar" modal footer={habilitarServiceDialogFooter} onHide={hideHabilitarServiceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && (
                                <span>
                                    Desea habilitar el siguiente servicio: <b>{service.nombre_servicio}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServiceDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteServiceDialogFooter} onHide={hideDeleteServiceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && (
                                <span>
                                    Esta seguro de dar de baja el siguiente servicio: <b>{service.nombre_servicio}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteServicesDialogFooter} onHide={hideDeleteServicesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && <span>Esta seguro de dar de baja los siguientes servicios seleccionados?</span>}
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

export default Servicios;
