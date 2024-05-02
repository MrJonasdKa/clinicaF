import React, { useContext, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import AppConfig from '../../layout/AppConfig';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';

const LandingPage = () => {

    const images = [
        { src: 'https://www.cies.org.bo/wp-content/uploads/2021/04/fotos-calendario-2021-10-1.png', alt: 'Image 2' },
        { src: 'https://www.cies.org.bo/wp-content/uploads/2022/01/IMG_6477-scaled.jpg', alt: 'Image 3' },
        { src: 'https://www.cies.org.bo/wp-content/uploads/2023/04/Directorio-Asamblea.png', alt: 'Image 4' },
        { src: 'https://www.cies.org.bo/wp-content/uploads/2021/03/fotos-calendario-2021-07.png', alt: 'Image 5' },
    ];

    const [isHidden, setIsHidden] = useState(false);
    const [currentBackground, setCurrentBackground] = useState(images[0]);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBackground(images[(images.indexOf(currentBackground) + 1) % images.length]);
        }, 5000);

        return () => clearInterval(timer);
    }, [currentBackground]);

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };


    const createCard = (title, subtitle, url) => {
        const header = <img alt={title} src={url} style={{ height: '250px' }} />;
        const footer = <Button label="Ver mas" />;

        return (
            <div className="m-2">
                <Card title={title} subTitle={subtitle} style={{ width: '25rem', marginBottom: '2em' }} footer={footer} header={header}>
                </Card>
            </div>
        );
    };

    const departments = [
        { name: "La Paz", image: "https://i1.wp.com/www.cies.org.bo/wp-content/uploads/2021/03/IMG_3867-scaled-1.jpg?resize=1920%2C1078&ssl=1" },
        { name: "Cochabamba", image: "https://i2.wp.com/www.cies.org.bo/wp-content/uploads/2023/05/20230405_134453-scaled.jpg?resize=1920%2C1440&ssl=1" },
        { name: "Santa Cruz", image: "https://i2.wp.com/www.cies.org.bo/wp-content/uploads/2021/03/IMG_20201026_135420.jpg?resize=1920%2C1440&ssl=1" },
        { name: "Tarija", image: "https://i2.wp.com/www.cies.org.bo/wp-content/uploads/2021/07/20210421_124204-scaled.jpg?resize=1920%2C1440&ssl=1" },
        { name: "Potosi", image: "https://i1.wp.com/www.cies.org.bo/wp-content/uploads/2021/03/frontis-potosi-03.png?w=1300&ssl=1" },
        { name: "Uyuni", image: "https://i2.wp.com/www.cies.org.bo/wp-content/uploads/2021/04/Copia-de-IMG_9676-copy.jpg?w=1000&ssl=1" },
        { name: "Oruro", image: "https://i2.wp.com/www.cies.org.bo/wp-content/uploads/2021/03/frontis-oruro-03.png?w=1300&ssl=1" },
        { name: "Sucre", image: "https://i0.wp.com/www.cies.org.bo/wp-content/uploads/2021/07/Sucre-clinica.png?w=741&ssl=1" },
    ]


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
                                <a href="#inicio" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Inicio</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="client/servicios" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
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
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(${currentBackground.src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        width: '100%',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4 mb-8">
                        <h1 className="text-7xl font-light text-white line-height-2">
                            <span className="font-bold block">CLINICA DE SALUD INTEGRAL</span>La Paz - Bolivia
                        </h1>

                        <Button label="Ver mas" rounded className="text-xl border-none mt-3 font-normal line-height-3 px-3 text-white bg-orange-400"></Button>
                    </div>
                    <div className="flex justify-content-center md:justify-content-end mb-8" style={{ marginTop: '200px' }}>
                        <img src="/demo/images/assets/ciesBlanco.png" alt="Hero Image" className="w-9 md:w-auto" />
                    </div>
                </div>

                <div className="mt-8 mb-8 text-700 text-center">
                    <div className="text-green-600 font-bold text-5xl mb-8"></div>
                    <div className="text-600 text-2xl mb-8 mx-8">
                        La Red Nacional de Servicios de Salud cuenta con: 7 REGIONALES; La Paz, Oruro, Potosí, Tarija, Sucre, Santa Cruz, Cochabamba, 7 CLINICAS La Paz, Oruro, Potosi, Tarija, Sucre, Santa Cruz y Cochabamba. 9 POLICONSULTORIOS  Y CENTROS DE SALUD; Cochabamba, en La Paz (Villa Fátima, Tumusla, Boqueron, Chasquipampa, Terminal de Buses y Cruce Villa Adela – El Alto), en Tarija (Mercado Campesino), en Santa Cruz (La Ramada), en Potosí (Uyuni).
                    </div>
                </div>


                <div className="grid mt-8 col-12 p-fluid text-center justify-content-center">
                    {departments.map((department, i) => createCard(department.name, 'Regional Cies', department.image))}
                </div>

                <div className="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
                    <div className="mb-3 font-bold text-3xl">
                        <span className="text-900">Alcance</span>
                    </div>
                    <div className="text-700 mb-6">En el año 2022, CIES Salud Sexual Salud Reproductiva ha alcanzado el siguiente impacto:</div>
                    <div className="grid">
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-user text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">503.704</div>
                            <span className="text-700 line-height-3">CONSULTAS EN SALUD INTEGRAL</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-chart-line text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">158.518</div>
                            <span className="text-700 line-height-3">ADOLESCENTES Y JÓVENES RECIBIERON INFORMACIÓN EN EDUCACIÓN INTEGRAL EN SEXUALIDAD</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">294.758</div>
                            <span className="text-700 line-height-3">CASOS DE VIOLENCIA BASADA EN GÉNERO IDENTIFICADOS</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-globe text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">152</div>
                            <span className="text-700 line-height-3">CAMAS HOSPITALARIAS DISPONIBLES A NIVEL NACIONAL</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-user text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">95.450</div>
                            <span className="text-700 line-height-3">CONSULTAS EN SALUD INTEGRAL DIFERENCIADA A ADOLESCENTES Y JÓVENES</span>
                        </div>
                        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-comments text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 text-xl mb-3 font-medium">15.894</div>
                            <span className="text-700 line-height-3">CONSULTAS EN PSICOLOGÍA Y ORIENTACIÓN A VÍCTIMAS DE VIOLENCIA BASADA EN GÉNERO</span>
                        </div>
                    </div>
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

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LandingPage;
