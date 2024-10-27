import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Tarjeta = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTarjeta, setSelectedTarjeta] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [motivo, setMotivo] = useState('');

    // Colores para los estados
    const estadoColores = {
        'activa': 'bg-green-500',
        'deshabilitada': 'bg-yellow-500',
        'bloqueada': 'bg-orange-500',
        'ELIMINADO': 'bg-red-500'
    };

    const obtenerTarjetas = async () => {
        const response = await fetch('http://localhost:3000/api/saldo/obtener-tarjetas');
        const data = await response.json();
        setTarjetas(data);
    };

    useEffect(() => {
        obtenerTarjetas();
    }, []);

    const handleCambiarEstado = (tarjeta) => {
        setSelectedTarjeta(tarjeta);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/api/cuentas/tarjetas/cambiar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tarjeta: selectedTarjeta.id_tarjeta,
                estado: nuevoEstado,
                motivo: motivo,
            }),
        });

        const result = await response.json();
        alert(result.message);
        setModalOpen(false);
        // Vuelve a obtener las tarjetas para actualizar la lista
        await obtenerTarjetas();  // Asegúrate de usar await aquí
        // Limpiar el input de motivo y el estado nuevo
        setMotivo('');
        setNuevoEstado('');
    };

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-lg font-semibold">Habilitar/Deshabilitar tarjeta</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Número de Tarjeta</th>
                            <th className="px-6 py-3">Intentos Fallidos</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tarjetas.map(tarjeta => (
                            <tr key={tarjeta.id_tarjeta} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{tarjeta.nombre_usuario}</td>
                                <td className="px-6 py-4">{tarjeta.numero_tarjeta}</td>
                                <td className="px-6 py-4">{tarjeta.intentos_fallidos}</td>
                                <td className={`px-6 py-4 flex items-center`}>
                                    <span className={`rounded-full h-3 w-3 ${estadoColores[tarjeta.estado]} mr-2`}></span>
                                    {tarjeta.estado}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleCambiarEstado(tarjeta)}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        <svg class="w-6 h-6 text-blue-700 dark:text-purple" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Cambiar Estado de la Tarjeta</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-1">
                                        Nuevo Estado:
                                    </label>
                                    <select
                                        value={nuevoEstado}
                                        onChange={(e) => setNuevoEstado(e.target.value)}
                                        required
                                        className="border border-gray-300 p-2 w-full"
                                    >
                                        <option value="">Seleccione un estado</option>
                                        <option value="activa">Activa</option>
                                        <option value="deshabilitada">Deshabilitada</option>
                                        <option value="bloqueada">Bloqueada</option>
                                        <option value="ELIMINADO">Eliminado</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">
                                        Motivo:
                                    </label>
                                    <input
                                        type="text"
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        required
                                        className="border border-gray-300 p-2 w-full"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                    >
                                        Enviar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tarjeta;
