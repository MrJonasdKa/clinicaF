import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { getUsuario, updateUsuario, actualizarFotoPerfil } from '../../services/apiUsuarios';
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const PerfilUsuario = () => {

  const session = getSession();
  const router = useRouter();

  const rolesPermitidos = ['administrador', 'recepcionista', 'medico', 'farmaceutico'];

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

  const fileUploadRef = useRef(null);
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [id, setid] = useState(null);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [rol, setRol] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const toast = useRef(null);


  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const usuario = await getUsuario(userData.id);
      setUsuarioPerfil(usuario);
      console.log(usuario);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      showToast('error', 'Error', 'No se pudo cargar el usuario.');
    }
  };

  const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const handleNameChange = (event) => {
    if (event.target.value.match(/^[a-zA-Z ]*$/)) {
      setUsuarioPerfil(prevState => ({
        ...prevState,
        [0]: {
          ...prevState[0],
          nombres: capitalizeWords(event.target.value)
        }
      }));
    }
  }

  const handleLastNameChange = (event) => {
    if (event.target.value.match(/^[a-zA-Z ]*$/)) {
      setUsuarioPerfil(prevState => ({
        ...prevState,
        [0]: {
          ...prevState[0],
          apellidos: capitalizeWords(event.target.value)
        }
      }));
    }
  }


  const guardarUsuario = async () => {
    if (usuarioPerfil[0].nombres.trim() === '' || usuarioPerfil[0].apellidos.trim() === '' || usuarioPerfil[0].correo.trim() === '') {
      showToast('warn', 'Advertencia', 'Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const response = await updateUsuario(usuarioPerfil[0].id, usuarioPerfil[0].nombres, usuarioPerfil[0].apellidos, usuarioPerfil[0].correo);
      console.log(response);
      showToast('success', 'Éxito', 'Usuario guardado correctamente.');
      setEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      showToast('error', 'Error', 'No se pudo guardar el usuario.');
      setLoading(false);
    }
  };


  async function actualizarImagenPerfil() {
    if ((selectedImage || currentImage)) {
      try {
        const imageToUpload = selectedImage !== currentImage ? selectedImage : null;
        const response = await actualizarFotoPerfil(usuarioPerfil[0].id, imageToUpload);
        console.log(response);
        console.log(selectedImage);
        console.log(imageToUpload);
        cargarUsuario();
        setSelectedImage(null);
        fileUploadRef(null);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Foto de perfil actualizada', life: 3000 });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al subir la imagen', life: 3000 });
    }
  }


  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail });
  };

  const onFileSelect = (event) => {
    setSelectedImage(event.files[0]);
  };

  const handleFileUpload = (event) => {
    console.log('Image selected');
    const file = event.files[0];
    setSelectedImage(file);
    console.log(file);
    setImageURL(null);
    setImageURL(URL.createObjectURL(file));
    fileUploadRef.current.clear();
  };

  const cancelarSubida = () => {
    setSelectedImage(null);
    setFileKey((prevKey) => prevKey + 1);
  };

  return (

    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12 md:col-12">

        <div className='card p-fluid'>
          <h5 className='card'>Perfil de usuario</h5>
          <div className="grid">
            <div className="col-12 md:col-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="field">
                <h5>Foto de Perfil</h5>
              </div>
              <div style={{ width: '250px', height: '250px' }}>
                <div
                  style={{
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : usuarioPerfil && usuarioPerfil[0] && usuarioPerfil[0].imagen_perfil
                        ? usuarioPerfil[0].imagen_perfil
                        : 'https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                </div>
              </div>


              {selectedImage && (
                <div style={{ marginTop: '20px' }}>
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={cancelarSubida}
                    style={{ width: 'auto' }}
                  />
                  <Button
                    label="Actualizar"
                    icon="pi pi-check"
                    onClick={actualizarImagenPerfil}
                    style={{ width: 'auto' }}
                  />
                </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <FileUpload
                  ref={fileUploadRef}
                  key={fileKey}
                  mode="basic"
                  chooseLabel="Subir foto"
                  customUpload
                  uploadHandler={handleFileUpload}
                  onSelect={onFileSelect}
                  style={{ marginBottom: '20px' }}
                />
              </div>
            </div>

            {usuarioPerfil && (
              <div className="col-12 md:col-6">
                <div className="field">
                  <label htmlFor="nombres">Nombres</label>
                  <InputText
                    id="nombres"
                    value={usuarioPerfil[0].nombres}
                    onChange={handleNameChange}
                    disabled={!editing}
                  />
                </div>

                <div className="field">
                  <label htmlFor="apellidos">Apellidos</label>
                  <InputText
                    id="apellidos"
                    value={usuarioPerfil[0].apellidos}
                    onChange={handleLastNameChange}
                    disabled={!editing}
                  />
                </div>

                <div className="field">
                  <label htmlFor="correo">Correo electrónico</label>
                  <InputText
                    type='email'
                    id="correo"
                    value={usuarioPerfil[0].correo}
                    onChange={(e) => {
                      let updatedUsuarioPerfil = { ...usuarioPerfil[0], correo: e.target.value };
                      setUsuarioPerfil([updatedUsuarioPerfil]);
                    }}
                    disabled={!editing}
                  />
                </div>
                {!editing && (
                  <div className="card flex flex-wrap justify-content-center gap-3">
                    <Button label="Editar datos" icon="pi pi-pencil" onClick={() => setEditing(true)} className="p-mt-3" style={{ width: 'auto' }} />
                  </div>
                )}
                {editing && (
                  <div className="card flex flex-wrap justify-content-center gap-3">
                    <Button
                      label="Guardar"
                      icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                      className="p-mt-3"
                      style={{ width: 'auto' }}
                      onClick={guardarUsuario}
                      disabled={loading}
                    />
                    <Button
                      label="Cancelar"
                      icon="pi pi-times"
                      className="p-mt-3"
                      style={{ width: 'auto' }}
                      onClick={() => {
                        setEditing(false);
                        cargarUsuario(usuarioPerfil[0].id);
                      }}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
