import React, { useEffect, useState } from 'react';
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

// Íconos para las flechas
const ArrowUp = () => <span className="text-green-500">↑</span>;
const ArrowDown = () => <span className="text-red-500">↓</span>;

const ReporteMovimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('2024-01-01');
    const [fechaFin, setFechaFin] = useState('2024-12-31');

    // Fetch para obtener los datos desde la API con las fechas seleccionadas
    const fetchMovimientos = async (fechaInicio, fechaFin) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            const data = await response.json();
            setMovimientos(data);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
        }
    };

    // Maneja el botón de buscar por fechas
    const handleBuscar = () => {
        fetchMovimientos(fechaInicio, fechaFin);
    };

    // Fetch inicial
    useEffect(() => {
        fetchMovimientos(fechaInicio, fechaFin);
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Reporte de Movimientos</h1>

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

                {/* Tabla de Movimientos */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3">Número de Tarjeta</th>
                                <th className="px-6 py-3">Monto</th>
                                <th className="px-6 py-3">Tipo de Movimiento</th>
                                <th className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.length > 0 ? (
                                movimientos.map((movimiento, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{movimiento.numero_tarjeta}</td>
                                        <td className="px-6 py-4">${parseFloat(movimiento.monto).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            {movimiento.tipo_movimiento === 'aumento' ? (
                                                <span className="flex justify-center items-center">
                                                    <ArrowUp /> <span className="ml-1">Aumento</span>
                                                </span>
                                            ) : (
                                                <span className="flex justify-center items-center">
                                                    <ArrowDown /> <span className="ml-1">Reducción</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(movimiento.fecha_movimiento).toLocaleDateString('es-ES')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center">
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

export default ReporteMovimientos;
