import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { mostrarServiciosID } from '../../../services/apiService';
import 'primeflex/primeflex.css';
import { getSession } from '../../../utils/session';
import { decryptData } from '../../../services/crypto';

const CardBoxServicios = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'recepcionista', 'medico'];

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

    const { id } = router.query

    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        async function listarServicios() {
            try {
                if (id) {
                    const servicios = await mostrarServiciosID(id);
                    setServicios(servicios);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, [id]);


    const renderCards = () => {
        return servicios.map((servicio) => (
            <div className="col-12 md:col-6" key={servicio.id}>
                <Card
                    title={servicio.nombre_servicio}
                    subTitle={servicio.nombre_categoria}
                    style={{ width: '100%' }}
                    className="p-shadow-10"

                    header={renderHeader(servicio.ruta_imagen)}
                >
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}> <span dangerouslySetInnerHTML={{ __html: servicio.descripcion_servicio }} /></p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Código: {servicio.codigo}</p>
                </Card>
            </div>
        ));
    };

    const renderHeader = (rutaImagen) => {
        return <img alt="Card" src={rutaImagen} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />;
    };



    return (
        <div className="grid p-fluid">
            {renderCards()}

        </div>
    );
}


export default CardBoxServicios;
