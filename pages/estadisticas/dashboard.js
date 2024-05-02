import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { listarCategorias, mostrarFichasMasSolicitadas, mostrarFichasServicio, mostrarPacientes, mostrarFichasTotales, mostrarPacientesTotal, mostrarVentasPorMes } from '../../services/apiService';
import { mostrarTotalVentas, mostrarVentasPorMedicamento, mostrarMedicamentoMasVendido, mostrarPromedioVentasMes } from '../../services/apiVentas';


const Dashboard = () => {

    const [ventas, setVentas] = useState({ labels: [], datasets: [] });
    const [ventasMedicamento, setVentasMedicamento] = useState({ labels: [], datasets: [] });
    const [products, setProducts] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [medicamentoMasVendido, setMedicamentoMasVendido] = useState([]);
    const [promedioVentas, setPromedioVentas] = useState([]);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);
    const [servicios, setServicios] = useState(null);
    const [serviciosSolicitados, setServiciosSolicitados] = useState([]);
    const [totalVenta, setTotalVenta] = useState(null);
    const [fichasTotales, setFichasTotales] = useState(null);
    const [pacientesTotal, setPacientesTotal] = useState(null);


    useEffect(() => {
        async function obtenerVentasPorMes() {
            try {
                const ventasPorMes = await mostrarVentasPorMes();
                console.log(ventasPorMes);
                let labels = [];
                let data = [];

                for (let venta of ventasPorMes) {
                    let date = new Date(venta.Ano, venta.Mes - 1);
                    let nombreMes = date.toLocaleString('es-ES', { month: 'long' });

                    labels.push(nombreMes);
                    data.push(venta.Ventas_Totales);
                }
                setVentas({
                    labels: labels,
                    datasets: [{
                        label: 'Ventas',
                        data: data,
                        fill: true,
                        backgroundColor: 'rgba(255,167,38,0.2)',
                        borderColor: '#00bb7e',
                        tension: 0.4
                    }]
                });
            } catch (error) {
                console.log(error);
            }
        }
        obtenerVentasPorMes();
    }, []);

    useEffect(() => {
        async function obtenerVentasPorMedicamento() {
            try {
                const ventasMedicamento = await mostrarVentasPorMedicamento();
                console.log(ventasMedicamento);
                let labels = [];
                let data = [];

                for (let venta of ventasMedicamento) {
                    labels.push(venta.nombre_medicamento);
                    data.push(venta.VentasPorMedicamento);
                }
                setVentasMedicamento({
                    labels: labels,
                    datasets: [{
                        label: 'Ventas por medicamento',
                        data: data,
                        fill: false,
                        backgroundColor: '#FF741A',
                        borderColor: '#FF741A',
                        tension: 0.4
                    }]
                });
            } catch (error) {
                console.log(error);
            }
        }
        obtenerVentasPorMedicamento();
    }, []);

    useEffect(() => {
        async function obtenerMedicamentoMasVendido() {
            try {
                const medicamentoMasVendido = await mostrarMedicamentoMasVendido();
                console.log(medicamentoMasVendido);
                setMedicamentoMasVendido(medicamentoMasVendido);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerMedicamentoMasVendido();
    }, []);

    useEffect(() => {
        async function obtenerPromedioDeVentasPorMes() {
            try {
                const promedioVentas = await mostrarPromedioVentasMes();
                console.log(promedioVentas);
                setPromedioVentas(promedioVentas);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPromedioDeVentasPorMes();
    }, []);

    useEffect(() => {
        async function obtenerFichasMasSolicitadas() {
            try {
                const serviciosSolicitados = await mostrarFichasMasSolicitadas();
                console.log(serviciosSolicitados);
                setServiciosSolicitados(serviciosSolicitados);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerFichasMasSolicitadas();
    }, []);

    useEffect(() => {
        async function obtenerPacientesTotal() {
            try {
                const pacientesTotal = await mostrarPacientesTotal();
                console.log(pacientesTotal);
                setPacientesTotal(pacientesTotal);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientesTotal();
    }, []);

    useEffect(() => {
        async function totalVentas() {
            try {
                const totalVenta = await mostrarTotalVentas();
                console.log('Total venta: ', totalVenta);
                setTotalVenta(totalVenta);

            } catch (error) {
                console.log(error);
            }
        }
        totalVentas();
    }, []);

    useEffect(() => {
        async function totalFichas() {
            try {
                const fichasTotales = await mostrarFichasTotales();
                console.log(fichasTotales);
                setFichasTotales(fichasTotales);

            } catch (error) {
                console.log(error);
            }
        }
        totalFichas();
    }, []);


    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);

                const categoriasDropdown = categorias.map(categoria => ({
                    label: categoria.nombre_categoria,
                    value: categoria.id
                }));

                setCategoriasDropdown(categoriasDropdown);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    useEffect(() => {
        async function obtenerPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                console.log(pacientes);
                setPacientes(pacientes);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes();
    }, []);

    useEffect(() => {
        async function listarServicios() {
            try {
                if (categoria) {
                    const servicios = await mostrarFichasServicio(categoria);
                    console.log(servicios);
                    setServicios(servicios);

                    const documentStyle = getComputedStyle(document.documentElement);
                    const colores = [
                        '--orange-500',
                        '--yellow-500',
                        '--red-500',
                        '--blue-500',
                        '--green-500',
                        '--indigo-500',
                        '--purple-500',
                        '--pink-500',
                        '--gray-500',
                        // Puedes agregar más colores aquí
                    ];
                    const data = {
                        labels: servicios.map(servicio => servicio.nombre_servicio),
                        datasets: [
                            {
                                data: servicios.map(servicio => servicio.fichas_count),
                                backgroundColor: servicios.map((_, i) => documentStyle.getPropertyValue(colores[i % colores.length])),
                                hoverBackgroundColor: servicios.map((_, i) => documentStyle.getPropertyValue(colores[i % colores.length].replace('500', '400')))
                            }
                        ]
                    }
                    const options = {
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: true
                                }
                            }
                        }
                    };

                    setChartData(data);
                    setChartOptions(options);

                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, [categoria]);


    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);


    const nombrePacienteTemplate = (rowData) => {
        return <span>{rowData.nombres} {rowData.apellidos}</span>;
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ventas de farmacia</span>
                            <div className="text-900 font-medium text-xl">
                                {totalVenta && totalVenta[0] ? totalVenta[0].total_cantidad_vendida : 'Cargando...'} ventas
                            </div>
                        </div>


                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">5 nuevos </span>
                    <span className="text-500">en el ultimo mes</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total vendido en farmacia</span>
                            <div className="text-900 font-medium text-xl">{totalVenta && totalVenta[0] ? totalVenta[0].total_venta : 'Cargando...'} Bs.</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">1 nuevos </span>
                    <span className="text-500">el dia de hoy</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Venta de servicios</span>
                            <div className="text-900 font-medium text-xl">{fichasTotales && fichasTotales[0] ? fichasTotales[0].fichas_totales : 'Cargando...'} fichas total</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">1 nuevos </span>
                    <span className="text-500">el dia de hoy</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Pacientes nuevos</span>
                            <div className="text-900 font-medium text-xl">{pacientesTotal && pacientesTotal[0] ? pacientesTotal[0].pacientes_totales : 'Cargando...'} total</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">13 </span>
                    <span className="text-500">nuevos registros el ultimo mes</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Resumen de venta de fichas</h5>
                    <Dropdown id="categoria" value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder="Seleccione una categoria" className='w-full field' />
                    <div className="flex justify-content-center">
                        {
                            servicios && servicios.length > 0 ?
                                <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" /> :
                                <span>No hay fichas para mostrar</span>
                        }
                    </div>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Servicios mas solicitados</h5>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {serviciosSolicitados.map((servicio, index) => (
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" key={index}>
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{servicio.nombre_servicio}</span>
                                    <div className="mt-1 text-600">{servicio.nombre_categoria}</div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <span className="text-orange-500 ml-3 font-medium">{servicio.total_fichas} Fichas</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card">
                    <h5>Resumen de ventas por medicamento</h5>
                    <div className='field'>
                        <span className="block text-500 font-medium mb-3">Se listaran los 10 medicamentos mas vendidos ordenados de mayor a menor</span>
                    </div>
                    <div className='field'>
                        <Chart type="bar" data={ventasMedicamento} options={lineOptions} />
                    </div>
                    <div className='field'>
                        <span className="text-green-500 font-medium">{medicamentoMasVendido && medicamentoMasVendido[0] && medicamentoMasVendido[0].nombre_medicamento ? medicamentoMasVendido[0].nombre_medicamento : 'Cargando...'} </span>
                        <span className="text-700">fue el medicamento mas vendido con un total de: </span>
                        <span className="text-green-500 font-medium">{medicamentoMasVendido && medicamentoMasVendido[0] && medicamentoMasVendido[0].CantidadVendida ? medicamentoMasVendido[0].CantidadVendida : 'Cargando...'} ventas</span>
                    </div>
                </div>

            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Promedio de ventas por mes</h5>
                    <span className="block text-500 font-medium mb-3">Se muestra el promedio expresado en porcentaje sobre la venta total por meses</span>
                    <DataTable value={promedioVentas} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Mes" header="Mes" sortable style={{ width: '35%' }} />
                        <Column field="TotalVentasMes" header="Total ventas" sortable style={{ width: '35%' }} />
                        <Column field="Porcentaje" header="Porcentaje" sortable style={{ width: '30%' }} />
                    </DataTable>
                </div>
                <div className="card">
                    <h5>Resumen de venta en farmacia</h5>
                    <span className="block text-500 font-medium mb-3">Se muestra en la grafica el total de medicamentos vendidos por mes</span>
                    <Chart type="line" data={ventas} options={lineOptions} />
                </div>

                <div className="card">
                    <h5>Pacientes nuevos</h5>
                    <DataTable value={pacientes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="nombres" header="Nombre Completo" body={nombrePacienteTemplate} sortable style={{ width: '35%' }} />
                        <Column field="ci" header="Documento de identidad" sortable style={{ width: '35%' }} />
                        <Column field="sexo" header="Genero" sortable style={{ width: '30%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
