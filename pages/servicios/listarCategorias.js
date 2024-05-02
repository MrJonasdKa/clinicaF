import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { listarCategorias } from '../../services/apiService';
import 'primeflex/primeflex.css';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const CardBoxCategorias = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'recepcionista', 'medico'];

    useEffect(()=>{
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

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        async function mostrarCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
            }
            catch (error) {
                console.log(error);
            }
        }
        mostrarCategorias();
    }, []);


    const renderCards = () => {
        return categorias.map((categoria) => (
            <div className="col-12 md:col-6" key={categoria.id}>
                <Card
                    title={categoria.nombre_categoria}
                    style={{ width: '100%' }}
                    className="p-shadow-10"

                    header={renderHeader(categoria.ruta_imagen)}
                >
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}> <span dangerouslySetInnerHTML={{ __html: categoria.descripcion_categoria }} /></p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Código: {categoria.codigo}</p>

                    <Link href={`/servicios/listarServicios/${categoria.id}`}>
                        <Button className='bg-orange-500' icon="pi pi-check" label='Ver servicios' rounded></Button>
                    </Link>
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


export default CardBoxCategorias;
