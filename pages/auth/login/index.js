import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { login } from '../../../services/api';
import { setSession } from '../../../utils/session';
import { Toast } from "primereact/toast";
import { encryptData, decryptData } from '../../../services/crypto';
import Head from 'next/head';
import Link from 'next/link';


const LoginPage = () => {
    const toast = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const handleSubmit = async (event) => {
        console.log("ayuda");
        event.preventDefault();
        if (!username || !password) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor completa ambos campos', life: 3000 });
            return;
        }
        try {
            const response = await login(username, password);
            console.log("test");
            console.log(response);
            setSession(response.token);
            const userData = response.usuario[0];
            localStorage.setItem('userData', JSON.stringify(userData));
            const encryptedUserID = encryptData(userData.id);
            localStorage.setItem('userID', encryptedUserID);
            const encryptedUserRole = encryptData(userData.rol);
            localStorage.setItem('userRole', encryptedUserRole);
            router.push('../../');
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Correo o contraseña incorrectos', life: 3000 });
            console.log(error);

        }
    };



    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <Head>
                <title>Login</title>
            </Head>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={``} alt="" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(255, 165, 0, 0) 40%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                            <span className="text-600 font-medium">Inicia sesión para acceder a los modulos.</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Correo electronico
                            </label>
                            <InputText inputid="email1" value={username} onChange={(event) => setUsername(event.target.value)} type="email" placeholder="Correo electronico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}></InputText>

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password inputid="password1" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={18}></Password>
                            <div className="text-center mb-5">
                                <Link href="/auth/register">
                                    <span className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Registrate para iniciar sesion
                                    </span>
                                </Link>
                            </div>
                            <Button label="Iniciar sesión" className="w-full p-3 text-xl bg-green-400" type='submit'></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
