import React, { useEffect, useState, useRef } from 'react';

import { Chart } from 'primereact/chart';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';
import { cantidadPacientes } from '../../services/apiInformes';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const EstadisticasPacientes = () => {


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

  const [cantidadPaciente, setCantidadPacientes] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});


  useEffect(() => {
    async function listarCantidadPacientes() {
      try {
        const cantidadPaciente = await cantidadPacientes();
        console.log(cantidadPaciente);
        setCantidadPacientes(cantidadPaciente);
      }
      catch (error) {
        console.log(error);
      }
    }
    listarCantidadPacientes();
  }, []);

  useEffect(() => {
    const labels = cantidadPaciente.map((cantidades) => cantidades.fecha);
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad',
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5',
          data: cantidadPaciente.map((cantidades) => cantidades.cantidad),
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        x: {
          ticks: {
            color: '#757575',
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: '#757575',
          },
          grid: {
            color: '#BDBDBD',
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [cantidadPaciente]);



  return (
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Cantidad de pacientes registrados</h5>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPacientes;