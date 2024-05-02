import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';

const Verify = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const { token } = window.location.search
            .substr(1)
            .split('&')
            .reduce((accumulator, keyValue) => {
                const [key, value] = keyValue.split('=');
                accumulator[key] = decodeURIComponent(value);
                return accumulator;
            }, {});

        if (token) {
            axios
                .get(`http://localhost:4000/api/verificar/verificar-correo?token=${token}`)
                .then((res) => {
                    setSuccess(true);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(true);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return (
            <div>
                <h1>Error al verificar el correo electrónico.</h1>
                <Button label="Volver al inicio" />
            </div>
        );
    }

    if (success) {
        return (
            <div>
                <h1>Correo electrónico verificado correctamente.</h1>
                <Button label="Volver al inicio" />
            </div>
        );
    }

    return <div></div>;
};

export default Verify;
