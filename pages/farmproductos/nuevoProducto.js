import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarCategorias,listarProveedores,registrar} from '../../services/apiProductos';


export const NuevoProducto = () => {
    let emptyService = {
        nombre_medicamento: '',
        precio: 0,
        cantidad: 0,
        fechacaducidad: null
    };

    let today = new Date();
    
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);

    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState(null);
    const [proveedoresDropdown, setProveedoresDropdown] = useState([]);
    
    const [producto, setProducto] = useState(emptyService);
    const [submitted, setSubmitted] = useState(false);

    //Registrar Nuevo Producto
    async function registrarProducto() {
        if (producto.nombre_medicamento.trim() !== "" &&
            proveedor &&
            categoria  &&
            producto.precio > 0 &&
            producto.cantidad > 0 &&
            producto.fechacaducidad ) { 
            try {
                const response = await registrar(producto.nombre_medicamento,proveedor,categoria,producto.precio, producto.cantidad, formatDate(producto.fechacaducidad));
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto agregado', life: 3000 });
                setProducto(emptyService);
                setCategoria(null); 
                setProveedor(null); 
                fileUploadRef.current.clear();
                setText('');
                
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    //cargar todas las categorias de proveedores 
    useEffect(()=>{
        async function obtenercatergoriasproveedores() {
            try {
                const categoriasp = await listarProveedores();
                console.log(categoriasp);
                setProveedores(categoriasp);

                const proveedordropdown = categoriasp.map(proveedor => ({
                    label: proveedor.nombre_proveedor,
                    value: proveedor.id_proveedor
                }));
                console.log(proveedordropdown);
                setProveedoresDropdown(proveedordropdown);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenercatergoriasproveedores();
    }, []);

    //cargar todas las categorias de productos
    useEffect(()=>{
        async function obtenercatergoriasproductos() {
            try {
                const categoriasc = await listarCategorias();
                console.log(categoriasc);
                setCategorias(categoriasc);

                const categoriasdropdown = categoriasc.map(categoria=> ({
                    label: categoria.nombre_categoria,
                    value: categoria.id_categoria
                }));
                setCategoriasDropdown(categoriasdropdown);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenercatergoriasproductos();
    }, []);

    const handleSubmit = async () => {
        console.log(producto);
        registrarProducto();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProduct => ({
            ...prevProduct,
            [name]: parseFloat(value)
        }));
    };
    
    const onDateChange = (e) => {
        setProducto(prevProduct => ({
            ...prevProduct,
            fechacaducidad: e.value
        }));
    };
    const getDefaultDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-12'>
                <div className='card p-fluid'>
                    <h3>Nuevo Producto</h3>
                    <div className='field'>
                        <label htmlFor='nombreMedicamento'>Nombre del Producto</label>
                        <InputText id="nombre_medicamento" name="nombre_medicamento" value={producto.nombre_medicamento} onChange={onInputChange} placeholder='Escriba el nombre del producto' required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre_medicamento })} />
                        {submitted && !producto.nombre_medicamento && <small className="p-invalid">El nombre es requerido.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="proveedores">Proveedores</label>
                        <Dropdown id='proveedor_id' value={proveedor} onChange={(e) => setProveedor(e.value)} options={proveedoresDropdown} placeholder='Seleccione un Proveedor' filterPlaceholder='Buscar Proveedores' filter/>
                    </div>
                    <div className="field">
                        <label htmlFor="categoria">Categoria Productos</label>
                        <Dropdown id='categoria_id' value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder='Seleccione Categoria del Producto' filterPlaceholder='Buscar Catergoria' filter/>
                    </div>

                    <div className="field">
                        <label htmlFor="precio">Precio Unidad</label>
                        <InputNumber id="precio" value={producto.precio} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad">Cantidad</label>
                        <InputNumber id="cantidad" value={producto.cantidad} name="cantidad" onValueChange={onInputNumberChange} />
                    </div>


                    <div className="field">
                        <label htmlFor="fecha">Fecha de Caducidad</label>
                        <Calendar id="fecha_caducidad" name="fechacaducidad" value={producto.fechacaducidad} onChange={onDateChange} dateFormat="yy-mm-dd" placeholder='Seleccione la fecha de caducidad' showIcon minDate={today}/>
                    </div>

                    <div className="field">
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-green-400"
                                style={{ width: 'auto' }}
                                onClick={handleSubmit}
                                disabled={!setProducto}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setProducto(emptyService);
                                    setCategoria(null); 
                                    setProveedor(null); 
                                }}
                                label="Limpiar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevoProducto;