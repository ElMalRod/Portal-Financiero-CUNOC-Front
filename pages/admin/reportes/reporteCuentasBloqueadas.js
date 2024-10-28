import React, { useEffect, useState } from 'react'; 
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

const ReporteCuentasBloqueadas = () => {
    const [cuentasBloqueadas, setCuentasBloqueadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch para obtener los datos de cuentas bloqueadas
    const fetchCuentasBloqueadas = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes/cuentas-bloqueadas`);
            if (!response.ok) {
                throw new Error('Error al obtener las cuentas bloqueadas');
            }
            const data = await response.json();
            setCuentasBloqueadas(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch inicial
    useEffect(() => {
        fetchCuentasBloqueadas();
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Reporte de Cuentas Bloqueadas</h1>

                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Tabla de Cuentas Bloqueadas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Número de Tarjeta</th>
                                <th className="py-2 px-4 border-b">Fecha de Deshabilitación</th>
                                <th className="py-2 px-4 border-b">Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuentasBloqueadas.length > 0 ? (
                                cuentasBloqueadas.map((cuenta, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border-b">{cuenta.numero_tarjeta}</td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(cuenta.fecha_deshabilitacion).toLocaleString('es-ES')}
                                        </td>
                                        <td className="py-2 px-4 border-b">{cuenta.motivo}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center">
                                        No hay cuentas bloqueadas.
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

export default ReporteCuentasBloqueadas;
