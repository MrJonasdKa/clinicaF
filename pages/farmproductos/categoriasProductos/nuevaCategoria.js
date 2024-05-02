import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { listarCategorias, registrarCategoria } from '../../../services/apiProductos';

export const NuevaCategoria = () => {
    let emptyCategory = {
        nombre: '',
        descripcion: ''
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(emptyCategory);

    const [submitted, setSubmitted] = useState(false);

    const cargarCategorias = async () => {
        try {
            const catego = await listarCategorias();
            setCategorias(catego);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        async function listarcategory() {
            try {
                const category = await listarCategorias();
                console.log(category);
                setCategorias(category);
            } catch (error) {
                console.log(error);
            }
        }
        listarcategory();
    }, []);

    async function registrarCategorias() {
        if (categoria.nombre.trim() !== "" &&
            categoria.descripcion.trim() !== "") {
            try {
                const response = await registrarCategoria(categoria.nombre, categoria.descripcion);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Categoria agregada', life: 3000 });
                setCategoria(emptyCategory);
                await cargarCategorias();
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    const handleSubmit = async () => {
        console.log(categoria);
        registrarCategorias();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria(prevCategorias => ({
            ...prevCategorias,
            [name]: value
        }));
    };

    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-6'>
                <div className='card p-fluid'>
                    <h3>Nueva Categoria</h3>
                    <div className='field'>
                        <label htmlFor='nombre_categoria'>Nombre de la Categoria</label>
                        <InputText id='nombre' name='nombre' value={categoria.nombre} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !categoria.nombre })} />
                        {submitted && !categoria.nombre && <small className='p-invalid'>Nueva Categoria, requerida.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <InputTextarea id="descripcion" name="descripcion" onChange={onInputChange} value={categoria.descripcion} required rows={3} cols={20} />
                    </div>

                    <div className="field">
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-green-400"
                                style={{ width: 'auto' }}
                                onClick={handleSubmit}
                                disabled={!setCategoria}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setCategoria(emptyCategory);
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
                    <DataTable value={categorias} scrollable scrollHeight="650px" className="mt-3">
                        <Column field="id_categoria" header="ID" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="nombre_categoria" header="Tipo de categoria " style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold"></Column>
                        <Column field="descripcion" header="Descripcion" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default NuevaCategoria;