import React, { useContext, useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { decryptData } from '../services/crypto';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [model, setModel] = useState([]);

    useEffect(() => {
        const encryptedUserRole = localStorage.getItem('userRole');
        if (!encryptedUserRole) {
            return;
        }
        const userRole = decryptData(encryptedUserRole);

        const roles = {
            administrador: [
                {
                    label: 'INICIO',
                    items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'Pacientes',
                    items: [
                        { label: 'Registro de paciente', icon: 'pi pi-fw pi-user-plus', to: '/pacientes/nuevoPaciente' },
                        { label: 'Actualizar pacientes', icon: 'pi pi-fw pi-pencil', to: '/pacientes/actualizarPaciente' },
                        { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open', to: '/pacientes/historiaClinica' }
                    ]
                },
                {
                    label: 'Farmacia',
                    items: [
                        {
                            label: 'Registro de Productos',
                            icon: 'pi pi-fw pi-heart-fill',
                            items: [
                                { label: 'Nueva categoria', icon: 'pi pi-fw pi-plus', to: '/farmproductos/categoriasProductos/nuevaCategoria' },
                                { label: 'Nuevo producto', icon: 'pi pi-fw pi-plus', to: '/farmproductos/nuevoProducto' },
                                { label: 'Actualizar producto', icon: 'pi pi-fw pi-pencil', to: '/farmproductos' },
                                { label: 'Listar productos', icon: 'pi pi-fw pi-list', to: '/farmproductos/listarProductos' },
                                
                            ]
                        },
                        {
                            label: 'Registro de Proveedores',
                            icon: 'pi pi-fw pi-id-card',
                            items: [
                                { label: 'Nuevo proveedor', icon: 'pi pi-fw pi-plus', to: '/farmproveedores/nuevoProveedor' },
                                { label: 'Actualizar proveedor', icon: 'pi pi-fw pi-pencil', to: '/farmproveedores' },
                                { label: 'Listar proveedores', icon: 'pi pi-fw pi-list', to: '/farmproveedores/listarProveedores' }
                            ]
                        },
                        {
                            label: 'Registro de Reabastecimiento',
                            icon: 'pi pi-fw pi-upload',
                            items: [
                                { label: 'Nuevo reabastecimiento', icon: 'pi pi-fw pi-plus', to: '/farmreabastecimiento/nuevoReabaste' },
                                { label: 'Actualizar reabastecimiento', icon: 'pi pi-fw pi-pencil', to: '/farmreabastecimiento' },
                            ]
                        },
                        {
                            label: 'Registro de Ventas',
                            icon: 'pi pi-fw pi-shopping-cart',
                            items: [
                                { label: 'Nuevo venta', icon: 'pi pi-fw pi-plus', to: '/farmventas/nuevaVenta' },
                                { label: 'Actualizar venta', icon: 'pi pi-fw pi-pencil', to: '/farmventas' },
                            ]
                        }
                    ]
                },

                /*{
                    label: 'Servicios',
                    items: [
                        {
                            label: 'Gestión de categorias para servicios',
                            icon: 'pi pi-fw pi-table',
                            items: [
                                { label: 'Nueva categoria', icon: 'pi pi-fw pi-plus', to: '/servicios/categoriaServicios' },
                                { label: 'Actualizar categoria', icon: 'pi pi-fw pi-pencil', to: '/servicios/actualizarCategoria' },
                            ]
                        },
                        {
                            label: 'Gestión de servicios',
                            icon: 'pi pi-fw pi-briefcase',
                            items: [
                                { label: 'Nuevo servicio', icon: 'pi pi-fw pi-plus', to: '/servicios/nuevoServicio' },
                                { label: 'Actualizar servicio', icon: 'pi pi-fw pi-pencil', to: '/servicios' },

                            ]
                        },
                        { label: 'Ver servicios', icon: 'pi pi-fw pi-list', to: '/servicios/listarCategorias' },
                        { label: 'Registro de fichas', icon: 'pi pi-fw pi-ticket', to: '/servicios/fichas/nuevaCita' },
                        { label: 'Listado de fichas', icon: 'pi pi-fw pi-search', to: '/servicios/fichas/listarFichas' },
                    ]

                },
                {
                    label: 'Administración',
                    items: [
                        {
                            label: 'Gestión de usuarios',
                            icon: 'pi pi-fw pi-user-plus',
                            items: [
                                { label: 'Agregar un usuario', icon: 'pi pi-fw pi-plus', to: '/usuarios/nuevoUsuario' },
                                { label: 'Actualizar usuario', icon: 'pi pi-fw pi-pencil', to: '/usuarios/actualizarUsuario' },
                                { label: 'Listar usuarios', icon: 'pi pi-fw pi-list', to: '/usuarios/listarUsuario' },
                                { label: 'Habilitar/Deshabilitar', icon: 'pi pi-fw pi-check', to: '/usuarios/habilitarCuentas' },
                            ]
                        },
                        { label: 'Generar informes', icon: 'pi pi-fw pi-file-import' , to: '/informes/indexInformes'},
                        { label: 'Gestion de Medicos', icon: 'pi pi-fw pi-chart-bar', to: '/usuarios/registrarMedico' },
                        { label: 'Analitica de datos', icon: 'pi pi-fw pi-chart-bar', to: '/estadisticas/dashboard' },
                    ]
                }*/],
            medico: [
                {
                    label: 'Home',
                    items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'Pacientes',
                    items: [
                        { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open', to: '/pacientes/historiaClinica'},
                        { label: 'Consulta medica', icon: 'pi pi-fw pi-heart', to: '/usuarios/consultaMedica' },
                    ]
                },
                {
                    label: 'Servicios',
                    items: [
                        { label: 'Ver servicios', icon: 'pi pi-fw pi-list', to: '/servicios/listarCategorias' },
                    ]
                },
                {
                    label: 'Farmacia',
                    items: [
                        { label: 'Ver medicamentos disponibles', icon: 'pi pi-fw pi-list', to: '/farmproductos/listarProductos' },
                    ]
                }
            ],
            recepcionista: [
                {
                    label: 'Home',
                    items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'Pacientes',
                    items: [
                        { label: 'Registro de paciente', icon: 'pi pi-fw pi-user-plus', to: '/pacientes/nuevoPaciente' },
                        { label: 'Actualizar pacientes', icon: 'pi pi-fw pi-pencil', to: '/pacientes/actualizarPaciente' },
                        { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open', to: '/pacientes/historiaClinica' },
                    ]
                },
                {
                    label: 'Servicios',
                    items: [
                        { label: 'Ver servicios', icon: 'pi pi-fw pi-list', to: '/servicios/listarCategorias' },
                        { label: 'Registro de fichas', icon: 'pi pi-fw pi-calendar', to: '/servicios/fichas/nuevaCita' },
                        { label: 'Listado de fichas', icon: 'pi pi-fw pi-search', to: '/servicios/fichas/listarFichas' },
                    ]

                },
                {
                    label: 'Farmacia',
                    items: [
                        { label: 'Ver medicamentos disponibles', icon: 'pi pi-fw pi-list', to: '/farmproductos/listarProductos' },
                    ]

                }
            ],
            farmaceutico: [
                {
                    label: 'Home',
                    items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'Pacientes',
                    items: [
                        { label: 'Ver pacientes', icon: 'pi pi-fw pi-folder-open' },
                    ]
                },
                {
                    label: 'Farmacia',
                    items: [
                        {
                            label: 'Gestion de Productos',
                            icon: 'pi pi-fw pi-book',
                            items: [
                                { label: 'Nuevo producto', icon: 'pi pi-fw pi-plus', to: '/farmproductos/nuevoProducto' },
                                { label: 'Actualizar producto', icon: 'pi pi-fw pi-pencil', to: '/farmproductos' },
                                { label: 'Listar productos', icon: 'pi pi-fw pi-list', to: '/farmproductos/listarProductos' }
                            ]
                        },
                        {
                            label: 'Gestion de Proveedores',
                            icon: 'pi pi-fw pi-book',
                            items: [
                                { label: 'Nuevo proveedor', icon: 'pi pi-fw pi-plus', to: '/farmproveedores/nuevoProveedor' },
                                { label: 'Actualizar proveedor', icon: 'pi pi-fw pi-pencil', to: '/farmproveedores' },
                                { label: 'Listar proveedores', icon: 'pi pi-fw pi-list', to: '/farmproveedores/listarProveedores' }
                            ]
                        },
                        {
                            label: 'Gestion de Reabastecimiento',
                            icon: 'pi pi-fw pi-book',
                            items: [
                                { label: 'Nuevo reabastecimiento', icon: 'pi pi-fw pi-plus', to: '/farmreabastecimiento/nuevoReabaste' },
                                { label: 'Actualizar reabastecimiento', icon: 'pi pi-fw pi-pencil', to: '/farmreabastecimiento' },
                            ]
                        },
                        {
                            label: 'Gestion de Ventas',
                            icon: 'pi pi-fw pi-book',
                            items: [
                                { label: 'Nuevo venta', icon: 'pi pi-fw pi-plus', to: '/farmventas/nuevaVenta' },
                                { label: 'Actualizar venta', icon: 'pi pi-fw pi-pencil', to: '/farmventas' },
                            ]
                        }
                    ]
                },
            ]
        };
        setModel(roles[userRole] || []);
    }, []);

    if (!Array.isArray(model)) {
        return null;
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" ></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
