import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { registrar, listarDirecciones } from '../../services/apiPacientes';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export const NuevoPaciente = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'recepcionista'];

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

    let emptyPaciente = {
        nombres: '',
        apellidos: '',
        ci: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        correo_electronico: '',
        provincia: '',
        zona: '',
        calle: '',
        usuario: '',
        contrasenia: '',
    };

    const sexoDropdown = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
    ];

    const provinciasDropdown = [
        { label: 'Abel Iturralde', value: 'Abel Iturralde' },
        { label: 'Pedro Domingo Murillo', value: 'Pedro Domingo Murillo' },
        { label: 'Pacajes', value: 'Pacajes' },
        { label: 'Larecaja', value: 'Larecaja' },
        { label: 'Inquisivi', value: 'Inquisivi' },
        { label: 'Sud Yungas', value: 'Sud Yungas' },
        { label: 'Ingavi', value: 'Ingavi' },
        { label: 'Muñecas', value: 'Muñecas' },
        { label: 'Franz Tamayo', value: 'Franz Tamayo' },
        { label: 'Aroma', value: 'Aroma' },
        { label: 'Caranavi', value: 'Caranavi' },
        { label: 'José Ramón Loayza', value: 'José Ramón Loayza' },
        { label: 'Bautista Saavedra', value: 'Bautista Saavedra' },
        { label: 'Eliodoro Camacho', value: 'Eliodoro Camacho' },
        { label: 'Omasuyos', value: 'Omasuyos' },
        { label: 'General José Manuel Pando', value: 'General José Manuel Pando' },
        { label: 'Gualberto Villaroel', value: 'Gualberto Villaroel' },
        { label: 'Nor Yungas', value: 'Nor Yungas' },
        { label: 'Los Andes', value: 'Los Andes' },
        { label: 'Manco Kapac', value: 'Manco Kapac' },
    ];

    let today = new Date();

    const toast = useRef(null);
    const [paciente, setPaciente] = useState(emptyPaciente);
    const [pais, setPais] = useState('Bolivia');
    const [ciudad, setCiudad] = useState('La Paz');

    //Registrar paciente
    async function registrarPaciente() {
        if (paciente.nombres.trim() !== "" &&
            paciente.apellidos.trim() !== "" &&
            paciente.ci.trim() !== "" &&
            paciente.fecha_nacimiento !== "" &&
            paciente.sexo.trim() !== "" &&
            paciente.telefono !== "" &&
            paciente.correo_electronico.trim() !== "" &&
            paciente.provincia.trim() !== "" &&
            paciente.zona.trim() !== "" &&
            paciente.calle.trim() !== "" &&
            paciente.usuario.trim() !== "" &&
            paciente.contrasenia.trim() !== "") {
            try {
                const response = await registrar(paciente.nombres, paciente.apellidos, paciente.ci, formatDate(paciente.fecha_nacimiento), paciente.sexo, paciente.telefono, paciente.correo_electronico, pais, ciudad, paciente.provincia, paciente.zona, paciente.calle, paciente.usuario, paciente.contrasenia);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Paciente registrado', life: 3000 });
                setPaciente(emptyPaciente);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }

    }


    const handleSubmit = async () => {
        console.log(paciente);
        registrarPaciente();
    };

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/${day}`;
    }

    const generarCredenciales = () => {
        if (
            paciente.nombres !== '' &&
            paciente.apellidos !== '' &&
            paciente.ci !== ''
        ) {
            let username = `${paciente.nombres.charAt(0)}${paciente.apellidos.split(' ')[0]}${paciente.ci.slice(-2)}`.toLowerCase();
            let password = `${paciente.nombres.charAt(0)}${paciente.apellidos.charAt(2)}${paciente.ci.slice(0, 5)}${paciente.nombres.charAt(1)}`.split('').reverse().join('');

            setPaciente((prevState) => ({
                ...prevState,
                usuario: username,
                contrasenia: password,
            }));

            console.log(paciente);
        }
    };

    const camposRequeridosLlenos = () => {
        return paciente.nombres !== '' && paciente.apellidos !== '' && paciente.ci !== '' && paciente.fecha_nacimiento !== '' && paciente.sexo !== '' && paciente.telefono !== '' && paciente.correo_electronico !== '' && paciente.provincia !== '' && paciente.zona !== '' && paciente.calle !== '' && paciente.usuario !== '' && paciente.contrasenia !== '';
    };


    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <h5>Registrar paciente nuevo</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="nombresPaciente">Nombres del paciente</label>
                                <InputText id="nombres" name="nombres" value={paciente.nombres} onChange={(e) => setPaciente({ ...paciente, nombres: e.target.value })} placeholder="Escriba los nombres del paciente" />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="apellidosPaciente">Apellidos del paciente</label>
                                <InputText id="apellidos" name="apellidos" value={paciente.apellidos} onChange={(e) => setPaciente({ ...paciente, apellidos: e.target.value })} placeholder="Escriba los apellidos del paciente" />
                            </div>
                        </div>

                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="fecha_nacimiento">Fecha de nacimiento del paciente</label>
                                <Calendar
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    value={paciente.fecha_nacimiento}
                                    onChange={(e) => setPaciente({ ...paciente, fecha_nacimiento: e.target.value })}
                                    showIcon
                                    dateFormat="yy/mm/dd"
                                    maxDate={today}
                                    required
                                    autoFocus
                                    placeholder="Escoja la fecha de nacimiento del paciente"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="sexo">Genero del paciente</label>
                                <Dropdown id="categoria" value={paciente.sexo} onChange={(e) => setPaciente({ ...paciente, sexo: e.target.value })} options={sexoDropdown} placeholder="Seleccione un genero" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="telefono">Telefono del paciente</label>
                                <InputNumber inputId="telefono" value={paciente.telefono} onValueChange={(e) => setPaciente({ ...paciente, telefono: e.target.value })} useGrouping={false} placeholder="Escriba el telefono del paciente" />
                            </div>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="ci">Documento de identidad y lugar expedido</label>
                                <InputText id="ci" name="ci" value={paciente.ci} onChange={(e) => setPaciente({ ...paciente, ci: e.target.value })} placeholder="Escriba el carnet de identidad del paciente" />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="correo_electronico">Correo electronico del paciente</label>
                                <InputText id="correo_electronico" name="correo_electronico" value={paciente.correo_electronico} onChange={(e) => setPaciente({ ...paciente, correo_electronico: e.target.value })} placeholder="Escriba el correo electronico del paciente" />
                            </div>
                        </div>
                    </div>


                </div>
                <div className='card p-fluid'>
                    <div className="field">
                        <h5 htmlFor="direccion">Datos de la direccion actual del paciente</h5>
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="pais">Pais</label>
                                <InputText id="pais" name="pais" value={pais} onChange={(e) => setPais(e.target.value)} disabled />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="ciudad">Departamento</label>
                                <InputText id="ciudad" name="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="provincia">Provincia</label>
                                <Dropdown id="categoria" value={paciente.provincia} onChange={(e) => setPaciente({ ...paciente, provincia: e.target.value })} options={provinciasDropdown} placeholder="Seleccione una provincia" filter />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="zona">Zona</label>
                                <InputText id="zona" name="zona" value={paciente.zona} onChange={(e) => setPaciente({ ...paciente, zona: e.target.value })} placeholder="Escriba la zona del paciente" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="calle">Calle</label>
                                <InputText id="calle" name="calle" value={paciente.calle} onChange={(e) => setPaciente({ ...paciente, calle: e.target.value })} placeholder="Escriba la calle donde vive el paciente" />
                            </div>
                        </div>
                    </div>

                </div>
                <div className='card p-fluid'>
                    <div className="col-12 md:col-12">
                        <div className="field">
                            <h5 htmlFor="direccion">Genera el usuario del paciente</h5>
                        </div>
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <div className="field">
                                    <Button
                                        label="Generar Usuario"
                                        onClick={generarCredenciales}
                                        className="p-mt-3 bg-green-400"
                                        style={{ width: 'auto' }}
                                        disabled={!paciente.nombres || !paciente.apellidos || !paciente.ci}
                                    />
                                </div>

                            </div>
                            <div className="col-12 md:col-4">
                                <div className="field">
                                    <h5 htmlFor="usuario">Usuario: {paciente.usuario}</h5>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="field">
                                    <h5 htmlFor="contrasenia">Contraseña: {paciente.contrasenia}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card flex flex-wrap justify-content-end gap-3">
                        <Button
                            label="Registrar paciente"
                            onClick={handleSubmit}
                            className="p-mt-3 bg-green-400"
                            style={{ width: 'auto' }}
                            disabled={!camposRequeridosLlenos()}
                        />

                        <Button
                            icon="pi pi-refresh"
                            className="p-button-outlined p-button-danger p-mt-3"
                            style={{ width: 'auto' }}
                            onClick={() => {
                                setPaciente(emptyPaciente);
                            }}
                            label="Limpiar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevoPaciente;