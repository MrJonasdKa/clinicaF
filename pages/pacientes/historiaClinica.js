import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from "primereact/inputtextarea";
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { InputMask } from "primereact/inputmask";
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { mostrarPacientes, registrarFicha, mostrarPacienteID } from '../../services/apiService';
import { mostrarHistoriaClinica, registrarHistoriaClinica } from '../../services/apiPacientes';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export default function ReservaCitas() {

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

    let emptyHistoriaClinica = {
        id_paciente: 0,
        motivo_consulta: '',
        enfermedad_actual: '',
        antecedentes: '',
        diagnostico_cie: '',
        diagnostico_medico: '',
        tratamiento: '',
        observaciones: '',
        presion_arterial: '',
        peso: '',
        talla: '',
        temperatura_corporal: '',
        frecuencia_respiratoria: '',
        frecuencia_cardiaca: '',
        saturacion_oxigeno: '',
        examen_fisico_general: '',
        examen_piel: ''
    }

    const toast = useRef(null);
    const [paciente, setPaciente] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [filteredPacientes, setFilteredPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [infoPaciente, setInfoPaciente] = useState(null);
    const [verHistoriaClinica, setVerHistoriaClinica] = useState(null);
    const [historiaClinica, setHistoriaClinica] = useState(emptyHistoriaClinica);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);



    useEffect(() => {
        async function obtenerPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                console.log(pacientes);

                const suggestions = pacientes.map(paciente => ({
                    nombre: `${paciente.nombres} ${paciente.apellidos}`,
                    ...paciente
                }));

                setPacientes(suggestions);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes();
    }, []);

    useEffect(() => {
        async function obtenerPacienteID() {
            try {
                if (selectedPaciente) {
                    const infoPaciente = await mostrarPacienteID(selectedPaciente.id);
                    console.log(infoPaciente);

                    setInfoPaciente(infoPaciente);
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacienteID();
    }, [selectedPaciente]);

    useEffect(() => {
        async function obtenerHistoriaClinica() {
            try {
                if (selectedPaciente) {
                    const verHistoriaClinica = await mostrarHistoriaClinica(selectedPaciente.id);
                    console.log(verHistoriaClinica);

                    setVerHistoriaClinica(verHistoriaClinica);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError(error.response.data.message);
                } else {
                    setError('Ocurrió un error inesperado');
                }
            }
        }
        obtenerHistoriaClinica();
    }, [selectedPaciente]);


    async function añadirHistoriaClinica() {
        try {
            if (camposRequeridosLlenos()) {
                const response = await registrarHistoriaClinica(selectedPaciente.id, historiaClinica.motivo_consulta, historiaClinica.enfermedad_actual, historiaClinica.antecedentes, historiaClinica.diagnostico_cie, historiaClinica.diagnostico_medico, historiaClinica.tratamiento, historiaClinica.observaciones, historiaClinica.presion_arterial, historiaClinica.peso, historiaClinica.talla, historiaClinica.temperatura_corporal, historiaClinica.frecuencia_respiratoria, historiaClinica.frecuencia_cardiaca, historiaClinica.saturacion_oxigeno, historiaClinica.examen_fisico_general, historiaClinica.examen_piel);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Ficha registrada', life: 3000 });
                setHistoriaClinica(emptyHistoriaClinica);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos', life: 3000 });
            }

        } catch (error) {
            console.log(error);
        }
    }


    function buscarPaciente(event) {
        let filteredPacientes = [];

        if (event.query.trim().length) {
            filteredPacientes = pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(event.query.toLowerCase()));
        } else {
            filteredPacientes = [...pacientes];
        }

        setFilteredPacientes(filteredPacientes);
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/${day}`;
    }

    async function limpiarCampos() {
        setHistoriaClinica(emptyHistoriaClinica);
    }

    const camposRequeridosLlenos = () => {
        return historiaClinica.motivo_consulta !== '' && historiaClinica.enfermedad_actual !== '' && historiaClinica.antecedentes !== '' && historiaClinica.diagnostico_cie !== '' && historiaClinica.diagnostico_medico !== '' && historiaClinica.tratamiento !== '' && historiaClinica.observaciones !== '' && historiaClinica.presion_arterial !== '' && historiaClinica.peso !== '' && historiaClinica.talla !== '' && historiaClinica.temperatura_corporal !== '' && historiaClinica.frecuencia_respiratoria !== '' && historiaClinica.frecuencia_cardiaca !== '' && historiaClinica.saturacion_oxigeno !== '' && historiaClinica.examen_fisico_general !== '' && historiaClinica.examen_piel !== '';
    };


    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">

                <div className="card p-fluid">
                    <h5>Historia Clinica</h5>

                    <div className="grid">
                        <div className="col-12 md:col-12">
                            <div className="field">
                                <label htmlFor="nombre">Nombre del paciente</label>
                                <AutoComplete
                                    placeholder="Buscar"
                                    id="dd"
                                    dropdown
                                    value={selectedPaciente}
                                    onChange={async (e) => {
                                        setSelectedPaciente(e.value);

                                        // Borra los mensajes de error y la historia clínica del paciente anterior
                                        setError(null);
                                        setVerHistoriaClinica([]);
                                        setShowForm(null);

                                        // Ahora puedes buscar la historia clínica del nuevo paciente seleccionado
                                        try {
                                            const historiaClinica = await getHistoriaClinica(e.value.id); // Suponiendo que tienes una función getHistoriaClinica para buscar la historia clínica
                                            if (historiaClinica.length > 0) {
                                                setVerHistoriaClinica(historiaClinica);
                                            } else {
                                                setError('El paciente no tiene historia clinica');
                                            }
                                        } catch (e) {
                                            setError('Ocurrió un error al buscar la historia clínica del paciente');
                                        }
                                    }}
                                    suggestions={filteredPacientes}
                                    completeMethod={buscarPaciente}
                                    field="nombre"
                                />
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="card">
                                <div className="field">
                                    <label className='font-bold' htmlFor="medico">Informacion del paciente</label>
                                    <Divider />
                                    <ul className="list-none p-0 m-0">
                                        {infoPaciente ? infoPaciente.map((key) => (
                                            <div key={key}>
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Nombres</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.nombres}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Apellidos</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.apellidos}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Documento de identidad</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.ci}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-8 font-medium">Fecha de nacimiento</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{formatDate(key.fecha_nacimiento)} </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Telefono</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.telefono}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Genero</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                                <Tag className="mr-2" severity={key.sexo === 'Masculino' ? 'info' : 'danger'} value={key.sexo} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="grid">
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Ciudad</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.ciudad}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Provincia</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.provincia}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Zona</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.zona}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <div className="text-500 w-full md:w-2 font-medium">Calle</div>
                                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{key.calle}</div>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>

                                        )) : <p>No se ha seleccionado ningún paciente.</p>}
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <div className='col-12'>
                            <div className="card">
                                <div className="field">
                                    <label className='font-bold' htmlFor="medico">Historia Clinica</label>
                                    <Divider />
                                    {showForm ? (
                                        <div className="col-12 md:col-12">
                                            <div className="card p-fluid">
                                                <h5>Registrar historia clinica</h5>
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="motivo_consulta">Motivo de la consulta</label>
                                                            <InputText id="motivo_consulta" name="motivo_consulta" value={historiaClinica.motivo_consulta} onChange={(e) => setHistoriaClinica({ ...historiaClinica, motivo_consulta: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="enfermedad_actual">Enfermedad actual</label>
                                                            <InputText id="enfermedad_actual" name="enfermedad_actual" value={historiaClinica.enfermedad_actual} onChange={(e) => setHistoriaClinica({ ...historiaClinica, enfermedad_actual: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="diagnostico_cie">Diagnostico CIE</label>
                                                            <InputText id="diagnostico_cie" name="diagnostico_cie" value={historiaClinica.diagnostico_cie} onChange={(e) => setHistoriaClinica({ ...historiaClinica, diagnostico_cie: e.target.value })} />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="grid">
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="antecedentes">Antecedentes</label>
                                                            <InputTextarea autoResize value={historiaClinica.antecedentes} onChange={(e) => setHistoriaClinica({ ...historiaClinica, antecedentes: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="diagnostico_medico">Diagnostico medico</label>
                                                            <InputTextarea autoResize value={historiaClinica.diagnostico_medico} onChange={(e) => setHistoriaClinica({ ...historiaClinica, diagnostico_medico: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="tratamiento">Tratamiento del paciente</label>
                                                            <InputTextarea autoResize value={historiaClinica.tratamiento} onChange={(e) => setHistoriaClinica({ ...historiaClinica, tratamiento: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="observaciones">Observaciones</label>
                                                            <InputTextarea autoResize value={historiaClinica.observaciones} onChange={(e) => setHistoriaClinica({ ...historiaClinica, observaciones: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card p-fluid'>
                                                <div className="field">
                                                    <h5 htmlFor="direccion">Examen fisico</h5>
                                                </div>
                                                <div className="grid">
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="presion_arterial">Presion arterial</label>
                                                            <InputMask value={historiaClinica.presion_arterial} onChange={(e) => setHistoriaClinica({ ...historiaClinica, presion_arterial: e.target.value })} mask="999/99" placeholder="000/00" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="peso">Peso (Kilogramos)</label>
                                                            <InputNumber inputId="peso" value={historiaClinica.peso} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, peso: e.target.value })} min={0} max={300} minFractionDigits={2} maxFractionDigits={3} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-4">
                                                        <div className="field">
                                                            <label htmlFor="talla">Talla (Metros)</label>
                                                            <InputNumber inputId="talla" value={historiaClinica.talla} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, talla: e.target.value })} min={0} max={4} minFractionDigits={2} maxFractionDigits={2} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid">
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="temperatura_corporal">Temperatura Corporal (Grados centigrados)</label>
                                                            <InputNumber inputId="temperatura_corporal" value={historiaClinica.temperatura_corporal} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, temperatura_corporal: e.target.value })} min={0} max={100} minFractionDigits={2} maxFractionDigits={2} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="frecuencia_respiratoria">Frecuencia respiratoria</label>
                                                            <InputNumber inputId="frecuencia_respiratoria" value={historiaClinica.frecuencia_respiratoria} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, frecuencia_respiratoria: e.target.value })} min={0} max={100} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="frecuencia_cardiaca">Frecuencia cardiaca</label>
                                                            <InputNumber inputId="frecuencia_cardiaca" value={historiaClinica.frecuencia_cardiaca} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, frecuencia_cardiaca: e.target.value })} min={0} max={150} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-3">
                                                        <div className="field">
                                                            <label htmlFor="saturacion_oxigeno">Saturacion de oxigeno</label>
                                                            <InputNumber inputId="saturacion_oxigeno" value={historiaClinica.saturacion_oxigeno} onValueChange={(e) => setHistoriaClinica({ ...historiaClinica, saturacion_oxigeno: e.target.value })} min={0} max={150} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid">
                                                    <div className="col-12 md:col-6">
                                                        <div className="field">
                                                            <label htmlFor="examen_piel">Examen de piel</label>
                                                            <InputTextarea autoResize value={historiaClinica.examen_piel} onChange={(e) => setHistoriaClinica({ ...historiaClinica, examen_piel: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 md:col-6">
                                                        <div className="field">
                                                            <label htmlFor="examen_fisico_general">Examen medico general</label>
                                                            <InputTextarea autoResize value={historiaClinica.examen_fisico_general} onChange={(e) => setHistoriaClinica({ ...historiaClinica, examen_fisico_general: e.target.value })} rows={5} cols={30} />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="card flex flex-wrap justify-content-end gap-3">
                                                    <Button
                                                        label="Registrar"
                                                        className="p-mt-3 bg-green-400"
                                                        style={{ width: 'auto' }}
                                                        onClick={añadirHistoriaClinica}
                                                        disabled={!camposRequeridosLlenos()}
                                                    />
                                                    <Button
                                                        icon="pi pi-refresh"
                                                        className="p-button-outlined p-button-danger p-mt-3"
                                                        style={{ width: 'auto' }}
                                                        onClick={limpiarCampos}
                                                        label="Limpiar"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <ul className="list-none p-0 m-0">
                                            {verHistoriaClinica && verHistoriaClinica.length > 0 ? verHistoriaClinica.map((key) => (
                                                <div key={key}>
                                                    <div className="grid">
                                                        <div className="col-12 md:col-4">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Motivo de la consulta</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.motivo_consulta}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Enfermedad actual</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.enfermedad_actual}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Antecedentes</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.antecedentes}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    <div className="grid">
                                                        <div className="col-12 md:col-3">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Diagnostico CIE</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.diagnostico_cie}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-3">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Diagnostico Medico</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.diagnostico_medico}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-3">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Tratamiento</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.tratamiento}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-3">
                                                            <div className="field">
                                                                <div className="text-500 w-full md:w-8 font-medium">Observaciones</div>
                                                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.observaciones}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    <div className='card'>
                                                        <h6 className='font-bold'>Examen fisico del paciente</h6>
                                                        <div className="grid">
                                                            <div className="col-12 md:col-3">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Presion arterial</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.presion_arterial}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-3">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Peso (Kilogramos)</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.peso}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-3">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Talla (Metros)</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.talla}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-3">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Temperatura corporal (Grados centigrados)</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.temperatura_corporal}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider />
                                                        <div className="grid">
                                                            <div className="col-12 md:col-4">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Frecuencia respiratoria</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.frecuencia_respiratoria}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-4">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Frecuencia cardiaca</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.frecuencia_cardiaca}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-4">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Saturacion de oxigeno</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.saturacion_oxigeno}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider />
                                                        <div className="grid">
                                                            <div className="col-12 md:col-6">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Examen de piel</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.examen_piel}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-6">
                                                                <div className="field">
                                                                    <div className="text-500 w-full md:w-8 font-medium">Examen fisico general del paciente</div>
                                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{key.examen_fisico_general}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) :
                                                <div>
                                                    <p>{error ? error : 'El paciente no tiene historia clinica'}</p>
                                                    <Button
                                                        label="Crear historia medica"
                                                        className="p-mt-3 bg-green-400"
                                                        style={{ width: 'auto' }}
                                                        onClick={() => setShowForm(true)}
                                                        disabled={!selectedPaciente}
                                                    />
                                                </div>
                                            }
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
