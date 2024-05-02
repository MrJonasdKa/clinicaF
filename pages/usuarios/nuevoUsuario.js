import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { addUsuarios, filtrarUsuarios } from "../../services/apiUsuarios";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useRouter } from 'next/router';
import { register } from '../../services/api';
import { getSession } from '../../utils/session';
import { Password } from 'primereact/password';
import { decryptData } from '../../services/crypto';

const AgregarUsuario = () => {

  const session = getSession();
  const router = useRouter();

  const rolesPermitidos = ['administrador'];

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

  const toast = useRef(null);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmContrasenia, setConfirmContrasenia] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


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
      toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario registrado', life: 3000 });
      setNombres('');
      setApellidos('');
      setCorreo('');
      setContrasenia('');
      setConfirmContrasenia('');
      setDropdownItem('');

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
      } else {
        console.log(error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Datos incorrectos', life: 3000 });
      }
    }
  };

  async function limpiarCampos() {
    setNombres('');
    setApellidos('');
    setCorreo('');
    setContrasenia('');
    setConfirmContrasenia('');
    setDropdownItem('');
  }


  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12 md:col-12">
        <div className="card p-fluid">
          <h5>Registrar paciente nuevo</h5>
          <form>
            <div className="grid">
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="nombres" className="block text-900 text-xl font-medium mb-2">
                    Nombres
                  </label>
                  <InputText
                    inputid="nombres1"
                    value={nombres}
                    onChange={handleNameChange}
                    type="text"
                    placeholder="Nombres"
                    style={{ padding: '1rem' }}
                  />
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="apellidos" className="block text-900 text-xl font-medium mb-2">
                    Apellidos
                  </label>
                  <InputText
                    inputid="apellidos1"
                    value={apellidos}
                    onChange={handleLastNameChange}
                    type="text"
                    placeholder="Apellidos"
                    style={{ padding: '1rem' }}
                  />
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                    Correo electronico
                  </label>
                  <InputText inputid="email1" value={correo} onChange={(event) => setCorreo(event.target.value)} type="email" placeholder="Correo electronico" style={{ padding: '1rem' }}></InputText>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                    Contraseña
                  </label>
                  <Password inputid="password1" value={contrasenia} onChange={handlePasswordChange} placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={18}></Password>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                    Confirmar contraseña
                  </label>
                  <Password inputid="confirmpassword1" value={confirmContrasenia} onChange={handleConfirmPasswordChange} onBlur={handlePasswordBlur} placeholder="Confirmar contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={18}></Password>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="field">
                  <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                    Tipo de acceso
                  </label>
                  <Dropdown id="state" value={rol} onChange={(event) => setDropdownItem(event.value)} options={dropdownItems} optionLabel="name" placeholder="Seleccionar" className="w-full md:w-30rem mb-5"></Dropdown>
                </div>
              </div>
            </div>
            <div className="card flex flex-wrap justify-content-end gap-3">
              <Button
                label="Registrar"
                onClick={handleSubmit}
                className="p-mt-3 bg-orange-500"
                type="submit"
                style={{ width: 'auto' }}
              />
              <Button
                icon="pi pi-refresh"
                className="p-button-outlined p-button-danger p-mt-3"
                style={{ width: 'auto' }}
                onClick={limpiarCampos}
                label="Limpiar"
              />
            </div>
          </form>

        </div>
      </div>
    </div>

  );
};

export default AgregarUsuario;
