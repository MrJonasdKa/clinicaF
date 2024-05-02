import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarProveedores,registrar} from '../../services/apiProveedores';


export const NuevoProveedor = () => {
    let emptyService = {
        nombre_proveedor: '',
        representante: '',
        telefono: '',
        descripcion: ''
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [proveedor, setProveedor] = useState([]);
    const [proveedores, setProveedores] = useState(emptyService);
    const [telefono, setTelefono] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const cargarProveedores = async () => {
        try {
            const provee = await listarProveedores();
            setProveedor(provee);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(()=>{
        async function listarproveedo() {
            try {
                const prov = await listarProveedores();
                console.log(prov);
                setProveedor(prov);
            } catch (error) {
                console.log(error);
            }
        }
        listarproveedo();
    },[]);


    //registrar nuevo proveedor
    async function registrarProveedor() {
        if (proveedores.nombre_proveedor.trim() !== "" &&
            proveedores.representante.trim() !== "" && 
            telefono !== "" && 
            proveedores.descripcion !== "") {
            try {
                const response = await registrar(proveedores.nombre_proveedor,proveedores.representante,telefono,proveedores.descripcion);
                console.log(response);
                toast.current.show({severity: 'success', summary: 'Exitoso', detail: 'Proveedor agregado', life: 3000});
                setProveedores(emptyService);
                setTelefono("");
                await cargarProveedores();
                fileUploadRef.current.clear();
            } catch (error) {
                console.log(error);
            }
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    const handleSubmit = async () => {
        console.log(proveedores);
        registrarProveedor();
    };

    const onInputChange = (e) => {
        const {name,value} = e.target;
        setProveedores(prevProveedores => ({
            ...prevProveedores,
            [name]:value
        }));
    };

    const handleTelefonoChange = (event) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
        const limitedValue = numericValue.slice(0, 8); // Limita a 10 caracteres

        setTelefono(limitedValue);
    };
    
    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-6'>
                <div className='card p-fluid'>
                    <h3>Nuevo Proveedor</h3>
                    <div className='field'>
                        <label htmlFor='nombreProveedor'>Nombre del Proveedor</label>
                        <InputText id='nombre_proveedor' name='nombre_proveedor' value={proveedores.nombre_proveedor} onChange={onInputChange} required autoFocus className={classNames({'p-invalid' : submitted && !proveedores.nombre_proveedor})}/>
                        {submitted && !proveedores.nombre_proveedor && <small className='p-invalid'>Nombre del Proveedor, requerido.</small>}
                    </div>

                    <div className='field'>
                        <label htmlFor='Representante'>Representante del Proveedor</label>
                        <InputText id='representante' name='representante' value={proveedores.representante} onChange={onInputChange} required autoFocus className={classNames({'p-invalid' : submitted && !proveedores.representante})}/>
                        {submitted && !proveedores.representante && <small className='p-invalid'>Nombre del Representante del Proveedor, requerido.</small>}
                    </div>

                    <div className='field'>
                        <label htmlFor='telefono'>Telefono de la Proveedora</label>
                        <InputText
                            id='telefono'
                            name='telefono'
                            value={telefono}
                            onChange={handleTelefonoChange}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !telefono })}
                        />
                        {submitted && !telefono && (
                        <small className='p-invalid'>Numero Telefonico, requerido.</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <InputTextarea id="descripcion" name="descripcion" onChange={onInputChange} value={proveedores.descripcion} required rows={3} cols={20} />
                    </div>

                    <div className="field">
                        
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-green-400"
                                style={{ width: 'auto' }}
                                onClick={handleSubmit}
                                disabled={!setProveedores}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setProveedores(emptyService);
                                    setTelefono("");
                                }}
                                label="Limpiar"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Proveedores Disponibles</h5>
                    <DataTable value={proveedor} scrollable scrollHeight="650px" className="mt-3">
                        <Column field="id_proveedor" header="ID" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="nombre_proveedor" header="Nombre Proveedor" style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold"></Column>
                        <Column field="representante" header="Representante" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                        <Column field="telefono" header="Telefono" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                        <Column field="descripcion_proveedor" header="Descripcion" style={{ flexGrow: 1, flexBasis: '160px' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
export default NuevoProveedor;
