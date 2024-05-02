import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { listarCategorias, registrarCategoria } from '../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export const NuevoServicio = () => {

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

    let emptyCategory = {
        nombre_categoria: '',
        descripcion_categoria: ''
    };


    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(emptyCategory);
    const [loading2, setLoading2] = useState(true);
    const [selectedImageCategory, setSelectedImageCategory] = useState(null);
    const [text, setText] = useState('');

    const cargarCategorias = async () => {
        try {
            const categorias = await listarCategorias();
            setCategorias(categorias);
        } catch (error) {
            console.log(error);
        }
    };

    async function registrarNuevaCategoria() {
        if (categoria.nombre_categoria.trim() !== "" &&
            text.trim() !== "" &&
            selectedImageCategory) {
            try {
                const response = await registrarCategoria(categoria.nombre_categoria, text, selectedImageCategory);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Categoria creada', life: 3000 });
                setCategoria(emptyCategory);
                fileUploadRef.current.clear();
                setText('');
                cargarCategorias();
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }

    }

    //Cargar categorias
    useEffect(() => {
        setLoading2(true);
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
                console.log(categorias);
                setLoading2(false);
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

    const header = renderHeader();

    const handleFileUploadCategory = (event) => {
        const file = event.files[0];
        setSelectedImageCategory(file);
        console.log(file);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Imagen de categoria confirmada', life: 3000 })
    };


    const handleSubmitCategory = async () => {
        console.log(categoria);
        registrarNuevaCategoria();

    };


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria(prevService => ({
            ...prevService,
            [name]: value
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

                    <h5>Nueva categoria</h5>

                    <div className="field">
                        <label htmlFor="nombreCategoria">Nombre de la categoria</label>
                        <InputText id="nombre_categoria" name="nombre_categoria" value={categoria.nombre_categoria} onChange={onInputChange} />


                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <Editor id='descripcion_categoria' name='descripcion_categoria' value={text} onTextChange={(e) => setText(e.htmlValue)} headerTemplate={header} style={{ height: '200px' }} />
                    </div>

                    <div className="field">
                        <label htmlFor="imagen">Imagen categoria</label>
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
                            uploadHandler={handleFileUploadCategory}
                        />

                    </div>
                    <div className="field">
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-orange-500"
                                style={{ width: 'auto' }}
                                onClick={handleSubmitCategory}
                                disabled={!selectedImageCategory || !setCategoria}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setCategoria(emptyCategory);
                                    setSelectedImageCategory(null);
                                }}
                                label="Limpiar"
                            />
                        </div>

                    </div>

                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Categorias</h5>
                    <DataTable value={categorias} scrollable scrollHeight="100%" loading={loading2} className="mt-3">
                        <Column field="codigo" header="Codigo" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="nombre_categoria" header="Nombre" style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold"></Column>
                        <Column field="fecha_creacion" header="Fecha creacion" style={{ flexGrow: 1, flexBasis: '200px' }} body={dateBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>
    );
};

export default NuevoServicio;
