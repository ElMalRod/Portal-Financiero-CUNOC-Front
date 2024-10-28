import React, { useEffect, useState } from 'react';
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

const ReporteCuentas = () => {
    const [cuentasEstado, setCuentasEstado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orden, setOrden] = useState('asc'); // Estado para el orden (ascendente o descendente)

    // Fetch para obtener los estados de cuentas
    const fetchCuentasEstado = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reportes/cuentas-estado`);
            if (!response.ok) {
                throw new Error('Error al obtener los estados de las cuentas');
            }
            const data = await response.json();
            setCuentasEstado(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Ordena las cuentas según el orden seleccionado
    const ordenarCuentas = (cuentas, orden) => {
        return cuentas.sort((a, b) => {
            if (orden === 'asc') {
                return a.estado.localeCompare(b.estado);
            } else {
                return b.estado.localeCompare(a.estado);
            }
        });
    };

    // UseEffect para llamar a la función de fetch al montar el componente
    useEffect(() => {
        fetchCuentasEstado();
    }, []);

    // Maneja el cambio de orden
    const handleOrdenar = (e) => {
        setOrden(e.target.value);
    };

    // Cuentas ordenadas
    const cuentasOrdenadas = ordenarCuentas([...cuentasEstado], orden);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Reporte de Cuentas</h1>

                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Selector para el orden */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Ordenar por Estado:</label>
                    <select value={orden} onChange={handleOrdenar} className="border border-gray-300 rounded-md p-2">
                        <option value="asc">Ascendente</option>
                        <option value="desc">Descendente</option>
                    </select>
                </div>

                {/* Tabla de Estados de Cuentas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Estado</th>
                                <th className="py-2 px-4 border-b">Total de Cuentas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuentasOrdenadas.map((cuenta, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border-b">{cuenta.estado}</td>
                                    <td className="py-2 px-4 border-b">{cuenta.total_cuentas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteCuentas;
