import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarProveedores, listarProductos, registrar } from '../../services/apiReabastecimiento';

export const NuevoReabastecimiento = () => {
    let emptyRestock = {
        cantidad_reabastecida: 0,
        fecha_reabastecimiento: null,
        costo_total: 0
    };

    const toast = useRef(null);

    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState([]);
    const [productosDropdown, setProductosDropdown] = useState([]);

    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState([]);
    const [proveedoresDropdown, setProveedoresDropdown] = useState([]);

    const [reabastecimiento, setReabastecimiento] = useState(emptyRestock);
    const [submitted, setSubmitted] = useState(false);

    async function registrarReabastecimiento() {
        if (producto &&
            proveedor != null &&
            reabastecimiento.cantidad_reabastecida > 0 &&
            reabastecimiento.fecha_reabastecimiento !== "" &&
            reabastecimiento.costo_total > 0
        ) {
            try {
                const response = await registrar(producto, proveedor, reabastecimiento.cantidad_reabastecida, formatDate(reabastecimiento.fecha_reabastecimiento), reabastecimiento.costo_total);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: '¡Agregado!', life: 3000 });
                setReabastecimiento(emptyRestock);
                setProducto(null);
                setProveedor(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    useEffect(() => {
        async function obtenerproductos() {
            try {
                const produc = await listarProductos();
                console.log(produc)
                setProductos(produc);

                const productosdropdown = produc.map(productos => ({
                    label: productos.nombre_medicamento,
                    value: productos.id_medicamento
                }));
                console.log(productosdropdown);
                setProductosDropdown(productosdropdown);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerproductos();
    }, []);

    useEffect(() => {
        async function obtenerproveedores() {
            try {
                const categorias = await listarProveedores();
                console.log(categorias);
                setProveedores(categorias);

                const proveedordropdown = categorias.map(proveedor => ({
                    label: proveedor.nombre_proveedor,
                    value: proveedor.id_proveedor
                }));
                console.log(proveedordropdown);
                setProveedoresDropdown(proveedordropdown);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerproveedores();
    }, []);

    const handleSubmit = async () => {
        console.log(reabastecimiento);
        registrarReabastecimiento();
    };
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            [name]: value
        }));
    };
    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            [name]: parseFloat(value)
        }));
    };

    const onDateChange = (e) => {
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            fecha_reabastecimiento: e.value
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
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <h3>Nuevo Registro de Reabastecimiento</h3>
                    <div className="field">
                        <label htmlFor="productos">Productos Disponibles</label>
                        <Dropdown id='producto_id' value={producto} onChange={(e) => setProducto(e.value)} options={productosDropdown} placeholder='Seleccione un Producto' filterPlaceholder='Buscar Producto' filter />
                    </div>

                    <div className="field">
                        <label htmlFor="proveedor">Proveedores Disponibles</label>
                        <Dropdown id='proveedor_id' value={proveedor} onChange={(e) => setProveedor(e.value)} options={proveedoresDropdown} placeholder='Seleccione un Proveedor' filterPlaceholder='Buscar Proveedor' filter />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad">Cantidad Pedida</label>
                        <InputNumber id="cantidad_reabastecida" value={reabastecimiento.cantidad_reabastecida} name='cantidad_reabastecida' onValueChange={onInputNumberChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="fecha_pedido">Fecha del Pedido</label>
                        <Calendar id="fecha_pedido" name="fecha_pedido" value={reabastecimiento.fecha_reabastecimiento} onChange={onDateChange} dateFormat="yy-mm-dd" placeholder={getDefaultDate()} showIcon />
                    </div>

                    <div className="field">
                        <label htmlFor="costo_total">Precio Total del Pedido</label>
                        <InputNumber id="costo_total" value={reabastecimiento.costo_total} name='costo_total' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                    </div>

                    <div className="field">
                        <div className="card flex flex-wrap justify-content-end gap-3">
                            <Button
                                label="Registrar"
                                className="p-mt-3 bg-green-400"
                                style={{ width: 'auto' }}
                                onClick={handleSubmit}
                                disabled={!setReabastecimiento}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-outlined p-button-danger p-mt-3"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setReabastecimiento(emptyRestock);
                                    setProducto(null);
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
export default NuevoReabastecimiento;