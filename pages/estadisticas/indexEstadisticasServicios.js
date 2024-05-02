import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { serviciosUtilizados, categoriaServicios } from '../../services/apiInformes';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';


const EstadisticasServicios = () => {

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

  const [serviciosUsados, setServiciosUsados] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});


  useEffect(() => {
    async function listarServiciosUsados() {
      try {
        const serviciosUsados = await serviciosUtilizados();
        console.log(serviciosUsados);
        setServiciosUsados(serviciosUsados);
      }
      catch (error) {
        console.log(error);
      }
    }
    listarServiciosUsados();
  }, []);

  useEffect(() => {
    const labels = serviciosUsados.map((servicio) => servicio.nombre_servicio);
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad',
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5',
          data: serviciosUsados.map((servicio) => servicio.veces_utilizado),
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
  }, [serviciosUsados]);



  return (
    <div className="grid p-fluid">
      <div className="col-12 md:col-12">
        <div className="card">
          <h5>Cantidad de veces que el servicio fue solicitado</h5>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default EstadisticasServicios;