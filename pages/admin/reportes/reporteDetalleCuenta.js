import React, { useEffect, useState } from 'react';
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

const ReporteDetalleCuenta = () => {
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [detalleCuenta, setDetalleCuenta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch para obtener los detalles de la cuenta por número de tarjeta
    const fetchDetalleCuenta = async (numeroTarjeta) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3000/api/reportes/detalle-cuenta/${numeroTarjeta}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la cuenta');
            }
            const data = await response.json();
            setDetalleCuenta(data[0]); // Asumiendo que la respuesta es un array y tomamos el primer elemento
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Maneja el botón de buscar
    const handleBuscar = () => {
        if (numeroTarjeta) {
            fetchDetalleCuenta(numeroTarjeta);
        } else {
            setError('Por favor ingrese un número de tarjeta válido.');
        }
    };

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">Reporte de Detalle de Cuenta</h1>

                {/* Campo de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Ingrese el número de tarjeta"
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                    />
                    <button
                        onClick={handleBuscar}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Buscar
                    </button>
                </div>

                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Tabla de Detalle de Cuenta */}
                {detalleCuenta && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b">Nombre de Usuario</th>
                                    <th className="py-2 px-4 border-b">Número de Tarjeta</th>
                                    <th className="py-2 px-4 border-b">Fecha de Creación</th>
                                    <th className="py-2 px-4 border-b">Saldo Actual</th>
                                    <th className="py-2 px-4 border-b">Límite de Crédito</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td className="py-2 px-4 border-b">{detalleCuenta.nombre_usuario}</td>
                                    <td className="py-2 px-4 border-b">{detalleCuenta.numero_tarjeta}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(detalleCuenta.fecha_creacion).toLocaleString('es-ES')}
                                    </td>
                                    <td className="py-2 px-4 border-b">${parseFloat(detalleCuenta.saldo_actual).toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">${parseFloat(detalleCuenta.limite_credito).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReporteDetalleCuenta;
