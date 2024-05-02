import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { listarCategorias, mostrarServicios, registrar, actualizar, eliminar, eliminarVarios, listarServicios } from '../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export const NuevoServicio = () => {

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

    let emptyService = {
        nombre_servicio: ''
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [servicio, setServicio] = useState(emptyService);
    const [loading2, setLoading2] = useState(true);
    const [listboxValue, setListboxValue] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [text, setText] = useState('');

    //Registrar Servicio
    async function registrarServicio() {
        if (servicio.nombre_servicio.trim() !== "" &&
            text.trim() !== "" &&
            listboxValue.id != null &&
            selectedImage) {
            try {
                const response = await registrar(servicio.nombre_servicio, text, listboxValue.id, selectedImage);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio creado', life: 3000 });
                setServicio(emptyService);
                fileUploadRef.current.clear();
                setText('');
                setListboxValue(null);
                cargarServicios();
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }

    }

    const cargarServicios = async () => {
        try {
            const servicios = await mostrarServicios();
            setServicios(servicios);
        } catch (error) {
            console.log(error);
        }
    };

    //Cargar categorias
    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    useEffect(() => {
        setLoading2(true);
        async function listarServicios() {
            try {
                const servicios = await mostrarServicios();
                console.log(servicios);
                setServicios(servicios);
                setLoading2(false);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
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

    const header = renderHeader();

    const handleFileUpload = (event) => {
        const file = event.files[0];
        setSelectedImage(file);
        console.log(file);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Imagen Confirmada', life: 3000 })
    };

    const handleSubmit = async () => {
        registrarServicio();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setServicio(prevService => ({
            ...prevService,
            [name]: value
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setServicio(prevService => ({
            ...prevService,
            [name]: parseFloat(value)
        }));
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

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.fecha_creacion);
    };



    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-6">
                <div className="card p-fluid">

                    <h5>Nuevo Servicio</h5>
                    <div className="field">
                        <label htmlFor="nombreServicio">Nombre del servicio</label>
                        <InputText id="nombre_servicio" name="nombre_servicio" placeholder='Escriba el nombre del servicio' value={servicio.nombre_servicio} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !servicio.nombre_servicio })} />
                        {submitted && !servicio.nombre_servicio && <small className="p-invalid">El nombre es requerido.</small>}

                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <Editor id='descripcion_servicio' name='descripcion_servicio' value={text} onTextChange={(e) => setText(e.htmlValue)} headerTemplate={header} style={{ height: '200px' }} />
                    </div>

                    <div className="field">
                        <label htmlFor="categoria">Categoria</label>
                        <ListBox value={listboxValue} onChange={(e) => setListboxValue(e.value)} filterPlaceholder='Buscar categoria' options={categorias} optionLabel="nombre_categoria" filter />
                    </div>
                    <div className="field">
                        <label htmlFor="imagen">Imagen</label>
                        <FileUpload
                            ref={fileUploadRef}
                            name="demo"
                            chooseLabel="Seleccionar"
                            uploadLabel="Confirmar"
                            cancelLabel='Cancelar'
                            multiple={false}
                            className="custom-fileupload"
                            emptyTemplate="Arrastre y suelte una imagen aquí o suba una imagen."
                            customUpload
                            uploadHandler={handleFileUpload}
                        />
                    </div>
                    <div className="field">
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-orange-500"
                                style={{ width: 'auto' }}
                                onClick={handleSubmit}
                                disabled={!selectedImage || !setServicio}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setServicio(emptyService);
                                    setListboxValue(null);
                                    setSelectedImage(null);
                                }}
                                label="Limpiar"
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Servicios</h5>
                    <DataTable value={servicios} scrollable scrollHeight="100%" loading={loading2} className="mt-3">
                        <Column field="codigo" header="Codigo" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                        <Column field="nombre_servicio" header="Nombre" style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold"></Column>
                        <Column field="nombre_categoria" header="Categoria" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                        <Column field="fecha_creacion" header="Fecha creacion" style={{ flexGrow: 1, flexBasis: '100px' }} body={dateBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default NuevoServicio;
