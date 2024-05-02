import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { actualizarFotoPerfil, getUsuario } from '../services/apiUsuarios';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Avatar } from 'primereact/avatar';
import { LayoutContext } from './context/layoutcontext';
import { removeSession } from '../utils/session';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [nombre, setNombre] = useState(null);
    const [usuarioPerfil, setUsuarioPerfil] = useState(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    useEffect(() => {
        const fetchUsuario = async () => {
            const userDataString = localStorage.getItem('userData');

            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const usuario = await getUsuario(userData.id);
                setUsuarioPerfil(usuario);
                console.log(usuario);

                // Comprobamos si usuarioPerfil existe y tiene las propiedades nombres y apellidos
                if (usuario[0] && usuario[0].nombres && usuario[0].apellidos) {
                    setNombre(`${usuario[0].nombres} ${usuario[0].apellidos}`);
                }
            }
        }
        fetchUsuario();
    }, []);


    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-simple.png`} width="40px" height={'40px'} widt={'true'} alt="logo" />
                <span className=' font-semibold text-green-400 text-3xl'>CLINICA SALUD INTEGRAL</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className='mt-2'>
                    <h5>Bienvenido, {nombre}</h5>
                </div>
                <Link href="/usuarios/editarPerfil">
                    <button type="button" className="p-link layout-topbar-button">
                        <Avatar
                            image={
                                usuarioPerfil && usuarioPerfil[0].imagen_perfil
                                    ? usuarioPerfil[0].imagen_perfil
                                    : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png"
                            }
                            shape='circle'
                            size="large"
                        />
                    </button>
                </Link>


                <Button label="Cerrar Sesion" severity="danger" className='ml-3' onClick={() => {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userID');
                    removeSession();
                    Router.push('/auth/login');
                }} />
            </div>
        </div>
    );
});

export default AppTopbar;
