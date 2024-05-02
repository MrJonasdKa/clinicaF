import Router, { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { register } from '../../../services/api';
import { Toast } from "primereact/toast";
import Head from 'next/head';
import Link from 'next/link';


const RegisterPage = () => {

    const router = useRouter();
    const toast = useRef(null);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [confirmContrasenia, setConfirmContrasenia] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { layoutConfig } = useContext(LayoutContext);

    const [rol, setDropdownItem] = useState('');
    const dropdownItems = [
        { name: 'Administrador', value: 'administrador' },
        { name: 'Recepcionista', value: 'recepcionista' },
        { name: 'Medico', value: 'medico' },
        { name: 'Farmaceutico', value: 'farmaceutico' }
    ];


    const handlePasswordChange = (event) => {
        setContrasenia(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmContrasenia(event.target.value);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        return regex.test(password);
    };

    const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');


    const handleNameChange = (event) => {
        if (event.target.value.match(/^[a-zA-Z ]*$/)) {
            setNombres(capitalizeWords(event.target.value));
        }
    }

    const handleLastNameChange = (event) => {
        if (event.target.value.match(/^[a-zA-Z ]*$/)) {
            setApellidos(capitalizeWords(event.target.value));
        }
    }

    const handlePasswordBlur = () => {
        if (confirmContrasenia && contrasenia !== confirmContrasenia) {
            toast.current.show({ severity: 'warn', summary: 'Verifica', detail: 'Las contraseñas no coinciden', life: 3000 });
        } else if (confirmContrasenia && contrasenia === confirmContrasenia) {
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Las contraseñas coinciden', life: 3000 });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nombres || !apellidos || !correo || !contrasenia || !rol) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos', life: 3000 });
            return;
        }

        if (!validatePassword(contrasenia)) {
            toast.current.show({ severity: 'warn', summary: 'Verifica', detail: 'La contraseña debe tener al menos una letra minúscula, una mayúscula, un número y mínimo 6 caracteres.', life: 3000 });
            return;
        }

        if (contrasenia !== confirmContrasenia) {
            toast.current.show({ severity: 'warn', summary: 'Verifica', detail: 'Las contraseñas no coinciden', life: 3000 });
            return;
        }

        let estadoMedico;
        if (rol === 'medico') {
            estadoMedico = 'No registrado';
        } else {
            estadoMedico = 'Otro';
        }

        try {
            const response = await register(nombres, apellidos, correo, contrasenia, rol, estadoMedico);
            console.log(response);
            if (typeof window !== 'undefined') {
                window.location.replace('../auth/login');
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario registrado', life: 3000 });
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
            } else {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Datos incorrectos', life: 3000 });
            }
        }
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <Head>
                <title>Registro de usuario</title>
            </Head>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-simple.png`} alt="Cies logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(255, 165, 0, 0) 40%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                            <span className="text-600 font-medium">Registra tus datos.</span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="nombres" className="block text-900 text-xl font-medium mb-2">
                                Nombres
                            </label>
                            <InputText
                                inputid="nombres1"
                                value={nombres}
                                onChange={handleNameChange}
                                type="text"
                                placeholder="Nombres"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />
                            <label htmlFor="apellidos" className="block text-900 text-xl font-medium mb-2">
                                Apellidos
                            </label>
                            <InputText
                                inputid="apellidos1"
                                value={apellidos}
                                onChange={handleLastNameChange}
                                type="text"
                                placeholder="Apellidos"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Correo electronico
                            </label>
                            <InputText inputid="email1" value={correo} onChange={(event) => setCorreo(event.target.value)} type="email" placeholder="Correo electronico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}></InputText>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Contraseña
                            </label>
                            <Password inputid="password1" value={contrasenia} onChange={handlePasswordChange} placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={18}></Password>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Confirmar contraseña
                            </label>
                            <Password inputid="confirmpassword1" value={confirmContrasenia} onChange={handleConfirmPasswordChange} onBlur={handlePasswordBlur} placeholder="Confirmar contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={18}></Password>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Tipo de acceso
                            </label>
                            <Dropdown id="state" value={rol} onChange={(event) => setDropdownItem(event.value)} options={dropdownItems} optionLabel="name" placeholder="Seleccionar" className="w-full md:w-30rem mb-5"></Dropdown>
                            <Button label="Registrar" className="block w-full p-3 text-xl bg-green-400" type='submit'></Button>
                            <div className="block text-center mb-5 mt-3">
                                <span>Espera a que el administrador te brinde acceso al sistema.</span>
                            </div>
                        </form>
                        <Button icon="pi pi-arrow-left" className="block w-full" style={{ color: 'var(--primary-color)' }} label="Iniciar Sesion" text onClick={() => Router.push('/auth/login')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default RegisterPage;
