import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { getSession } from '../utils/session';
import { decryptData } from '../services/crypto';

const Dashboard = () => {
    const logo = 'https://www.cies.org.bo/wp-content/uploads/2021/04/IMG_3867-scaled.jpg';
    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'recepcionista', 'farmaceutico', 'medico'];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const rolUsuarioEncriptado = localStorage.getItem('userRole');
            if (session == null || rolUsuarioEncriptado == null) {
                router.replace('/auth/login');
                return;
            }
            const rolUsuario = decryptData(rolUsuarioEncriptado);
            if (!rolesPermitidos.includes(rolUsuario)) {
                router.replace('/auth/login');
                return;
            }
        }
    });

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div
                    id="hero"
                    className="flex flex-column pt-8 px-4 lg:px-8 overflow-hidden"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.3), rgba(0, 255, 0, 0.4)),url(${logo})`,
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
                        

                    </div>
                    <div className="flex justify-content-center md:justify-content-end mt-8">
                        <img src="" alt="CLINICA" className="w-9 md:w-auto" />
                    </div>
                </div>



                <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2">Novedades</h2>
                        <span className="text-600 text-2xl">Version 1.0.0</span>
                    </div>

                    <div className="grid my-8 pt-2 md:pt-8">
                        <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                            <div className="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start" style={{ width: '4.2rem', height: '4.2rem', borderRadius: '10px' }}>
                                <i className="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal">Sistema de escritorio</h2>
                            <span className="text-700 text-2xl line-height-3 mr-0 md:mr-2" style={{ maxWidth: '650px' }}>
                                Nuestro sistema de gestión de clínicas es de escritorio y funciona en cualquier navegador sin necesidad de descargar software adicional.
                            </span>
                        </div>

                        <div className="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0" style={{ borderRadius: '8px' }}>
                            <img src="/demo/images/landing/mockup-desktop.svg" className="w-11" alt="mockup" />
                        </div>
                    </div>

                    <div className="grid mt-8 pb-2 md:pb-8">
                        <div className="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style={{ borderRadius: '8px' }}>
                            <img src="/demo/images/landing/mockup.svg" className="w-11" alt="mockup mobile" />
                        </div>

                        <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                            <div className="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end" style={{ width: '4.2rem', height: '4.2rem', borderRadius: '10px' }}>
                                <i className="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal">Diseño responsive</h2>
                            <span className="text-700 text-2xl line-height-3 ml-0 md:ml-2" style={{ maxWidth: '650px' }}>
                                Con nuestro sistema de gestión de clínica, ahora puede acceder desde cualquier dispositivo con conexión a Internet, incluyendo su teléfono celular. Nuestro sistema es completamente responsive y está diseñado para adaptarse a cualquier tamaño de pantalla.
                            </span>
                        </div>
                    </div>


                </div>


            </div>
        </div>
    );
};



export default Dashboard;
