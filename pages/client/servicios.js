import React, { useContext, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import AppConfig from '../../layout/AppConfig';
import { listarCategorias } from '../../services/apiService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';

const ServiciosClientPage = () => {

    const imagen = 'https://www.cies.org.bo/wp-content/uploads/2021/03/fotos-calendario-2021-13.png';

    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        async function mostrarCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);
            }
            catch (error) {
                console.log(error);
            }
        }
        mostrarCategorias();
    }, []);


    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const renderCards = () => {
        return categorias.map((categoria) => (
            <div className="col-12 md:col-6" key={categoria.id}>
                <Card
                    title={categoria.nombre_categoria}
                    style={{ width: '100%' }}
                    className="p-shadow-10"

                    header={renderHeader(categoria.ruta_imagen)}
                >
                    <p className="p-m-0 text-600 text-xl " style={{ lineHeight: '1.5' }}> <span dangerouslySetInnerHTML={{ __html: categoria.descripcion_categoria }} /></p>

                    <Link href={`/servicios/listarServicios/${categoria.id}`}>
                        <div className="flex flex-wrap justify-content-end gap-3 mt-4">
                            <Button icon="pi pi-check" className='bg-green-400' label='Ver servicios' rounded style={{ width: '250px' }}></Button>
                        </div>
                    </Link>
                </Card>
            </div>
        ));
    };

    const renderHeader = (rutaImagen) => {
        return <img alt="Card" src={rutaImagen} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />;
    };


    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/" className="flex align-items-center">
                        <img src={`https://www.cies.org.bo/wp-content/uploads/2023/05/logo-CIES-2022-horizontal-02.png`} alt="Cies Logo" height="60" className="mr-0 lg:mr-2" />
                    </Link>
                    <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                            <Link href="/client/">
                                <a onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Inicio</span>
                                    <Ripple />
                                </a>
                            </Link>

                            </li>
                            <li>
                                <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Servicios</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Sobre Cies</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Contacto</span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <Button label="Iniciar Sesion" rounded className="border-none ml-5 font-light line-height-2 bg-orange-500 text-white"></Button>
                        </div>
                    </div>
                </div>

                <div
                    id="hero"
                    className="flex flex-column pt-8 px-4 lg:px-8 overflow-hidden"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.3), rgba(0, 0, 0, 0.4)),url(${imagen})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        width: '100%',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4 mb-8">
                        <h1 className="text-7xl font-light text-white line-height-2">
                            <span className="font-bold block">Servicios de salud</span>¿Que estas buscando?
                        </h1>
                    </div>
                    <div className="flex justify-content-center md:justify-content-end mb-8" style={{ marginTop: '200px' }}>
                        <img src="/demo/images/assets/ciesBlanco.png" alt="Hero Image" className="w-9 md:w-auto" />
                    </div>
                </div>

                <div className="mt-8 mb-8 text-700">
                    <div className="text-green-600 font-bold text-5xl mb-8 mx-8">Servicios de Salud</div>
                    <div className="text-600 text-2xl mb-8 mx-8">
                        Un equipo multidisciplinario calificado, motivado y comprometido, de más de 350 empleados, trabaja día a día para asegurar una experiencia sorprendente a todas y todos sus usuarios, garantizando una atención de calidad, excelente trato, total privacidad, confidencialidad y seguridad.
                        <br></br>
                        <br></br>
                        En los centros de salud de CIES se ofrecen atenciones de consulta externa en general con énfasis en salud sexual, reproductiva e integral, anticoncepción, detección temprana del cáncer, prevención del VIH, fertilidad, orientación y atención a mujeres en situación de violencia de género, servicios de laboratorio, imagenología y exámenes complementarios, y también servicios de internación y cirugías.
                    </div>
                </div>

                <div className="grid p-fluid">
                    {renderCards()}

                </div>

                <Divider></Divider>

                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2 mb-8" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src={`/layout/images/logo-simple.png`} alt="footer sections" width="50" height="50" className="mr-2" />
                                <span className="font-medium text-3xl text-900">CIES</span>
                            </Link>
                        </div>

                        <div className="col-12 md:col-10 lg:col-7 mb-8" style={{ marginTop: '-1.5rem' }}>
                            <div className="grid text-center md:text-left">
                                <div className="col-12 md:col-6">
                                    <h4 className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Usuarios</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Aprende</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Servicios de salud</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Servicios a instituciones</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Programas sociales</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Sobre CIES</a>
                                </div>

                                <div className="col-12 md:col-6 mt-6 md:mt-0">
                                    <h4 className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Clinicas</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Compras en linea</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Radio CIES</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Trabaja en/con CIES</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Contacto</a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ServiciosClientPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default ServiciosClientPage;
