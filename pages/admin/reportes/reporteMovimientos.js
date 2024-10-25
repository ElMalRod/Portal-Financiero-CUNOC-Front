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
            const response = await fetch(`http://localhost:3000/api/reportes/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
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
                <h1 className="text-2xl font-bold mb-4">Reporte de Movimientos</h1>

                {/* Filtros por fecha */}
                <div className="flex space-x-4 mb-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        onClick={handleBuscar}
                        className="self-end bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Buscar por Fechas
                    </button>
                </div>

                {/* Tabla de Movimientos */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Número de Tarjeta</th>
                                <th className="py-2 px-4 border-b">Monto</th>
                                <th className="py-2 px-4 border-b">Tipo de Movimiento</th>
                                <th className="py-2 px-4 border-b">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.length > 0 ? (
                                movimientos.map((movimiento, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border-b">{movimiento.numero_tarjeta}</td>
                                        <td className="py-2 px-4 border-b">${parseFloat(movimiento.monto).toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">
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
                                        <td className="py-2 px-4 border-b">
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
