import React, { useEffect, useState } from 'react';
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

const ReporteCierre = () => {
    const [cierres, setCierres] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('2024-01-01');
    const [fechaFin, setFechaFin] = useState('2024-12-31');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch para obtener los cierres de cuentas desde la API
    const fetchCierres = async (fechaInicio, fechaFin) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3000/api/reportes/cierres-cuentas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            if (!response.ok) {
                throw new Error('Error al obtener los cierres de cuentas');
            }
            const data = await response.json();
            setCierres(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Maneja el botón de buscar por fechas
    const handleBuscar = () => {
        fetchCierres(fechaInicio, fechaFin);
    };

    // Fetch inicial
    useEffect(() => {
        fetchCierres(fechaInicio, fechaFin);
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Reporte de Cierre</h1>

                {/* Filtros por fecha */}
                <div className="flex flex-col sm:flex-row gap-4 p-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                        />
                    </div>
                    <button
                        onClick={handleBuscar}
                        className="self-end bg-[#5E17EB] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition my-4 w-full sm:w-auto sm:my-0"
                    >
                        Buscar por Fechas
                    </button>
                </div>

                {/* Mensaje de carga o error */}
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Tabla de Cierres de Cuentas */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3">Nombre de Usuario</th>
                                <th className="px-6 py-3">Número de Tarjeta</th>
                                <th className="px-6 py-3">Motivo de Cierre</th>
                                <th className="px-6 py-3">Fecha y Hora de Cierre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cierres.length > 0 ? (
                                cierres.map((cierre, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{cierre.nombre_usuario}</td>
                                        <td className="px-6 py-4">{cierre.numero_tarjeta}</td>
                                        <td className="px-6 py-4">{cierre.motivo_cierre}</td>
                                        <td className="px-6 py-4">
                                            {new Date(cierre.fecha_cierre).toLocaleString('es-ES')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4">
                                        No hay información en estas fechas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteCierre;
