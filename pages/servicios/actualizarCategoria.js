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
import { listarCategorias, actualizarCategoria, eliminarCategoria, eliminarVariasCategorias} from '../../services/apiService';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const ActualizarCategoria = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador'];

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

    let emptyCategory = {
        nombre_categoria: '',
        descripcion_categoria: '',
        ruta_imagen: ''
    };

    const [categorias, setCategorias] = useState([]);
    const [categoryUpdateDialog, setCategoryUpdateDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [categoria, setCategoria] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    const cargarCategorias = async () => {
        try {
            const categorias = await listarCategorias();
            setCategorias(categorias);
        } catch (error) {
            console.log(error);
        }
    };

    async function actualizar() {
        try {
            const response = await actualizarCategoria(categoria.id, categoria.nombre_categoria, categoria.descripcion_categoria);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Categoria actualizada', life: 3000 });
            await cargarCategorias();
            setCategoryUpdateDialog(false);
            setCategoria(emptyCategory);
        } catch (error) {
            console.log(error);
        }
    }

    function onSubmitActualizar() {
        actualizar();
    }


    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id);
        return selectedIds;
    };

    async function eliminar() {
        try {

            const response = await eliminarCategoria(categoria.id);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio eliminado', life: 3000 });
            await cargarCategorias();
            setDeleteCategoryDialog(false);
            setCategoria(emptyCategory);
        }
        catch (error) {
            throw error;
        }
    }

    async function eliminarCategorias() {
        try {
            if (selectedCategories) {
                const selectedIds = collectSelectedIds(selectedCategories);
                console.log(selectedIds);
                const response = await eliminarVariasCategorias(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicios eliminados', life: 3000 });
                await cargarCategorias();
                setDeleteCategoriesDialog(false);
                setSelectedCategories(null);
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

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
    
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
    
        return `${year}-${month}-${day}`;
    }

    const headerEditor = renderHeader();

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryUpdateDialog(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };


    const editService = (categoria) => {
        setCategoria({ ...categoria });
        setCategoryUpdateDialog(true);
    };

    const confirmDeleteCategory = (categoria) => {
        setCategoria(categoria);
        setDeleteCategoryDialog(true);
    };


    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria(prevCategory => ({
            ...prevCategory,
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
                {rowData.nombre_categoria}
            </>
        );
    };


    const descripcionCategoriaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                <span dangerouslySetInnerHTML={{__html: rowData.descripcion_categoria}} />
            </>
        );
    };
    

    const fechaBodyTemplate = (rowData) => {
        return formatDate(rowData.fecha_creacion);
    };
    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="info" rounded className="mr-2" onClick={() => editService(rowData)} />
                <Button icon="pi pi-times" severity="danger" rounded onClick={() => confirmDeleteCategory(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Servicios</h5>
            <Button visible={false} label="Dar de baja" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    

    const categoryUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deleteServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoryDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminar} />
        </>
    );
    const deleteCategoriesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoriesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarCategorias} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar> */}

                    <DataTable
                        ref={dt}
                        value={categorias}
                        selection={selectedCategories}
                        onSelectionChange={(e) => setSelectedCategories(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} categorias"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron categorias."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="codigo" header="Codigo" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre_categoria" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descripcion_categoria" header="Descripcion" sortable body={descripcionCategoriaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="fecha_creacion" header="Fecha creacion" body={fechaBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={categoryUpdateDialog} style={{ width: '450px' }} header="Actualizar Servicio" modal className="p-fluid" footer={categoryUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre_categoria">Nombre de la categoria</label>
                            <InputText id="nombre_categoria" name="nombre_categoria" value={categoria.nombre_categoria} onChange={onInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descripcion</label>
                            <Editor id="descripcion_categoria" name="descripcion_categoria" value={categoria.descripcion_categoria} onTextChange={(e) => setCategoria({...categoria, descripcion_categoria: e.htmlValue})} headerTemplate={headerEditor} style={{ height: '200px' }} />
                        </div>

                        <div className="card">
                            <h5>Imagen categoria</h5>
                                <Image id="ruta_imagen" name="ruta_imagen" src={`${categoria.ruta_imagen}`} alt="galleria" width={350} preview />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteServiceDialogFooter} onHide={hideDeleteCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {categoria && (
                                <span>
                                    Esta seguro de dar de baja la siguiente categoria: <b>{categoria.nombre_categoria}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCategoriesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {categoria && <span>Esta seguro de dar de baja las siguientes categorias seleccionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ActualizarCategoria;
